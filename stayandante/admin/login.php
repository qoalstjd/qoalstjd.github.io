<?php
require_once __DIR__ . '/util.php';
header("Content-Type: application/json; charset=utf-8");

$input = json_decode(file_get_contents("php://input"), true);
$id = $input['id'] ?? '';
$pw = $input['pw'] ?? '';

if (adminLogin($id, $pw)) {
    $_SESSION['admin'] = $id;
    echo json_encode(['success' => true]);
} else {
    http_response_code(401);
    echo json_encode(['error' => 'Invalid credentials']);
}