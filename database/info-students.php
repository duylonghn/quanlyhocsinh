<?php
session_start();
include(__DIR__ . '/../config/config-database.php'); // Kết nối database

// Thiết lập header để trả về JSON
header('Content-Type: application/json; charset=utf-8');

// Kiểm tra nếu chưa đăng nhập
if (!isset($_SESSION['user_id'])) {
    echo json_encode(["error" => "Chưa đăng nhập"]);
    exit;
}

$user_id = $_SESSION['user_id'];

// Lấy thông tin học sinh + thông tin phụ huynh trong cùng một truy vấn
$sql = "SELECT 
            s.fullname, s.birthday, s.id, s.sex, 
            c.class_name, c.year AS course, 
            s.phone, s.email, s.cccd, s.nation, s.religion, s.birthplace, s.address, 
            t.fullname AS teacher_name, t.phone AS teacher_phone, t.email AS teacher_email,
            p.parent_name, p.relationship, p.phone_number AS parent_phone
        FROM students s
        JOIN classes c ON s.class_id = c.id
        JOIN teachers t ON c.teacher_id = t.id
        LEFT JOIN parents_info p ON s.id = p.id
        WHERE s.id = ?";

$stmt = $conn->prepare($sql);
if (!$stmt) {
    echo json_encode(["error" => "Lỗi truy vấn: " . $conn->error]);
    exit;
}

$stmt->bind_param("s", $user_id);
$stmt->execute();
$result = $stmt->get_result();

// Kiểm tra kết quả
if ($result->num_rows === 1) {
    $student = $result->fetch_assoc();
    echo json_encode($student, JSON_UNESCAPED_UNICODE);
} else {
    echo json_encode(["error" => "Không tìm thấy học sinh"]);
}

$stmt->close();
$conn->close();
?>
