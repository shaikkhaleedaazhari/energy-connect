<?php
header('Content-Type: application/json');
require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

try {
    $database = new Database();
    $db = $database->getConnection();
    
    $company_name = trim($_POST['company_name'] ?? '');
    $contact_name = trim($_POST['contact_name'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $phone_number = trim($_POST['phone_number'] ?? '');
    $password = $_POST['password'] ?? '';
    $confirm_password = $_POST['confirm_password'] ?? '';
    
    // Validation
    if (empty($company_name) || empty($contact_name) || empty($email) || empty($phone_number) || empty($password)) {
        echo json_encode(['success' => false, 'message' => 'All fields are required']);
        exit();
    }
    
    if ($password !== $confirm_password) {
        echo json_encode(['success' => false, 'message' => 'Passwords do not match']);
        exit();
    }
    
    if (strlen($password) < 6) {
        echo json_encode(['success' => false, 'message' => 'Password must be at least 6 characters']);
        exit();
    }
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['success' => false, 'message' => 'Invalid email format']);
        exit();
    }
    
    // Check if email already exists in either users or service_providers table
    $stmt = $db->prepare("SELECT id FROM users WHERE email = ? UNION SELECT id FROM service_providers WHERE email = ?");
    $stmt->execute([$email, $email]);
    if ($stmt->fetch()) {
        echo json_encode(['success' => false, 'message' => 'Email already registered']);
        exit();
    }
    
    // Start transaction
    $db->beginTransaction();
    
    try {
        // Hash password
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);
        
        // Split contact name into first and last name
        $name_parts = explode(' ', $contact_name);
        $first_name = $name_parts[0] ?? $contact_name;
        $last_name = $name_parts[1] ?? '';
        
        // Insert user
        $stmt = $db->prepare("INSERT INTO users (email, password, first_name, last_name, user_type) VALUES (?, ?, ?, ?, 'provider')");
        $stmt->execute([
            $email,
            $hashed_password,
            $first_name,
            $last_name
        ]);
        
        $user_id = $db->lastInsertId();
        
        // Insert service provider
        $stmt = $db->prepare("INSERT INTO service_providers (user_id, company_name, contact_name, email, phone_number, services, location, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $user_id,
            $company_name,
            $contact_name,
            $email,
            $phone_number,
            'General services', // Default value
            'Not specified', // Default value
            'Professional service provider' // Default value
        ]);
        
        $db->commit();
        echo json_encode(['success' => true, 'message' => 'Provider account created successfully']);
        
    } catch (Exception $e) {
        $db->rollback();
        throw $e;
    }
    
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
}
?>
