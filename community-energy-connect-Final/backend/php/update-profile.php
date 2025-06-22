<?php
// Start session safely
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Set headers for CORS and JSON response
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Allow only POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method Not Allowed']);
    exit();
}

require_once '../config/database.php';
require_once '../config/session.php';

// Check if user is logged in
if (!isLoggedIn()) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit();
}

try {
    $database = new Database();
    $db = $database->getConnection();

    $userId = getUserId();
    $userType = getUserType();

    if ($userType === 'provider') {
        // Provider fields
        $companyName = trim($_POST['company_name'] ?? '');
        $contactName = trim($_POST['contact_name'] ?? '');
        $email = trim($_POST['email'] ?? '');
        $phone = trim($_POST['phone_number'] ?? '');
        $location = trim($_POST['location'] ?? '');
        $description = trim($_POST['description'] ?? '');
        $services = trim($_POST['services'] ?? '');

        $fields = [];
        $params = [];

        if ($companyName !== '') { $fields[] = 'company_name = ?'; $params[] = $companyName; }
        if ($contactName !== '') { $fields[] = 'contact_name = ?'; $params[] = $contactName; }
        if ($email !== '') {
            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                echo json_encode(['success' => false, 'message' => 'Invalid email format']);
                exit();
            }
            $stmt = $db->prepare("SELECT id FROM users WHERE email = ? AND id != ?");
            $stmt->execute([$email, $userId]);
            if ($stmt->fetch()) {
                echo json_encode(['success' => false, 'message' => 'Email is already taken']);
                exit();
            }
            $fields[] = 'email = ?'; $params[] = $email;
        }
        if ($phone !== '') { $fields[] = 'phone_number = ?'; $params[] = $phone; }
        if ($location !== '') { $fields[] = 'location = ?'; $params[] = $location; }
        if ($description !== '') { $fields[] = 'description = ?'; $params[] = $description; }
        if ($services !== '') { $fields[] = 'services = ?'; $params[] = $services; }

        if (empty($fields)) {
            echo json_encode(['success' => false, 'message' => 'No fields to update']);
            exit();
        }

        $sql = "UPDATE service_providers SET " . implode(', ', $fields) . " WHERE user_id = ?";
        $params[] = $userId;
        $stmt = $db->prepare($sql);
        $providerUpdated = $stmt->execute($params);

        // Update users table if email or phone is provided
        $userFields = [];
        $userParams = [];
        if ($email !== '') { $userFields[] = 'email = ?'; $userParams[] = $email; }
        if ($phone !== '') { $userFields[] = 'phone_number = ?'; $userParams[] = $phone; }

        if (!empty($userFields)) {
            $userSql = "UPDATE users SET " . implode(', ', $userFields) . " WHERE id = ?";
            $userParams[] = $userId;
            $userStmt = $db->prepare($userSql);
            $userStmt->execute($userParams);
        }

        // Update session display name
        if (!empty($contactName)) {
            $_SESSION['user_name'] = $contactName;
            $stmt = $db->prepare("UPDATE users SET first_name = ?, last_name = '' WHERE id = ?");
            $stmt->execute([$contactName, $userId]);
        } elseif (!empty($companyName)) {
            $_SESSION['user_name'] = $companyName;
        }

        echo json_encode([
            'success' => $providerUpdated,
            'message' => $providerUpdated ? 'Profile updated successfully' : 'Failed to update profile'
        ]);
    } else {
        // Regular user
        $firstName = trim($_POST['firstName'] ?? '');
        $lastName = trim($_POST['lastName'] ?? '');
        $email = trim($_POST['email'] ?? '');
        $phone = trim($_POST['phone'] ?? '');

        if (empty($firstName) || empty($lastName) || empty($email)) {
            echo json_encode(['success' => false, 'message' => 'Required fields cannot be empty']);
            exit();
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            echo json_encode(['success' => false, 'message' => 'Invalid email format']);
            exit();
        }

        $stmt = $db->prepare("SELECT id FROM users WHERE email = ? AND id != ?");
        $stmt->execute([$email, $userId]);
        if ($stmt->fetch()) {
            echo json_encode(['success' => false, 'message' => 'Email is already taken']);
            exit();
        }

        $stmt = $db->prepare("UPDATE users SET first_name = ?, last_name = ?, email = ?, phone_number = ? WHERE id = ?");
        $result = $stmt->execute([$firstName, $lastName, $email, $phone, $userId]);

        if ($result) {
            $_SESSION['user_name'] = "$firstName $lastName";
            echo json_encode(['success' => true, 'message' => 'Profile updated successfully']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to update profile']);
        }
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
}
