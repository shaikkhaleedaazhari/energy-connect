<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../config/database.php';

try {
    $database = new Database();
    $db = $database->getConnection();

    // Sanitize GET inputs
    $search = isset($_GET['search']) ? trim($_GET['search']) : '';
    $service_type = isset($_GET['service_type']) ? trim($_GET['service_type']) : '';
    $location = isset($_GET['location']) ? trim($_GET['location']) : '';

    // Base SQL query
    $sql = "SELECT id, company_name, description, services, rating, image_url, contact_name, phone_number, location 
            FROM service_providers 
            WHERE status = 'active'";
    $params = [];

    // Dynamic filters
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

    // Execute query
    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    $providers = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'providers' => $providers
    ], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Server error: ' . $e->getMessage()
    ]);
}
?>
