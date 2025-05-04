<?php
ob_start(); // Ngăn lỗi header

error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Content-Type: application/json');

require_once __DIR__ . "/../config/config-database.php";
mysqli_set_charset($conn, "utf8mb4"); // Đảm bảo hiển thị tiếng Việt đúng

if (!$conn) {
    die(json_encode(["error" => "Lỗi kết nối database: " . mysqli_connect_error()])); 
}

// Bước 1: Lấy class_id từ URL
$class_id = isset($_GET['class_id']) ? $_GET['class_id'] : '';
if (empty($class_id)) {
    die(json_encode(["error" => "class_id không hợp lệ!"]));
}

// Bước 2: Lấy danh sách học sinh từ bảng students dựa theo class_id
$sql_students = "SELECT DISTINCT s.id, s.fullname
                FROM students s
                WHERE s.class_id = ?";

$stmt_students = $conn->prepare($sql_students);
if (!$stmt_students) {
    die(json_encode(["error" => "Lỗi chuẩn bị truy vấn học sinh: " . $conn->error]));
}

$stmt_students->bind_param("s", $class_id);
$stmt_students->execute();
$result_students = $stmt_students->get_result();

$students = [];
while ($row = $result_students->fetch_assoc()) {
    $students[] = $row;
}

if (empty($students)) {
    die(json_encode(["success" => false, "message" => "Không tìm thấy học sinh nào!"]));
}

echo json_encode(["success" => true, "data" => $students], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
exit;
