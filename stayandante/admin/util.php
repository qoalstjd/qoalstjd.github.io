<?php
session_start();

// DB 연결
function dbConn() {
    static $conn;
    if (!$conn) {
        include $_SERVER['DOCUMENT_ROOT'] . "/../db/conn.php"; 
        $conn = new mysqli($DB_HOST, $DB_USER, $DB_PASS, $DB_NAME);
        if ($conn->connect_error) {
            die("DB 연결 실패: " . $conn->connect_error);
        }
        $conn->set_charset("utf8mb4");
    }
    return $conn;
}

// 로그인 체크
function checkAuth() {
    if(empty($_SESSION['admin'])) {
        http_response_code(403);
        echo json_encode(['error'=>'Unauthorized']);
        exit;
    }
}