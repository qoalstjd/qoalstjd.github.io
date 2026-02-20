<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require_once $_SERVER['DOCUMENT_ROOT'] . "/../db/conn.php";

function dbConn() {
    static $conn;
    if (!$conn) {
        global $DB_HOST, $DB_USER, $DB_PASS, $DB_NAME;
        $conn = new mysqli($DB_HOST, $DB_USER, $DB_PASS, $DB_NAME);
        if ($conn->connect_error) die("DB 연결 실패: " . $conn->connect_error);
        $conn->set_charset("utf8mb4");
    }
    return $conn;
}

function checkAuth() {
    if (empty($_SESSION['admin'])) {
        http_response_code(403);
        echo json_encode(['error'=>'Unauthorized']);
        exit;
    }
}

function adminLogin($id, $pw) {
    global $ADMIN_ID, $ADMIN_PASS; // conn.php에 있는 변수
    if ($id === $ADMIN_ID && $pw === $ADMIN_PASS) {
        return true;
    }
    return false;
}