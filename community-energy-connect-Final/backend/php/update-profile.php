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
    
    // For regular users, keep required fields. For providers, allow all fields to be optional.
    if ($userType === 'provider') {
        // Get provider fields
        $companyName = trim($_POST['company_name'] ?? '');
        $contactName = trim($_POST['contact_name'] ?? '');
        $email = trim($_POST['email'] ?? '');
        $phone = trim($_POST['phone_number'] ?? '');
        $location = trim($_POST['location'] ?? '');
        $description = trim($_POST['description'] ?? '');
        $services = trim($_POST['services'] ?? '');

        // Only update fields that are set (not empty)
        $fields = [];
        $params = [];
        if ($companyName !== '') { $fields[] = 'company_name = ?'; $params[] = $companyName; }
        if ($contactName !== '') { $fields[] = 'contact_name = ?'; $params[] = $contactName; }
        if ($email !== '') {
            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                echo json_encode(['success' => false, 'message' => 'Invalid email format']);
                exit();
            }
            // Check if email is already taken by another user
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
        $result = $stmt->execute($params);

        // Also update email/phone in users table if provided
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

        if ($result) {
            // Update session user_name for provider
            if (!empty($contactName)) {
                $_SESSION['user_name'] = $contactName;
                // Also update users table: set first_name = contact_name, last_name = ''
                $stmt = $db->prepare("UPDATE users SET first_name = ?, last_name = '' WHERE id = ?");
                $stmt->execute([$contactName, $userId]);
            } else if (!empty($companyName)) {
                $_SESSION['user_name'] = $companyName;
            }
            echo json_encode(['success' => true, 'message' => 'Profile updated successfully']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to update profile']);
        }
    } else {
        // Regular user logic (keep required fields)
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
            // Update session user_name for user
            $_SESSION['user_name'] = $firstName . ' ' . $lastName;
            echo json_encode(['success' => true, 'message' => 'Profile updated successfully']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to update profile']);
        }
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
}
?>