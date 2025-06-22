<?php
header('Content-Type: application/json');
require_once '../config/database.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    $productId = $_GET['id'] ?? '';
    
    if (empty($productId)) {
        echo json_encode(['success' => false, 'message' => 'Product ID required']);
        exit();
    }
    
    // Get provider product details
    $stmt = $db->prepare("
        SELECT pp.*, sp.company_name, sp.description as provider_description, 
               sp.rating, sp.image_url as provider_image, sp.contact_name, sp.phone_number, sp.location
        FROM provider_products pp 
        LEFT JOIN service_providers sp ON pp.provider_id = sp.id 
        WHERE pp.id = ? AND pp.status = 'active'
    ");
    $stmt->execute([$productId]);
    $product = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$product) {
        echo json_encode(['success' => false, 'message' => 'Product not found']);
        exit();
    }
    
    // Separate product and provider data
    $provider = null;
    if ($product['company_name']) {
        $provider = [
            'id' => $product['provider_id'],
            'company_name' => $product['company_name'],
            'description' => $product['provider_description'],
            'rating' => $product['rating'],
            'image_url' => $product['provider_image'],
            'contact_name' => $product['contact_name'],
            'phone_number' => $product['phone_number'],
            'location' => $product['location']
        ];
    }
    
    // Remove provider fields from product data
    unset($product['company_name'], $product['provider_description'], $product['rating'], $product['provider_image'], $product['contact_name'], $product['phone_number'], $product['location'], $product['provider_id']);
    
    echo json_encode([
        'success' => true, 
        'product' => $product,
        'provider' => $provider
    ]);
    
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
}
?>
