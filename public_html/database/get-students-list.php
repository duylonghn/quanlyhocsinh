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

$teacher_id = isset($_GET['teacher_id']) ? intval($_GET['teacher_id']) : 0;
if ($teacher_id <= 0) {
    die(json_encode(["error" => "ID giáo viên không hợp lệ!"]));
}

$sql = "SELECT DISTINCT s.id, s.fullname, s.sex, s.class_id, s.course, s.phone, s.email, s.address,
               p.parent_name, p.relationship, p.phone_number 
        FROM students s
        JOIN teacher_class tc ON s.class_id = tc.class_id
        LEFT JOIN parents_info p ON s.id = p.id
        WHERE tc.teacher_id = ?";

$stmt = $conn->prepare($sql);
if (!$stmt) {
    die(json_encode(["error" => "Lỗi chuẩn bị truy vấn: " . $conn->error]));
}

$stmt->bind_param("i", $teacher_id);
$stmt->execute();
$result = $stmt->get_result();

$students = [];
while ($row = $result->fetch_assoc()) {
    $students[] = $row;
}

if (empty($students)) {
    die(json_encode(["success" => false, "message" => "Không tìm thấy học sinh nào!"]));
}

// In JSON + kiểm tra lỗi
echo json_encode(["success" => true, "data" => $students], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
exit;
