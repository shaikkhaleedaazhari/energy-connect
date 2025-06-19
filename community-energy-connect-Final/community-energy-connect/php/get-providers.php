<?php
header('Content-Type: application/json');
require_once '../config/database.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    $search = $_GET['search'] ?? '';
    $service_type = $_GET['service_type'] ?? '';
    $location = $_GET['location'] ?? '';
    
    $sql = "SELECT * FROM service_providers WHERE 1=1";
    $params = [];
    
    if (!empty($search)) {
        $sql .= " AND (company_name LIKE ? OR services LIKE ? OR description LIKE ?)";
        $searchTerm = "%$search%";
        $params[] = $searchTerm;
        $params[] = $searchTerm;
        $params[] = $searchTerm;
    }
    
    if (!empty($service_type)) {
        $sql .= " AND services LIKE ?";
        $params[] = "%$service_type%";
    }
    
    if (!empty($location)) {
        $sql .= " AND location LIKE ?";
        $params[] = "%$location%";
    }
    
    $sql .= " ORDER BY rating DESC";
    
    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    $providers = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode(['success' => true, 'providers' => $providers]);
    
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
}
?>
