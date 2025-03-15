<?php
session_start();
include(__DIR__ . '/../config/config-database.php'); // Kết nối database

header('Content-Type: application/json; charset=utf-8');

$teacher_id = isset($_GET['teacher_id']) ? intval($_GET['teacher_id']) : 0;
$semester_id = isset($_GET['semester_id']) ? $_GET['semester_id'] : ''; // Lấy semester_id từ URL

// Kiểm tra ID hợp lệ
if ($teacher_id <= 0 || empty($semester_id)) {
    echo json_encode(["error" => "ID giáo viên hoặc ID kỳ học không hợp lệ"], JSON_UNESCAPED_UNICODE);
    exit;
}

// Câu lệnh SQL - Lọc theo teacher_id và semester_id
$sql = "SELECT 
            schedules.subject, 
            IFNULL(classes.class_name, 'Không có lớp') AS class_name, 
            schedules.day_of_week, 
            schedules.period 
        FROM schedules 
        LEFT JOIN classes ON schedules.class_id = classes.id
        WHERE schedules.teacher_id = ? AND schedules.semester_id = ?"; // Lọc theo semester_id

$stmt = $conn->prepare($sql);
if (!$stmt) {
    echo json_encode(["error" => "Lỗi truy vấn: " . $conn->error], JSON_UNESCAPED_UNICODE);
    exit;
}

$stmt->bind_param("is", $teacher_id, $semester_id); // Đưa semester_id vào trong câu truy vấn
$stmt->execute();
$result = $stmt->get_result();

$scheduleData = [];
$dayMap = ["Thứ 2" => 1, "Thứ 3" => 2, "Thứ 4" => 3, "Thứ 5" => 4, "Thứ 6" => 5, "Thứ 7" => 6, "Chủ nhật" => 7];

while ($row = $result->fetch_assoc()) {
    $dayIndex = $dayMap[$row['day_of_week']] ?? 0;
    $period = intval($row['period']);

    if ($period > 0 && $dayIndex > 0) {
        $scheduleData["period{$period}-day{$dayIndex}"] = [
            "subject" => $row["subject"],
            "class" => $row["class_name"] // Hiển thị tên lớp thay vì ID
        ];
    }
}

$stmt->close();
$conn->close();

echo json_encode($scheduleData, JSON_UNESCAPED_UNICODE);
?>
