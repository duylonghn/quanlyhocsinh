<?php
session_start();
header('Content-Type: application/json');

if (isset($_SESSION['user_id'])) {
    echo json_encode(["user_id" => $_SESSION['user_id']]);
} else {
    http_response_code(401); // Unauthorized
    echo json_encode(["error" => "Không tìm thấy user_id trong session"]);
}
?>

