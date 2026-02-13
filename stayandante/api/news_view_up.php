<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=utf-8");

include $_SERVER['DOCUMENT_ROOT'] . "/../db/conn.php";

$id = (int)($_GET['id'] ?? 0);

if ($id <= 0) {
  echo json_encode(["ok" => false]);
  exit;
}

$conn->query("
  UPDATE news 
  SET view_cnt = view_cnt + 1 
  WHERE id = $id
");

echo json_encode(["ok" => true]);