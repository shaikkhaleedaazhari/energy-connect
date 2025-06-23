<?php
header('Content-Type: application/json');
require_once '../config/database.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    $category = $_GET['category'] ?? '';
    $search = $_GET['search'] ?? '';
    
    // Get all services with provider information
    $sql = "
        SELECT s.*, sp.company_name as provider_name, sp.location as provider_location
        FROM services s
        JOIN service_providers sp ON s.provider_id = sp.id
    ";
    
    $params = [];
    
    if (!empty($category)) {
        $sql = "SELECT * FROM ($sql) as all_services WHERE category = ?";
        $params[] = $category;
    }
    
    if (!empty($search)) {
        if (!empty($category)) {
            $sql .= " AND (name LIKE ? OR description LIKE ?)";
        } else {
            $sql = "SELECT * FROM ($sql) as all_services WHERE (name LIKE ? OR description LIKE ?)";
        }
        $searchTerm = "%$search%";
        $params[] = $searchTerm;
        $params[] = $searchTerm;
    }
    
    $sql .= " ORDER BY name";
    
    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    $services = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Format services for frontend
    $formattedServices = array_map(function($service) {
        return [
            'id' => $service['id'],
            'title' => $service['name'],
            'description' => $service['description'],
            'category' => $service['category'],
            'subcategory' => $service['subcategory'],
            'pricing' => $service['price'],
            'features' => $service['features'],
            'provider_name' => $service['provider_name'],
            'provider_location' => $service['provider_location'],
            'image_url' => $service['image_url'] ?: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80'
        ];
    }, $services);
    
    echo json_encode(['success' => true, 'services' => $formattedServices]);
    
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
}
?>
