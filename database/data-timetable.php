<?php
session_start();
include(__DIR__ . '/../config/config-database.php'); // Kết nối database

header('Content-Type: application/json; charset=utf-8');

// Kiểm tra nếu chưa đăng nhập
if (!isset($_SESSION['user_id'])) {
    echo json_encode(["error" => "Chưa đăng nhập"]);
    exit;
}

$user_id = $_SESSION['user_id'];

// Lấy class_id của học sinh từ bảng students
$sql = "SELECT class_id FROM students WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();
$class = $result->fetch_assoc();

if (!$class) {
    echo json_encode(["error" => "Không tìm thấy lớp học"]);
    exit;
}

$class_id = $class['class_id'];

// Lấy thời khóa biểu theo class_id
$sql = "SELECT s.subject, s.day_of_week, s.start_time, s.end_time, t.fullname AS teacher_name
        FROM schedules s
        JOIN teachers t ON s.teacher_id = t.id
        WHERE s.class_id = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $class_id);
$stmt->execute();
$result = $stmt->get_result();

$schedule = [];
while ($row = $result->fetch_assoc()) {
    $schedule[] = $row;
}

echo json_encode($schedule, JSON_UNESCAPED_UNICODE);
?>
