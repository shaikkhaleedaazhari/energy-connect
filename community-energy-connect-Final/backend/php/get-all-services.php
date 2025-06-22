<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

require_once '../config/database.php';

try {
    $database = new Database();
    $db = $database->getConnection();

    $category = trim($_GET['category'] ?? '');
    $search = trim($_GET['search'] ?? '');

    $baseQuery = "
        SELECT s.*, sp.company_name AS provider_name, sp.location AS provider_location
        FROM services s
        JOIN service_providers sp ON s.provider_id = sp.id
    ";

    $where = [];
    $params = [];

    if (!empty($category)) {
        $where[] = "LOWER(s.category) = LOWER(?)";
        $params[] = $category;
    }

    if (!empty($search)) {
        $where[] = "(s.name LIKE ? OR s.description LIKE ?)";
        $searchTerm = "%$search%";
        $params[] = $searchTerm;
        $params[] = $searchTerm;
    }

    if ($where) {
        $baseQuery .= " WHERE " . implode(" AND ", $where);
    }

    $baseQuery .= " ORDER BY s.name ASC";

    $stmt = $db->prepare($baseQuery);
    $stmt->execute($params);
    $services = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $formattedServices = array_map(function ($service) {
        return [
            'id' => $service['id'],
            'title' => $service['name'],
            'description' => $service['description'],
            'category' => $service['category'],
            'subcategory' => $service['subcategory'],
            'pricing' => number_format((float)$service['price'], 2, '.', ''),
            'features' => !empty($service['features']) ? json_decode($service['features'], true) : [],
            'provider_name' => $service['provider_name'],
            'provider_location' => $service['provider_location'],
            'image_url' => $service['image_url'] ?: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80'
        ];
    }, $services);

    echo json_encode([
        'success' => true,
        'services' => $formattedServices
    ]);

} catch (Exception $e) {
    error_log("Error in get-all-services.php: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'Server error: ' . $e->getMessage()
    ]);
}
