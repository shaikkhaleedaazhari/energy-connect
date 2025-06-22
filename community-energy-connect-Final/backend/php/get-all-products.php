<?php
// Enable CORS if needed
header("Access-Control-Allow-Origin: http://k8s-default-appingre-f839a6fdd0-522583786.us-east-1.elb.amazonaws.com");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

// Include DB config
require_once '../config/database.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    $category = trim($_GET['category'] ?? '');
    $search = trim($_GET['search'] ?? '');

    // Base query with join
    $baseSql = "
        SELECT p.*, sp.company_name as provider_name, sp.location as provider_location
        FROM products p
        JOIN service_providers sp ON p.provider_id = sp.id
    ";

    $conditions = [];
    $params = [];

    // Add category filter
    if (!empty($category)) {
        $conditions[] = "p.category = ?";
        $params[] = $category;
    }

    // Add search filter
    if (!empty($search)) {
        $conditions[] = "(p.name LIKE ? OR p.description LIKE ?)";
        $searchTerm = "%$search%";
        $params[] = $searchTerm;
        $params[] = $searchTerm;
    }

    // Combine conditions if any
    if (!empty($conditions)) {
        $baseSql .= " WHERE " . implode(" AND ", $conditions);
    }

    // Final ordering
    $baseSql .= " ORDER BY p.name ASC";

    // Prepare and execute
    $stmt = $db->prepare($baseSql);
    $stmt->execute($params);
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Format output
    $formattedProducts = array_map(function ($product) {
        return [
            'id' => $product['id'],
            'title' => $product['name'],
            'description' => $product['description'],
            'category' => $product['category'],
            'subcategory' => $product['subcategory'],
            'pricing' => $product['price'],
            'specifications' => json_decode($product['specifications'] ?? '[]', true),
            'provider_name' => $product['provider_name'],
            'provider_location' => $product['provider_location'],
            'image_url' => $product['image_url'] ?: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80'
        ];
    }, $products);

    echo json_encode(['success' => true, 'products' => $formattedProducts]);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Server error: ' . $e->getMessage()
    ]);
}
?>
