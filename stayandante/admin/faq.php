<?php
require_once __DIR__ . '/util.php'; // DB 연결, 세션/로그인 체크
header("Content-Type: application/json; charset=utf-8");

$conn = dbConn();
checkAuth(); // 로그인 확인

$action = $_GET['action'] ?? $_POST['action'] ?? 'list';

switch($action) {
    // FAQ 목록	GET	faq.php?action=list
    case 'list':
        $res = $conn->query("SELECT id, type, question, answer, created_at FROM faq ORDER BY created_at DESC");
        $data = $res->fetch_all(MYSQLI_ASSOC);
        echo json_encode($data, JSON_UNESCAPED_UNICODE);
        break;
    // FAQ 추가	POST	faq.php?action=add + type, question, answer
    case 'add':
        $type = $_POST['type'] ?? '';
        $question = $_POST['question'] ?? '';
        $answer = $_POST['answer'] ?? '';

        $stmt = $conn->prepare("INSERT INTO faq (type, question, answer, created_at) VALUES (?, ?, ?, NOW())");
        $stmt->bind_param("sss", $type, $question, $answer);
        $stmt->execute();

        echo json_encode(['success'=>true, 'id'=>$conn->insert_id]);
        break;
    // FAQ 수정	POST	faq.php?action=edit + id, type, question, answer
    case 'edit':
        $id = $_POST['id'] ?? 0;
        $type = $_POST['type'] ?? '';
        $question = $_POST['question'] ?? '';
        $answer = $_POST['answer'] ?? '';

        $stmt = $conn->prepare("UPDATE faq SET type=?, question=?, answer=? WHERE id=?");
        $stmt->bind_param("sssi", $type, $question, $answer, $id);
        $stmt->execute();

        echo json_encode(['success'=>true]);
        break;
    // FAQ 삭제	GET/POST	faq.php?action=delete + id
    case 'delete':
        $id = $_GET['id'] ?? $_POST['id'] ?? 0;

        $stmt = $conn->prepare("DELETE FROM faq WHERE id=?");
        $stmt->bind_param("i", $id);
        $stmt->execute();

        echo json_encode(['success'=>true]);
        break;

    default:
        http_response_code(400);
        echo json_encode(['error'=>'invalid action']);
}