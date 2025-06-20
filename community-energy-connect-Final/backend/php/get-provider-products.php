<?php
session_start();
header('Content-Type: application/json');
require_once '../config/database.php';
require_once '../config/session.php';

// Check if user is logged in and is a provider
if (!isLoggedIn() || getUserType() !== 'provider') {
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit();
}

try {
    $database = new Database();
    $db = $database->getConnection();
    
    $userId = getUserId();
    
    // Get provider ID
    $stmt = $db->prepare("SELECT id FROM service_providers WHERE user_id = ?");
    $stmt->execute([$userId]);
    $provider = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$provider) {
        echo json_encode(['success' => false, 'message' => 'Provider not found']);
        exit();
    }
    
    $providerId = $provider['id'];
    
    // Get all products for this provider
    $stmt = $db->prepare("
        SELECT p.*, sp.company_name as provider_name, sp.location as provider_location
        FROM products p
        JOIN service_providers sp ON p.provider_id = sp.id
        WHERE p.provider_id = ?
        ORDER BY p.created_at DESC
    ");
    $stmt->execute([$providerId]);
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Format the products data
    $formattedProducts = array_map(function($product) {
        return [
            'id' => $product['id'],
            'title' => $product['name'],
            'description' => $product['description'],
            'category' => $product['category'],
            'subcategory' => $product['subcategory'],
            'pricing' => $product['price'],
            'specifications' => $product['specifications'],
            'image_url' => $product['image_url'],
            'created_at' => $product['created_at'],
            'provider_name' => $product['provider_name'],
            'provider_location' => $product['provider_location']
        ];
    }, $products);
    
    echo json_encode([
        'success' => true, 
        'products' => $formattedProducts,
        'count' => count($formattedProducts)
    ]);
    
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
}
?>
