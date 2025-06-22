<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../config/database.php';

try {
    $database = new Database();
    $db = $database->getConnection();

    // Get product ID from GET request
    $productId = isset($_GET['id']) ? trim($_GET['id']) : '';

    if (empty($productId)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Product ID is required']);
        exit();
    }

    // Prepare SQL to fetch product and provider info
    $stmt = $db->prepare("
        SELECT 
            pp.id, pp.name, pp.description, pp.price, pp.image_url, pp.category,
            sp.id AS provider_id, sp.company_name, sp.description AS provider_description,
            sp.rating, sp.image_url AS provider_image, sp.contact_name, sp.phone_number, sp.location
        FROM provider_products pp
        LEFT JOIN service_providers sp ON pp.provider_id = sp.id
        WHERE pp.id = ? AND pp.status = 'active'
        LIMIT 1
    ");

    $stmt->execute([$productId]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$row) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Product not found']);
        exit();
    }

    // Structure product data
    $product = [
        'id' => $row['id'],
        'name' => $row['name'],
        'description' => $row['description'],
        'price' => $row['price'],
        'image_url' => $row['image_url'],
        'category' => $row['category']
    ];

    // Structure provider data
    $provider = [
        'id' => $row['provider_id'],
        'company_name' => $row['company_name'],
        'description' => $row['provider_description'],
        'rating' => $row['rating'],
        'image_url' => $row['provider_image'],
        'contact_name' => $row['contact_name'],
        'phone_number' => $row['phone_number'],
        'location' => $row['location']
    ];

    // Return successful response
    echo json_encode([
        'success' => true,
        'product' => $product,
        'provider' => $provider
    ], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
}
?>
