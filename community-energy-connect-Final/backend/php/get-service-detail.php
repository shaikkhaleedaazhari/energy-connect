<?php
// CORS Headers to allow frontend access via ALB
header("Access-Control-Allow-Origin: http://k8s-default-appingre-f839a6fdd0-522583786.us-east-1.elb.amazonaws.com");
header("Access-Control-Allow-Credentials: true");
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
    
    // Get service details with provider info
    $stmt = $db->prepare("SELECT s.*, p.company_name, p.contact_name, p.phone_number, p.location 
                         FROM services s 
                         LEFT JOIN service_providers p ON s.provider_id = p.id 
                         WHERE s.id = ?");
    $stmt->execute([$serviceId]);
    $service = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$service) {
        echo json_encode(['success' => false, 'message' => 'Service not found']);
        exit();
    }
    
    // Decode features from JSON
    if (!empty($service['features'])) {
        $service['features'] = json_decode($service['features'], true);
    } else {
        $service['features'] = [];
    }

    // Extract provider info separately
    $provider = null;
    if ($service['provider_id']) {
        $provider = [
            'company_name' => $service['company_name'],
            'contact_name' => $service['contact_name'],
            'phone_number' => $service['phone_number'],
            'location' => $service['location']
        ];
        unset($service['company_name'], $service['contact_name'], $service['phone_number'], $service['location']);
    }
    
    echo json_encode([
        'success' => true, 
        'service' => $service,
        'provider' => $provider
    ]);
    
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
}
