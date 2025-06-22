<?php
// Allow frontend to fetch from backend hosted on ALB or different origin
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once '../config/database.php';

try {
    $database = new Database();
    $db = $database->getConnection();

    // Sanitize input filters
    $category = trim($_GET['category'] ?? '');
    $priceRange = trim($_GET['priceRange'] ?? '');
    $availability = trim($_GET['availability'] ?? '');
    $search = trim($_GET['search'] ?? '');

    // Base query
    $query = "SELECT s.*, sp.company_name 
              FROM services s 
              LEFT JOIN service_providers sp ON s.provider_id = sp.id 
              WHERE 1=1";
    $params = [];

    // Category filter
    if (!empty($category)) {
        $query .= " AND LOWER(s.category) = LOWER(?)";
        $params[] = $category;
    }

    // Price range filter
    if (!empty($priceRange)) {
        switch ($priceRange) {
            case '0-1000':
                $query .= " AND s.price BETWEEN 0 AND 1000";
                break;
            case '1000-5000':
                $query .= " AND s.price BETWEEN 1000 AND 5000";
                break;
            case '5000+':
                $query .= " AND s.price >= 5000";
                break;
        }
    }

    // Availability filter
    if (!empty($availability)) {
        $avail = strtolower($availability);
        if (in_array($avail, ['available', 'unavailable'])) {
            $query .= " AND LOWER(s.availability) = ?";
            $params[] = ucfirst($avail);
        }
    }

    // Search filter
    if (!empty($search)) {
        $query .= " AND (s.name LIKE ? OR s.description LIKE ? OR s.category LIKE ? OR s.subcategory LIKE ?)";
        $searchTerm = "%$search%";
        $params = array_merge($params, [$searchTerm, $searchTerm, $searchTerm, $searchTerm]);
    }

    $query .= " ORDER BY s.created_at DESC";

    // Execute query
    $stmt = $db->prepare($query);
    if (!$stmt->execute($params)) {
        throw new Exception("Query execution failed");
    }

    $services = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Format results
    foreach ($services as &$service) {
        $service['features'] = !empty($service['features']) 
            ? json_decode($service['features'], true) 
            : [];

        $service['price'] = isset($service['price']) 
            ? number_format((float)$service['price'], 2, '.', '') 
            : '0.00';

        $service['image_url'] = $service['image_url'] ?: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=400&q=80';
    }

    echo json_encode([
        'success' => true,
        'services' => $services
    ]);

} catch (Exception $e) {
    error_log("Error in get-services.php: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'Failed to load services. Please try again later.',
        'error' => $e->getMessage()
    ]);
}
