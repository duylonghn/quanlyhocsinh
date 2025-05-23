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

// Bước 2: Lấy danh sách học sinh từ bảng students dựa trên class_id
$sql_students = "SELECT DISTINCT s.id, s.fullname, s.sex, s.class_id, s.course, s.phone, s.email, s.address,
                        p.parent_name, p.relationship, p.phone_number 
                FROM students s
                LEFT JOIN parents_info p ON s.id = p.id
                WHERE s.class_id = ?"; // Lọc học sinh theo class_id

$stmt_students = $conn->prepare($sql_students);
if (!$stmt_students) {
    die(json_encode(["error" => "Lỗi chuẩn bị truy vấn: " . $conn->error]));
}

$stmt_students->bind_param("s", $class_id); // Bind class_id kiểu string vào câu truy vấn
$stmt_students->execute();
$result_students = $stmt_students->get_result();

$students = [];
while ($row = $result_students->fetch_assoc()) {
    $students[] = $row;
}

// Kiểm tra nếu không có học sinh nào
if (empty($students)) {
    die(json_encode(["success" => false, "message" => "Không tìm thấy học sinh nào!"]));
}

// In ra kết quả dạng JSON
echo json_encode(["success" => true, "data" => $students], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
exit;
