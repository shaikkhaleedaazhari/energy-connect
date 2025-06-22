<?php
session_start();
header('Content-Type: application/json');

require_once '../config/database.php';
require_once '../config/session.php';

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
        // Fetch provider profile
        $stmt = $db->prepare("
            SELECT u.email, u.first_name, u.last_name,
                   sp.company_name, sp.contact_name, sp.phone_number,
                   sp.location, sp.description, sp.services
            FROM users u
            LEFT JOIN service_providers sp ON u.id = sp.user_id
            WHERE u.id = ?
        ");
        $stmt->execute([$userId]);
        $profile = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$profile || is_null($profile['company_name'])) {
            // Auto-create blank profile for provider if not found
            $stmt = $db->prepare("
                INSERT INTO service_providers (user_id, company_name, contact_name, phone_number, location, description, services)
                VALUES (?, '', '', '', '', '', '')
            ");
            $stmt->execute([$userId]);

            // Fetch again after creation
            $stmt = $db->prepare("
                SELECT u.email, u.first_name, u.last_name,
                       sp.company_name, sp.contact_name, sp.phone_number,
                       sp.location, sp.description, sp.services
                FROM users u
                LEFT JOIN service_providers sp ON u.id = sp.user_id
                WHERE u.id = ?
            ");
            $stmt->execute([$userId]);
            $profile = $stmt->fetch(PDO::FETCH_ASSOC);
        }
    } else {
        // Fetch general user profile
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

    // Ensure null values are replaced with empty strings
    $profile = array_map(function($value) {
        return $value ?? '';
    }, $profile);

    echo json_encode(['success' => true, 'profile' => $profile]);

} catch (Exception $e) {
    error_log("Error in get-profile.php: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
}
