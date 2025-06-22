<?php
session_start();
header('Content-Type: application/json');

require_once '../config/database.php';
require_once '../config/session.php';

// Ensure user is logged in and is a provider
if (!isLoggedIn() || getUserType() !== 'provider') {
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit();
}

try {
    $database = new Database();
    $db = $database->getConnection();

    $userId = getUserId();

    // Fetch provider ID
    $stmt = $db->prepare("SELECT id FROM service_providers WHERE user_id = ?");
    $stmt->execute([$userId]);
    $provider = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$provider) {
        echo json_encode(['success' => false, 'message' => 'Provider not found']);
        exit();
    }

    $providerId = $provider['id'];

    // Fetch services
    $stmt = $db->prepare("
        SELECT s.*, sp.company_name AS provider_name, sp.location AS provider_location
        FROM services s
        JOIN service_providers sp ON s.provider_id = sp.id
        WHERE s.provider_id = ?
        ORDER BY s.created_at DESC
    ");
    $stmt->execute([$providerId]);
    $services = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $defaultImage = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80';

    // Format services for frontend
    $formattedServices = array_map(function ($service) use ($defaultImage) {
        return [
            'id' => $service['id'],
            'title' => $service['name'] ?? '',
            'description' => $service['description'] ?? '',
            'category' => $service['category'] ?? '',
            'subcategory' => $service['subcategory'] ?? '',
            'pricing' => number_format((float)($service['price'] ?? 0), 2, '.', ''),
            'features' => !empty($service['features']) ? json_decode($service['features'], true) : [],
            'image_url' => $service['image_url'] ?: $defaultImage,
            'created_at' => $service['created_at'] ?? '',
            'provider_name' => $service['provider_name'] ?? '',
            'provider_location' => $service['provider_location'] ?? ''
        ];
    }, $services);

    echo json_encode([
        'success' => true,
        'services' => $formattedServices,
        'count' => count($formattedServices)
    ]);

} catch (Exception $e) {
    error_log("Error in get-provider-services.php: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
}
