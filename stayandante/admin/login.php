<?php
require_once __DIR__ . '/util.php'; // DB 연결, 세션/로그인 체크
header("Content-Type: application/json; charset=utf-8");

// 하드코딩 계정 (서비스용은 DB로 대체 권장)
$ADMIN_ID = "admin";
$ADMIN_PW = "password123";

$input = json_decode(file_get_contents("php://input"), true);
$id = $input['id'] ?? '';
$pw = $input['pw'] ?? '';

if($id === $ADMIN_ID && $pw === $ADMIN_PW) {
    $_SESSION['admin'] = $id;
    echo json_encode(['success'=>true]);
} else {
    http_response_code(401);
    echo json_encode(['error'=>'Invalid credentials']);
}