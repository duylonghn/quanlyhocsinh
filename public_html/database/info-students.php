<?php
session_start();
include(__DIR__ . '/../config/config-database.php'); // Kết nối database

// Đảm bảo kết nối MySQL sử dụng UTF-8
$conn->set_charset("utf8mb4");

// Trả về JSON
header('Content-Type: application/json; charset=utf-8');

// Lấy `id` từ URL
$student_id = isset($_GET['id']) ? intval($_GET['id']) : 0;
if ($student_id <= 0) {
    echo json_encode(["error" => "ID không hợp lệ"], JSON_UNESCAPED_UNICODE);
    exit;
}

// Truy vấn thông tin học sinh
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
    echo json_encode(["error" => "Lỗi truy vấn: " . $conn->error], JSON_UNESCAPED_UNICODE);
    exit;
}

$stmt->bind_param("i", $student_id);
$stmt->execute();
$result = $stmt->get_result();

// Kiểm tra kết quả
if ($result->num_rows === 1) {
    $student = $result->fetch_assoc();
    echo json_encode($student, JSON_UNESCAPED_UNICODE);
} else {
    echo json_encode(["error" => "Không tìm thấy học sinh"], JSON_UNESCAPED_UNICODE);
}

$stmt->close();
$conn->close();
?>
