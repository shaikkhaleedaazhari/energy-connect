<?php
header('Content-Type: application/json');

// Include database configuration
require_once '../config/database.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    // Get filter parameters
    $category = $_GET['category'] ?? '';
    $priceRange = $_GET['priceRange'] ?? '';
    $availability = $_GET['availability'] ?? '';
    $search = $_GET['search'] ?? '';
    
    // Build the base query
    $query = "SELECT s.*, sp.company_name 
              FROM services s 
              LEFT JOIN service_providers sp ON s.provider_id = sp.id 
              WHERE 1=1";
    $params = [];
    
    // Add category filter if specified
    if (!empty($category)) {
        $query .= " AND LOWER(s.category) = LOWER(?)";
        $params[] = $category;
    }
    
    // Add price range filter if specified
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
    
    // Add availability filter if specified
    if (!empty($availability)) {
        $availability = strtolower($availability);
        if ($availability === 'available' || $availability === 'unavailable') {
            $query .= " AND LOWER(s.availability) = ?";
            $params[] = ucfirst($availability);
        }
    }
    
    // Add search filter if specified
    if (!empty($search)) {
        $query .= " AND (s.name LIKE ? OR s.description LIKE ? OR s.category LIKE ? OR s.subcategory LIKE ?)";
        $searchTerm = "%$search%";
        $params = array_merge($params, [$searchTerm, $searchTerm, $searchTerm, $searchTerm]);
    }
    
    // Order by most recent first
    $query .= " ORDER BY s.created_at DESC";
    
    // Prepare and execute the query
    $stmt = $db->prepare($query);
    if (!$stmt->execute($params)) {
        throw new Exception("Failed to execute query");
    }
    
    $services = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    if ($services === false) {
        throw new Exception("Failed to fetch services");
    }
    
    // Process the results
    foreach ($services as &$service) {
        // Parse features if they exist
        if (!empty($service['features'])) {
            $service['features'] = json_decode($service['features'], true);
        } else {
            $service['features'] = [];
        }
        
        // Format price to 2 decimal places
        if (isset($service['price'])) {
            $service['price'] = number_format((float)$service['price'], 2, '.', '');
        }
        
        // Ensure image_url has a default value
        if (empty($service['image_url'])) {
            $service['image_url'] = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=400&q=80';
        }
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
?> 