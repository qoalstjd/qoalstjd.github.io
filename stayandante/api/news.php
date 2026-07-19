<?php
require_once __DIR__ . '/../admin/util.php'; // DB 연결, 세션/로그인 체크
header("Content-Type: application/json; charset=utf-8");

$conn = dbConn();
$action = $_GET['action'] ?? $_POST['action'] ?? 'list';
if (!in_array($action, ['list', 'increase_view'])) {
    checkAuth();
}
switch($action) {
    // 뉴스 목록	GET	news.php?action=list
    case 'list':
        $res = $conn->query("SELECT id, tag, title, content, created_at, view_cnt FROM news ORDER BY created_at DESC");
        $data = $res->fetch_all(MYSQLI_ASSOC);
        echo json_encode($data, JSON_UNESCAPED_UNICODE);
        break;
    // 뉴스 추가	POST	news.php?action=add + title, content, tag
    case 'add':
        $title = $_POST['title'] ?? '';
        $content = $_POST['content'] ?? '';
        $tag = $_POST['tag'] ?? '';

        $stmt = $conn->prepare("INSERT INTO news (tag, title, content, created_at, view_cnt) VALUES (?, ?, ?, NOW(), 0)");
        $stmt->bind_param("sss", $tag, $title, $content);
        $stmt->execute();

        echo json_encode(['success'=>true, 'id'=>$conn->insert_id]);
        break;
    // 뉴스 수정	POST	news.php?action=edit + id, title, content, tag
    case 'edit':
        $id = $_POST['id'] ?? 0;
        $title = $_POST['title'] ?? '';
        $content = $_POST['content'] ?? '';
        $tag = $_POST['tag'] ?? '';

        $stmt = $conn->prepare("UPDATE news SET tag=?, title=?, content=? WHERE id=?");
        $stmt->bind_param("sssi", $tag, $title, $content, $id);
        $stmt->execute();

        echo json_encode(['success'=>true]);
        break;
    // 뉴스 삭제	GET/POST	news.php?action=delete + id
    case 'delete':
        $id = $_GET['id'] ?? $_POST['id'] ?? 0;

        $stmt = $conn->prepare("DELETE FROM news WHERE id=?");
        $stmt->bind_param("i", $id);
        $stmt->execute();

        echo json_encode(['success'=>true]);
        break;
    // 조회수 증가	POST	news.php?action=increase_view + id
    case 'increase_view':
        $id = $_POST['id'] ?? 0;

        $stmt = $conn->prepare("UPDATE news SET view_cnt = view_cnt + 1 WHERE id=?");
        $stmt->bind_param("i", $id);
        $stmt->execute();

        echo json_encode(['success'=>true]);
        break;

    default:
        http_response_code(400);
        echo json_encode(['error'=>'invalid action']);
}