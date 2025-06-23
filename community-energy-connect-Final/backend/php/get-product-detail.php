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
    
    // Get product details from the products table with provider information
    $stmt = $db->prepare("SELECT p.*, sp.company_name, sp.contact_name, sp.phone_number, sp.location 
                         FROM products p 
                         LEFT JOIN service_providers sp ON p.provider_id = sp.id 
                         WHERE p.id = ?");
    $stmt->execute([$productId]);
    $product = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$product) {
        echo json_encode(['success' => false, 'message' => 'Product not found']);
        exit();
    }

    // Convert specifications from JSON string to array if it exists
    if (!empty($product['specifications'])) {
        $product['specifications'] = json_decode($product['specifications'], true);
    } else {
        $product['specifications'] = [];
    }

    // Prepare provider data
    $provider = null;
    if ($product['provider_id']) {
        $provider = [
            'company_name' => $product['company_name'],
            'contact_name' => $product['contact_name'],
            'phone_number' => $product['phone_number'],
            'location' => $product['location']
        ];
        // Remove provider fields from product array to avoid duplication
        unset($product['company_name'], $product['contact_name'], $product['phone_number'], $product['location']);
    }
    // Ensure provider_id is included and is an integer
    $product['provider_id'] = (int)($product['provider_id'] ?? 0);
    
    echo json_encode([
        'success' => true, 
        'product' => $product,
        'provider' => $provider
    ]);
    
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
}
?>
