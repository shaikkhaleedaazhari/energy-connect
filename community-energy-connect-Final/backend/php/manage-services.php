<?php
// CORS Headers to allow frontend access
header("Access-Control-Allow-Origin: http://k8s-default-appingre-f839a6fdd0-522583786.us-east-1.elb.amazonaws.com");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

// Start session if not already started
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Disable output that may interfere with JSON
ini_set('display_errors', 0);
error_reporting(0);

// Includes
require_once '../config/database.php';
require_once '../config/session.php';

// Check session & provider role
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
            $features = trim($_POST['features'] ?? '');
            $image_url = trim($_POST['image_url'] ?? '');

            // Convert multiline text to JSON array if not already JSON
            if ($features && $features[0] !== '[') {
                $features = json_encode(array_filter(array_map('trim', explode("\n", $features))));
            }

            if (empty($image_url)) {
                $image_url = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=400&q=80';
            }

            // Basic validation
            if (!$title || !$description || !$category || !$subcategory) {
                echo json_encode(['success' => false, 'message' => 'All required fields must be filled']);
                exit();
            }

            // Insert service
            $stmt = $db->prepare("
                INSERT INTO services (provider_id, name, description, category, subcategory, price, features, image_url, created_at) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
            ");
            $result = $stmt->execute([
                $providerId, $title, $description, $category, $subcategory, $pricing, $features, $image_url
            ]);

            echo json_encode([
                'success' => $result,
                'message' => $result ? 'Service created successfully' : 'Failed to create service'
            ]);
            break;

        case 'update':
            $id = intval($_POST['id'] ?? 0);
            $title = trim($_POST['title'] ?? '');
            $description = trim($_POST['description'] ?? '');
            $category = trim($_POST['category'] ?? '');
            $subcategory = trim($_POST['subcategory'] ?? '');
            $pricing = floatval($_POST['pricing'] ?? 0);
            $features = trim($_POST['features'] ?? '');
            $image_url = trim($_POST['image_url'] ?? '');

            if ($features && $features[0] !== '[') {
                $features = json_encode(array_filter(array_map('trim', explode("\n", $features))));
            }

            if ($id <= 0) {
                echo json_encode(['success' => false, 'message' => 'Invalid service ID']);
                exit();
            }

            $stmt = $db->prepare("
                UPDATE services 
                SET name = ?, description = ?, category = ?, subcategory = ?, price = ?, features = ?, image_url = ?, updated_at = NOW()
                WHERE id = ? AND provider_id = ?
            ");
            $result = $stmt->execute([
                $title, $description, $category, $subcategory, $pricing, $features, $image_url, $id, $providerId
            ]);

            echo json_encode([
                'success' => $result,
                'message' => $result ? 'Service updated successfully' : 'Failed to update service'
            ]);
            break;

        case 'delete':
            $id = intval($_POST['id'] ?? 0);

            if ($id <= 0) {
                echo json_encode(['success' => false, 'message' => 'Invalid service ID']);
                exit();
            }

            $stmt = $db->prepare("DELETE FROM services WHERE id = ? AND provider_id = ?");
            $result = $stmt->execute([$id, $providerId]);

            echo json_encode([
                'success' => $result,
                'message' => $result ? 'Service deleted successfully' : 'Failed to delete service'
            ]);
            break;

        default:
            echo json_encode(['success' => false, 'message' => 'Invalid action specified']);
    }

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
}
