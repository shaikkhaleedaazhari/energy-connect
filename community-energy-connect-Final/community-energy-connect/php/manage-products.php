<?php
// Start session only if not already started
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Set content type to JSON immediately
header('Content-Type: application/json');

// Disable any output that might interfere with JSON
ini_set('display_errors', 0);
error_reporting(0);

// Include required files
require_once '../config/database.php';
require_once '../config/session.php';

// Check if user is logged in and is a provider
if (!isLoggedIn() || getUserType() !== 'provider') {
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
            
            // Set default image if none provided
            if (empty($image_url)) {
                $image_url = 'https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=400&q=80';
            }
            
            // Validation - check for required fields
            if (empty($title)) {
                echo json_encode(['success' => false, 'message' => 'Product title is required']);
                exit();
            }
            
            if (empty($description)) {
                echo json_encode(['success' => false, 'message' => 'Product description is required']);
                exit();
            }
            
            if (empty($category)) {
                echo json_encode(['success' => false, 'message' => 'Product category is required']);
                exit();
            }
            
            if (empty($subcategory)) {
                echo json_encode(['success' => false, 'message' => 'Product type is required']);
                exit();
            }
            
            if ($pricing <= 0) {
                echo json_encode(['success' => false, 'message' => 'Product price must be greater than 0']);
                exit();
            }
            
            // Insert product
            $stmt = $db->prepare("
                INSERT INTO products (provider_id, name, description, category, subcategory, price, specifications, image_url, created_at) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
            ");
            $result = $stmt->execute([$providerId, $title, $description, $category, $subcategory, $pricing, $specifications, $image_url]);
            
            if ($result) {
                echo json_encode(['success' => true, 'message' => 'Product created successfully']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Failed to create product']);
            }
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
            $result = $stmt->execute([$title, $description, $category, $subcategory, $pricing, $specifications, $image_url, $id, $providerId]);
            
            if ($result) {
                echo json_encode(['success' => true, 'message' => 'Product updated successfully']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Failed to update product']);
            }
            break;
            
        case 'delete':
            $id = intval($_POST['id'] ?? 0);
            
            if ($id <= 0) {
                echo json_encode(['success' => false, 'message' => 'Invalid product ID']);
                exit();
            }
            
            $stmt = $db->prepare("DELETE FROM products WHERE id = ? AND provider_id = ?");
            $result = $stmt->execute([$id, $providerId]);
            
            if ($result) {
                echo json_encode(['success' => true, 'message' => 'Product deleted successfully']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Failed to delete product']);
            }
            break;
            
        default:
            echo json_encode(['success' => false, 'message' => 'Invalid action specified']);
    }
    
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
}
?>
