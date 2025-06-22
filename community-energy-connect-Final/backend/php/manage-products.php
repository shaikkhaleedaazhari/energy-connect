<?php
// Set headers for CORS and JSON response
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Disable output and display errors
ini_set('display_errors', 0);
error_reporting(0);

// Start session if not already started
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Include required configs
require_once '../config/database.php';
require_once '../config/session.php';

// Ensure user is logged in and is a provider
if (!isLoggedIn() || getUserType() !== 'provider') {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized access']);
    exit();
}

try {
    $database = new Database();
    $db = $database->getConnection();

    $action = $_POST['action'] ?? '';
    $userId = getUserId();

    // Get provider ID
    $stmt = $db->prepare("SELECT id FROM service_providers WHERE user_id = ?");
    $stmt->execute([$userId]);
    $provider = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$provider) {
        echo json_encode(['success' => false, 'message' => 'Provider profile not found']);
        exit();
    }

    $providerId = $provider['id'];

    switch ($action) {
        case 'create':
            $title = trim($_POST['title'] ?? '');
            $description = trim($_POST['description'] ?? '');
            $category = trim($_POST['category'] ?? '');
            $subcategory = trim($_POST['subcategory'] ?? '');
            $pricing = floatval($_POST['pricing'] ?? 0);
            $specifications = trim($_POST['specifications'] ?? '');
            $image_url = trim($_POST['image_url'] ?? '');

            if (empty($image_url)) {
                $image_url = 'https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=400&q=80';
            }

            // Validation
            if (empty($title) || empty($description) || empty($category) || empty($subcategory)) {
                echo json_encode(['success' => false, 'message' => 'All fields are required']);
                exit();
            }
            if ($pricing <= 0) {
                echo json_encode(['success' => false, 'message' => 'Price must be greater than 0']);
                exit();
            }

            // Insert new product
            $stmt = $db->prepare("
                INSERT INTO products (provider_id, name, description, category, subcategory, price, specifications, image_url, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
            ");
            $success = $stmt->execute([
                $providerId, $title, $description, $category, $subcategory, $pricing, $specifications, $image_url
            ]);

            echo json_encode([
                'success' => $success,
                'message' => $success ? 'Product created successfully' : 'Failed to create product'
            ]);
            break;

        case 'update':
            $id = intval($_POST['id'] ?? 0);
            $title = trim($_POST['title'] ?? '');
            $description = trim($_POST['description'] ?? '');
            $category = trim($_POST['category'] ?? '');
            $subcategory = trim($_POST['subcategory'] ?? '');
            $pricing = floatval($_POST['pricing'] ?? 0);
            $specifications = trim($_POST['specifications'] ?? '');
            $image_url = trim($_POST['image_url'] ?? '');

            if ($id <= 0) {
                echo json_encode(['success' => false, 'message' => 'Invalid product ID']);
                exit();
            }

            $stmt = $db->prepare("
                UPDATE products 
                SET name = ?, description = ?, category = ?, subcategory = ?, price = ?, specifications = ?, image_url = ?, updated_at = NOW()
                WHERE id = ? AND provider_id = ?
            ");
            $success = $stmt->execute([
                $title, $description, $category, $subcategory, $pricing, $specifications, $image_url, $id, $providerId
            ]);

            echo json_encode([
                'success' => $success,
                'message' => $success ? 'Product updated successfully' : 'Failed to update product'
            ]);
            break;

        case 'delete':
            $id = intval($_POST['id'] ?? 0);

            if ($id <= 0) {
                echo json_encode(['success' => false, 'message' => 'Invalid product ID']);
                exit();
            }

            $stmt = $db->prepare("DELETE FROM products WHERE id = ? AND provider_id = ?");
            $success = $stmt->execute([$id, $providerId]);

            echo json_encode([
                'success' => $success,
                'message' => $success ? 'Product deleted successfully' : 'Failed to delete product'
            ]);
            break;

        default:
            echo json_encode(['success' => false, 'message' => 'Invalid action specified']);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
}
?>
