<?php
session_start();
header('Content-Type: application/json');
require_once '../config/database.php';
require_once '../config/session.php';

// Check if user is logged in
if (!isLoggedIn()) {
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit();
}

try {
    $database = new Database();
    $db = $database->getConnection();
    
    $userId = getUserId();
    $userType = getUserType();
    
    if ($userType === 'provider') {
        // Get provider profile data
    $stmt = $db->prepare("
            SELECT u.email, u.first_name, u.last_name, sp.company_name, sp.contact_name, sp.phone_number, 
               sp.location, sp.description, sp.services
        FROM users u 
        LEFT JOIN service_providers sp ON u.id = sp.user_id 
        WHERE u.id = ?
    ");
    $stmt->execute([$userId]);
    $profile = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$profile) {
            // If no provider profile exists, create one
            $stmt = $db->prepare("
                INSERT INTO service_providers (user_id, company_name, contact_name, phone_number, location, description, services)
                VALUES (?, '', '', '', '', '', '')
            ");
            $stmt->execute([$userId]);
            
            // Fetch the newly created profile
            $stmt = $db->prepare("
                SELECT u.email, u.first_name, u.last_name, sp.company_name, sp.contact_name, sp.phone_number, 
                       sp.location, sp.description, sp.services
                FROM users u 
                LEFT JOIN service_providers sp ON u.id = sp.user_id 
                WHERE u.id = ?
            ");
            $stmt->execute([$userId]);
            $profile = $stmt->fetch(PDO::FETCH_ASSOC);
        }
    } else {
        // Get regular user profile data
        $stmt = $db->prepare("
            SELECT email, first_name, last_name, phone_number
            FROM users 
            WHERE id = ?
        ");
        $stmt->execute([$userId]);
        $profile = $stmt->fetch(PDO::FETCH_ASSOC);
    }
    
    if (!$profile) {
        echo json_encode(['success' => false, 'message' => 'Profile not found']);
        exit();
    }
    
    echo json_encode(['success' => true, 'profile' => $profile]);
    
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
}
?>
