<?php
header('Content-Type: application/json');
require_once '../config/database.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    $category = $_GET['category'] ?? '';
    $search = $_GET['search'] ?? '';
    
    // Get all products with provider information
    $sql = "
        SELECT p.*, sp.company_name as provider_name, sp.location as provider_location
        FROM products p
        JOIN service_providers sp ON p.provider_id = sp.id
    ";
    
    $params = [];
    
    if (!empty($category)) {
        $sql = "SELECT * FROM ($sql) as all_products WHERE category = ?";
        $params[] = $category;
    }
    
    if (!empty($search)) {
        if (!empty($category)) {
            $sql .= " AND (name LIKE ? OR description LIKE ?)";
        } else {
            $sql = "SELECT * FROM ($sql) as all_products WHERE (name LIKE ? OR description LIKE ?)";
        }
        $searchTerm = "%$search%";
        $params[] = $searchTerm;
        $params[] = $searchTerm;
    }
    
    $sql .= " ORDER BY name";
    
    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Format products for frontend
    $formattedProducts = array_map(function($product) {
        return [
            'id' => $product['id'],
            'title' => $product['name'],
            'description' => $product['description'],
            'category' => $product['category'],
            'subcategory' => $product['subcategory'],
            'pricing' => $product['price'],
            'specifications' => $product['specifications'],
            'provider_name' => $product['provider_name'],
            'provider_location' => $product['provider_location'],
            'image_url' => $product['image_url'] ?: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80'
        ];
    }, $products);
    
    echo json_encode(['success' => true, 'products' => $formattedProducts]);
    
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
}
?>
