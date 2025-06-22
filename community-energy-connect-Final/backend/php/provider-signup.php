<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

try {
    $database = new Database();
    $db = $database->getConnection();

    // Sanitize inputs
    $company_name = trim($_POST['company_name'] ?? '');
    $contact_name = trim($_POST['contact_name'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $phone_number = trim($_POST['phone_number'] ?? '');
    $password = $_POST['password'] ?? '';
    $confirm_password = $_POST['confirm_password'] ?? '';

    // Validate required fields
    if (empty($company_name) || empty($contact_name) || empty($email) || empty($phone_number) || empty($password)) {
        echo json_encode(['success' => false, 'message' => 'All fields are required']);
        exit();
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['success' => false, 'message' => 'Invalid email format']);
        exit();
    }

    if ($password !== $confirm_password) {
        echo json_encode(['success' => false, 'message' => 'Passwords do not match']);
        exit();
    }

    if (strlen($password) < 6) {
        echo json_encode(['success' => false, 'message' => 'Password must be at least 6 characters long']);
        exit();
    }

    // Check for existing email in users or providers
    $stmt = $db->prepare("SELECT id FROM users WHERE email = ? UNION SELECT id FROM service_providers WHERE email = ?");
    $stmt->execute([$email, $email]);
    if ($stmt->fetch()) {
        echo json_encode(['success' => false, 'message' => 'Email already registered']);
        exit();
    }

    // Begin transaction
    $db->beginTransaction();

    try {
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);

        // Extract first and last names
        $name_parts = preg_split('/\s+/', $contact_name, 2);
        $first_name = $name_parts[0];
        $last_name = $name_parts[1] ?? '';

        // Insert into users table
        $stmt = $db->prepare("INSERT INTO users (email, password, first_name, last_name, user_type) VALUES (?, ?, ?, ?, 'provider')");
        $stmt->execute([$email, $hashed_password, $first_name, $last_name]);
        $user_id = $db->lastInsertId();

        // Insert into service_providers table
        $stmt = $db->prepare("INSERT INTO service_providers (user_id, company_name, contact_name, email, phone_number, services, location, description)
                              VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $user_id,
            $company_name,
            $contact_name,
            $email,
            $phone_number,
            'General services',
            'Not specified',
            'Professional service provider'
        ]);

        $db->commit();
        echo json_encode(['success' => true, 'message' => 'Provider account created successfully']);

    } catch (Exception $e) {
        $db->rollBack();
        throw $e;
    }

} catch (Exception $e) {
    error_log('Error in provider-signup.php: ' . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
}
