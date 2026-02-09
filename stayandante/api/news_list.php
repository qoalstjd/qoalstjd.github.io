<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=utf-8");

include $_SERVER['DOCUMENT_ROOT'] . "/../db/conn.php";

$result = $conn->query("
  SELECT id, title, summary, content, created_at
  FROM news
  ORDER BY created_at DESC
");

$data = [];
while ($row = $result->fetch_assoc()) {
  $data[] = $row;
}

echo json_encode($data, JSON_UNESCAPED_UNICODE);