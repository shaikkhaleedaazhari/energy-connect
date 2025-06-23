<?php
// Start session only if not already started
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

function isLoggedIn() {
    return isset($_SESSION['user_id']) && !empty($_SESSION['user_id']);
}

function getUserId() {
    return $_SESSION['user_id'] ?? null;
}

function getUserType() {
    return $_SESSION['user_type'] ?? null;
}

function getUserEmail() {
    return $_SESSION['email'] ?? null;
}

function setUserSession($userId, $userType, $email) {
    $_SESSION['user_id'] = $userId;
    $_SESSION['user_type'] = $userType;
    $_SESSION['email'] = $email;
}

function destroyUserSession() {
    session_unset();
    session_destroy();
}

function requireLogin() {
    if (!isLoggedIn()) {
        header('Location: login.html');
        exit();
    }
}

function requireProvider() {
    requireLogin();
    if (getUserType() !== 'provider') {
        header('Location: index.html');
        exit();
    }
}
?>
