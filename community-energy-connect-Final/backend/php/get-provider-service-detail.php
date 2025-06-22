<?php
// Allow CORS if frontend is separate (adjust domain as needed)
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once '../config/database.php';

try {
    $database = new Database();
    $db = $database->getConnection();

    // Sanitize input
    $serviceId = trim($_GET['id'] ?? '');

    if (empty($serviceId)) {
        echo json_encode(['success' => false, 'message' => 'Service ID is required']);
        exit();
    }

    // Fetch provider service details
    $stmt = $db->prepare("
        SELECT ps.*, sp.id AS provider_id, sp.company_name, sp.description AS provider_description, 
               sp.rating, sp.image_url AS provider_image, sp.contact_name, sp.phone_number, sp.location
        FROM provider_services ps 
        LEFT JOIN service_providers sp ON ps.provider_id = sp.id 
        WHERE ps.id = ? AND ps.status = 'active'
    ");
    $stmt->execute([$serviceId]);
    $service = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$service) {
        echo json_encode(['success' => false, 'message' => 'Service not found']);
        exit();
    }

    // Prepare provider info
    $provider = null;
    if (!empty($service['company_name'])) {
        $provider = [
            'id' => (int)$service['provider_id'],
            'company_name' => $service['company_name'],
            'description' => $service['provider_description'],
            'rating' => $service['rating'],
            'image_url' => $service['provider_image'] ?: 'https://images.unsplash.com/photo-1492724441997-5dc865305da6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80',
            'contact_name' => $service['contact_name'],
            'phone_number' => $service['phone_number'],
            'location' => $service['location']
        ];
    }

    // Remove provider-specific fields from main service object
    unset(
        $service['company_name'],
        $service['provider_description'],
        $service['rating'],
        $service['provider_image'],
        $service['contact_name'],
        $service['phone_number'],
        $service['location']
    );

    echo json_encode([
        'success' => true,
        'service' => $service,
        'provider' => $provider
    ]);
} catch (Exception $e) {
    error_log("Error in get-provider-service-detail.php: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
}
?>
