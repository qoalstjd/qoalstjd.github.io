<?php
header("Access-Control-Allow-Origin: *");

include $_SERVER['DOCUMENT_ROOT'] . "/../db/conn.php";

$id = (int)$_GET['id'];

$conn->query("
  UPDATE news SET view_cnt = view_cnt + 1 WHERE id = $id
");

$result = $conn->query("
  SELECT * FROM news WHERE id
");

echo json_encode($result->fetch_assoc(), JSON_UNESCAPED_UNICODE);