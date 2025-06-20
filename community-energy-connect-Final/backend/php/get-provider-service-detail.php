<?php
header('Content-Type: application/json');
require_once '../config/database.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    $serviceId = $_GET['id'] ?? '';
    
    if (empty($serviceId)) {
        echo json_encode(['success' => false, 'message' => 'Service ID required']);
        exit();
    }
    
    // Get provider service details
    $stmt = $db->prepare("
        SELECT ps.*, sp.company_name, sp.description as provider_description, 
               sp.rating, sp.image_url as provider_image, sp.contact_name, sp.phone_number, sp.location
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
    
    // Separate service and provider data
    $provider = null;
    if ($service['company_name']) {
        $provider = [
            'id' => $service['provider_id'],
            'company_name' => $service['company_name'],
            'description' => $service['provider_description'],
            'rating' => $service['rating'],
            'image_url' => $service['provider_image'],
            'contact_name' => $service['contact_name'],
            'phone_number' => $service['phone_number'],
            'location' => $service['location']
        ];
    }
    
    // Remove provider fields from service data
    unset($service['company_name'], $service['provider_description'], $service['rating'], $service['provider_image'], $service['contact_name'], $service['phone_number'], $service['location'], $service['provider_id']);
    
    echo json_encode([
        'success' => true, 
        'service' => $service,
        'provider' => $provider
    ]);
    
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
}
?>
