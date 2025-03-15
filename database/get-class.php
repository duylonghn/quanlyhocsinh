<?php
session_start();
include(__DIR__ . '/../config/config-database.php'); // Kết nối database

header('Content-Type: application/json; charset=utf-8');

// Lấy ID giáo viên từ URL
$teacher_id = isset($_GET['teacher_id']) ? intval($_GET['teacher_id']) : 0;

// Kiểm tra ID hợp lệ
if ($teacher_id <= 0) {
    echo json_encode(["error" => "ID giáo viên không hợp lệ"], JSON_UNESCAPED_UNICODE);
    exit;
}

// Lấy thông tin lớp chủ nhiệm và số học sinh
$homeroom_class = null;
$sql = "SELECT c.id, c.class_name, COUNT(s.id) AS student_count
        FROM classes c
        LEFT JOIN students s ON s.class_id = c.id
        WHERE c.teacher_id = ?  -- Giáo viên chủ nhiệm được xác định qua teacher_id
        GROUP BY c.id";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $teacher_id);
$stmt->execute();
$result = $stmt->get_result();
if ($result->num_rows > 0) {
    $homeroom_class = $result->fetch_assoc();
}

// Lấy danh sách các lớp dạy môn, môn phụ trách và số học sinh
$sql = "SELECT DISTINCT c.id AS class_id, c.class_name, COUNT(s.id) AS student_count, sch.subject AS subject_name
        FROM schedules sch
        JOIN classes c ON sch.class_id = c.id
        LEFT JOIN students s ON s.class_id = c.id  -- Đếm số học sinh trong mỗi lớp
        WHERE sch.teacher_id = ?  -- Giáo viên dạy môn
        GROUP BY c.id, sch.subject";  // Nhóm theo lớp và môn học
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $teacher_id);
$stmt->execute();
$result = $stmt->get_result();

$subject_classes = [];
while ($row = $result->fetch_assoc()) {
    $subject_classes[] = $row;
}

$stmt->close();
$conn->close();

// Trả về dữ liệu bao gồm lớp chủ nhiệm và lớp dạy môn
echo json_encode([
    'homeroom_class' => $homeroom_class,
    'subject_classes' => $subject_classes
], JSON_UNESCAPED_UNICODE);
?>
