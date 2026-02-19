<?php
require_once __DIR__ . '/util.php'; // DB 연결, 세션/로그인 체크
header("Content-Type: application/json; charset=utf-8");
checkAuth();
$conn = dbConn();

$action = $_GET['action'] ?? $_POST['action'] ?? 'list';

switch($action) {

    // 이미지 목록
    case 'list':
        $res = $conn->query("SELECT id, filename, url, created_at FROM uploads ORDER BY created_at DESC");
        echo json_encode($res->fetch_all(MYSQLI_ASSOC), JSON_UNESCAPED_UNICODE);
        break;

    // 이미지 업로드
    case 'upload':
        if (!isset($_FILES['file'])) {
            http_response_code(400);
            echo json_encode(['error'=>'No file uploaded']);
            exit;
        }

        $dir = $_SERVER['DOCUMENT_ROOT'] . "/uploads/";
        if(!is_dir($dir)) mkdir($dir, 0777, true);

        $name = time() . "_" . basename($_FILES['file']['name']);
        $path = $dir . $name;

        move_uploaded_file($_FILES['file']['tmp_name'], $path);
        $url = "/uploads/" . $name;

        $stmt = $conn->prepare("INSERT INTO uploads (filename, url) VALUES (?, ?)");
        $stmt->bind_param("ss", $_FILES['file']['name'], $url);
        $stmt->execute();

        echo json_encode(['success'=>true, 'id'=>$conn->insert_id, 'url'=>$url]);
        break;

    // 이미지 삭제
    case 'delete':
        $id = $_GET['id'] ?? $_POST['id'] ?? 0;

        $res = $conn->query("SELECT url FROM uploads WHERE id=$id");
        $row = $res->fetch_assoc();
        if($row){
            $file = $_SERVER['DOCUMENT_ROOT'] . $row['url'];
            if(file_exists($file)) unlink($file);
            $stmt = $conn->prepare("DELETE FROM uploads WHERE id=?");
            $stmt->bind_param("i", $id);
            $stmt->execute();
            echo json_encode(['success'=>true]);
        } else {
            http_response_code(404);
            echo json_encode(['error'=>'File not found']);
        }
        break;

    default:
        http_response_code(400);
        echo json_encode(['error'=>'invalid action']);
}