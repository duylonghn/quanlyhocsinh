<?php
session_start();
include(__DIR__ . '/../config/config-database.php'); // Kết nối database
// Đảm bảo kết nối MySQL sử dụng UTF-8
$conn->set_charset("utf8mb4");

header('Content-Type: application/json; charset=utf-8');

// Kiểm tra nếu user_id và semesters_id không có trong URL
if (!isset($_GET['id']) || empty($_GET['id']) || !isset($_GET['semesters_id']) || empty($_GET['semesters_id'])) {
    echo json_encode(["error" => "Thiếu thông tin user_id hoặc semesters_id"], JSON_UNESCAPED_UNICODE);
    exit;
}

$user_id = trim($_GET['id']); // Lấy user_id từ URL và loại bỏ khoảng trắng
$semesters_id = $_GET['semesters_id']; // Lấy semesters_id từ URL

// Lấy class_id của học sinh từ bảng students
$sql = "SELECT class_id FROM students WHERE id = ?";
$stmt = $conn->prepare($sql);
if (!$stmt) {
    echo json_encode(["error" => "Lỗi truy vấn database"], JSON_UNESCAPED_UNICODE);
    exit;
}
$stmt->bind_param("s", $user_id); // Nếu id là chuỗi, dùng "s"
$stmt->execute();
$result = $stmt->get_result();
$class = $result->fetch_assoc();

if (!$class) {
    echo json_encode(["error" => "Không tìm thấy lớp học"], JSON_UNESCAPED_UNICODE);
    exit;
}

$class_id = $class['class_id'];

// Lấy thời khóa biểu theo class_id và semesters_id
$sql = "SELECT s.subject, s.day_of_week, s.period, t.fullname AS teacher_name
        FROM schedules s
        LEFT JOIN teachers t ON s.teacher_id = t.id
        WHERE s.class_id = ? AND s.semesters_id = ?";

$stmt = $conn->prepare($sql);
if (!$stmt) {
    echo json_encode(["error" => "Lỗi truy vấn thời khóa biểu"], JSON_UNESCAPED_UNICODE);
    exit;
}

$stmt->bind_param("ss", $class_id, $semesters_id);
$stmt->execute();
$result = $stmt->get_result();

$schedule = [];
while ($row = $result->fetch_assoc()) {
    $schedule[] = $row;
}

// Trả về JSON gồm class_id và thời khóa biểu
$response = [
    "class_id" => $class_id,
    "schedule" => $schedule
];

echo json_encode($response, JSON_UNESCAPED_UNICODE);
?>
