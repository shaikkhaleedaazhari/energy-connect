<?php
header('Content-Type: application/json');

// Include database configuration
require_once '../config/database.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    // Get filter parameters
    $category = $_GET['category'] ?? '';
    $priceRange = $_GET['priceRange'] ?? '';
    $availability = $_GET['availability'] ?? '';
    $search = $_GET['search'] ?? '';
    
    // Build the base query
    $query = "SELECT p.*, sp.company_name 
              FROM products p 
              LEFT JOIN service_providers sp ON p.provider_id = sp.id 
              WHERE 1=1";
    $params = [];
    
    // Add category filter if specified
    if (!empty($category)) {
        $query .= " AND p.category = ?";
        $params[] = $category;
    }
    
    // Add price range filter if specified
    if (!empty($priceRange)) {
        switch ($priceRange) {
            case '0-1000':
                $query .= " AND p.price BETWEEN 0 AND 1000";
                break;
            case '1000-5000':
                $query .= " AND p.price BETWEEN 1000 AND 5000";
                break;
            case '5000+':
                $query .= " AND p.price >= 5000";
                break;
        }
    }
    
    // Add availability filter if specified
    if (!empty($availability)) {
        $availability = strtolower($availability);
        if ($availability === 'available' || $availability === 'unavailable') {
            $query .= " AND LOWER(p.availability) = ?";
            $params[] = ucfirst($availability);
        }
    }
    
    // Add search filter if specified
    if (!empty($search)) {
        $query .= " AND (p.name LIKE ? OR p.description LIKE ? OR p.category LIKE ? OR p.subcategory LIKE ?)";
        $searchTerm = "%$search%";
        $params = array_merge($params, [$searchTerm, $searchTerm, $searchTerm, $searchTerm]);
    }
    
    // Order by most recent first
    $query .= " ORDER BY p.created_at DESC";
    
    // Prepare and execute the query
    $stmt = $db->prepare($query);
    if (!$stmt->execute($params)) {
        throw new Exception("Failed to execute query");
    }
    
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    if ($products === false) {
        throw new Exception("Failed to fetch products");
    }
    
    // Process the results
    foreach ($products as &$product) {
        // Parse specifications if they exist
        if (!empty($product['specifications'])) {
            $product['specifications'] = json_decode($product['specifications'], true);
        } else {
            $product['specifications'] = [];
        }
        
        // Format price to 2 decimal places
        if (isset($product['price'])) {
            $product['price'] = number_format((float)$product['price'], 2, '.', '');
        }
        
        // Ensure image_url has a default value
        if (empty($product['image_url'])) {
            $product['image_url'] = 'https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=400&q=80';
        }
    }
    
    echo json_encode([
        'success' => true,
        'products' => $products
    ]);
    
} catch (Exception $e) {
    error_log("Error in get-products.php: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'Failed to load products. Please try again later.',
        'error' => $e->getMessage()
    ]);
}
?>
