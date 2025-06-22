<?php
// Allow CORS if frontend is hosted separately
header("Access-Control-Allow-Origin: http://k8s-default-appingre-f839a6fdd0-522583786.us-east-1.elb.amazonaws.com");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

require_once '../config/database.php';

try {
    $database = new Database();
    $db = $database->getConnection();

    // Sanitize and trim inputs
    $category = trim($_GET['category'] ?? '');
    $priceRange = trim($_GET['priceRange'] ?? '');
    $availability = trim($_GET['availability'] ?? '');
    $search = trim($_GET['search'] ?? '');

    $query = "SELECT p.*, sp.company_name 
              FROM products p 
              LEFT JOIN service_providers sp ON p.provider_id = sp.id 
              WHERE 1=1";

    $params = [];

    // Category filter
    if (!empty($category)) {
        $query .= " AND p.category = ?";
        $params[] = $category;
    }

    // Price range filter
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

    // Availability filter
    if (!empty($availability)) {
        $availability = strtolower($availability);
        if (in_array($availability, ['available', 'unavailable'])) {
            $query .= " AND LOWER(p.availability) = ?";
            $params[] = ucfirst($availability); // 'Available' or 'Unavailable'
        }
    }

    // Search filter
    if (!empty($search)) {
        $query .= " AND (p.name LIKE ? OR p.description LIKE ? OR p.category LIKE ? OR p.subcategory LIKE ?)";
        $searchTerm = "%$search%";
        $params = array_merge($params, [$searchTerm, $searchTerm, $searchTerm, $searchTerm]);
    }

    $query .= " ORDER BY p.created_at DESC";

    // Execute query
    $stmt = $db->prepare($query);
    $stmt->execute($params);
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if ($products === false) {
        throw new Exception("Unable to fetch products.");
    }

    // Format and clean results
    foreach ($products as &$product) {
        $product['specifications'] = !empty($product['specifications']) 
            ? json_decode($product['specifications'], true) 
            : [];

        $product['price'] = isset($product['price']) 
            ? number_format((float)$product['price'], 2, '.', '') 
            : "0.00";

        $product['image_url'] = $product['image_url'] ?: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=400&q=80';
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
