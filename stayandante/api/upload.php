<?php
require_once __DIR__ . '/../admin/util.php'; // DB 연결, 세션/로그인 체크
header("Content-Type: application/json; charset=utf-8");

$conn = dbConn();
$action = $_GET['action'] ?? $_POST['action'] ?? 'list';
if (!in_array($action, ['list'])) {
    checkAuth();
}

switch($action) {

    // 이미지 목록
    case 'list':
        $res = $conn->query("SELECT id, filename, url, created_at FROM upload ORDER BY created_at DESC");
        echo json_encode($res->fetch_all(MYSQLI_ASSOC), JSON_UNESCAPED_UNICODE);
        break;

    // 이미지 업로드
    case 'upload':
        if (!isset($_FILES['file'])) {
            http_response_code(400);
            echo json_encode(['error'=>'No file uploaded']);
            exit;
        }

        $dir = $_SERVER['DOCUMENT_ROOT'] . "/upload/";
        if (!is_dir($dir)) mkdir($dir, 0777, true);

        $tmp = $_FILES['file']['tmp_name'];
        $ext = strtolower(pathinfo($_FILES['file']['name'], PATHINFO_EXTENSION));

        // 새 파일명 YYMMDD_## 형식
        $date = date('ymd');
        $i = 1;
        do {
            $name = "{$date}_" . str_pad($i, 2, "0", STR_PAD_LEFT) . "." . $ext;
            $path = $dir . $name;
            $i++;
        } while(file_exists($path));

        // 이미지 리사이즈
        list($width, $height) = getimagesize($tmp);
        $maxW = 800;
        $maxH = 450;
        $ratio = min($maxW/$width, $maxH/$height, 1); // 1보다 크면 그대로
        $newW = (int)($width * $ratio);
        $newH = (int)($height * $ratio);

        $dst = imagecreatetruecolor($newW, $newH);

        switch($ext) {
            case 'jpg': case 'jpeg':
                $src = imagecreatefromjpeg($tmp);
                imagecopyresampled($dst, $src, 0,0,0,0, $newW, $newH, $width, $height);
                imagejpeg($dst, $path, 75); // 압축율 75%
                break;
            case 'png':
                $src = imagecreatefrompng($tmp);
                imagealphablending($dst, false);
                imagesavealpha($dst, true);
                imagecopyresampled($dst, $src, 0,0,0,0, $newW, $newH, $width, $height);
                imagepng($dst, $path, 6); // 압축 레벨 6 (0~9)
                break;
            case 'gif':
                $src = imagecreatefromgif($tmp);
                imagecopyresampled($dst, $src, 0,0,0,0, $newW, $newH, $width, $height);
                imagegif($dst, $path);
                break;
            default:
                move_uploaded_file($tmp, $path);
        }

        imagedestroy($dst);
        if(isset($src)) imagedestroy($src);

        $url = "/upload/" . $name;

        $stmt = $conn->prepare("INSERT INTO upload (filename, url) VALUES (?, ?)");
        $stmt->bind_param("ss", $_FILES['file']['name'], $url);
        $stmt->execute();

        echo json_encode(['success'=>true, 'id'=>$conn->insert_id, 'url'=>$url]);
        break;

    // 이미지 삭제
    case 'delete':
        $id = $_GET['id'] ?? $_POST['id'] ?? 0;

        $res = $conn->query("SELECT url FROM upload WHERE id=$id");
        $row = $res->fetch_assoc();
        if($row){
            $file = $_SERVER['DOCUMENT_ROOT'] . $row['url'];
            if(file_exists($file)) unlink($file);
            $stmt = $conn->prepare("DELETE FROM upload WHERE id=?");
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