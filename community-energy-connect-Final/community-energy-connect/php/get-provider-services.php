<?php
session_start();
header('Content-Type: application/json');
require_once '../config/database.php';
require_once '../config/session.php';

// Check if user is logged in and is a provider
if (!isLoggedIn() || getUserType() !== 'provider') {
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit();
}

try {
    $database = new Database();
    $db = $database->getConnection();
    
    $userId = getUserId();
    
    // Get provider ID
    $stmt = $db->prepare("SELECT id FROM service_providers WHERE user_id = ?");
    $stmt->execute([$userId]);
    $provider = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$provider) {
        echo json_encode(['success' => false, 'message' => 'Provider not found']);
        exit();
    }
    
    $providerId = $provider['id'];
    
    // Get all services for this provider
    $stmt = $db->prepare("
        SELECT s.*, sp.company_name as provider_name, sp.location as provider_location
        FROM services s
        JOIN service_providers sp ON s.provider_id = sp.id
        WHERE s.provider_id = ?
        ORDER BY s.created_at DESC
    ");
    $stmt->execute([$providerId]);
    $services = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Format the services data
    $formattedServices = array_map(function($service) {
        return [
            'id' => $service['id'],
            'title' => $service['name'],
            'description' => $service['description'],
            'category' => $service['category'],
            'subcategory' => $service['subcategory'],
            'pricing' => $service['price'],
            'features' => $service['features'],
            'image_url' => $service['image_url'],
            'created_at' => $service['created_at'],
            'provider_name' => $service['provider_name'],
            'provider_location' => $service['provider_location']
        ];
    }, $services);
    
    echo json_encode([
        'success' => true, 
        'services' => $formattedServices,
        'count' => count($formattedServices)
    ]);
    
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
}
?>
