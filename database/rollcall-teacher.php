<?php
session_start();
include(__DIR__ . '/../config/config-database.php');

header('Content-Type: application/json; charset=utf-8');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");

// Lấy tham số từ URL
$teacher_id = isset($_GET['id']) ? intval($_GET['id']) : 0;
$date = isset($_GET['date']) ? $_GET['date'] : date('Y-m-d');

if ($teacher_id == 0) {
    echo json_encode(["error" => "Thiếu teacher_id"]);
    exit();
}

// 🔹 Lấy danh sách lớp của giáo viên (thêm tổng số sinh viên và số đã điểm danh)
$query_classes = "
    SELECT 
        c.id AS class_id, 
        c.class_name, 
        COUNT(DISTINCT s.id) AS student_count,
        COUNT(DISTINCT a.student_id) AS attended_count
    FROM classes c
    LEFT JOIN students s ON c.id = s.class_id
    LEFT JOIN attendance a ON s.id = a.student_id AND a.date = ? AND a.check_in IS NOT NULL
    WHERE c.teacher_id = ?
    GROUP BY c.id, c.class_name
";

$stmt = $conn->prepare($query_classes);
$stmt->bind_param("si", $date, $teacher_id);
$stmt->execute();
$result = $stmt->get_result();

$classes = [];
while ($row = $result->fetch_assoc()) {
    $classes[$row['class_id']] = [
        "class_id" => $row['class_id'],
        "class_name" => $row['class_name'],
        "student_count" => $row['student_count'],
        "attended_count" => $row['attended_count'],
        "absent_students" => []
    ];
}

// 🔹 Lấy danh sách sinh viên chưa điểm danh
$query_absent = "
    SELECT s.id AS student_id, s.fullname, s.phone, s.email, s.class_id
    FROM students s
    WHERE s.class_id IN (
        SELECT id FROM classes WHERE teacher_id = ?
    ) 
    AND s.id NOT IN (
        SELECT student_id FROM attendance WHERE date = ?
    )
";

$stmt = $conn->prepare($query_absent);
$stmt->bind_param("is", $teacher_id, $date);
$stmt->execute();
$result = $stmt->get_result();

while ($row = $result->fetch_assoc()) {
    if (isset($classes[$row['class_id']])) {
        $classes[$row['class_id']]['absent_students'][] = [
            "student_id" => $row['student_id'],
            "fullname" => $row['fullname'],
            "phone" => $row['phone'],
            "email" => $row['email'],
            "status" => "Chưa gửi"
        ];
    }
}

// 🔹 Trả về dữ liệu JSON
echo json_encode(array_values($classes), JSON_UNESCAPED_UNICODE);

$conn->close();
?>
