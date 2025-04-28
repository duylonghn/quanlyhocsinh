<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Kết nối tới database qlhs và diemdanh
include(__DIR__ . '/../config/config-database.php');    // qlhs
include(__DIR__ . '/../config/config-rollcall.php');    // diemdanh

header('Content-Type: application/json');

// Lấy ngày từ GET
$date = isset($_GET['date']) ? $_GET['date'] : '';

if (empty($date)) {
    echo json_encode(["error" => "Thiếu ngày cần tìm (date)!"]);
    exit();
}

$rollcall_table = 'rollcall_' . $date;

// 1. Lấy danh sách student_id có status = 'fail' từ bảng điểm danh
$queryFailStudents = "SELECT student_id FROM $rollcall_table WHERE status = 'fail'";
$resultFail = $conn_rollcall->query($queryFailStudents);

if (!$resultFail) {
    echo json_encode(["error" => "Lỗi truy vấn dữ liệu điểm danh hoặc bảng chưa tồn tại"]);
    exit();
}

$studentIds = [];
while ($row = $resultFail->fetch_assoc()) {
    $studentIds[] = $row['student_id'];
}

if (empty($studentIds)) {
    echo json_encode(["message" => "Không có học sinh nào vắng ngày này"]);
    exit();
}

// 2. Lấy thông tin chi tiết từ database qlhs
// Tạo chuỗi các dấu hỏi (?,?,?,...) cho bind_param
$placeholders = implode(',', array_fill(0, count($studentIds), '?'));

$queryDetails = "
    SELECT s.id AS student_id, s.fullname, c.class_name, s.id_tele
    FROM students s
    JOIN classes c ON s.class_id = c.id
    WHERE s.id IN ($placeholders)
";

$stmt = $conn->prepare($queryDetails);

if (!$stmt) {
    echo json_encode(["error" => "Lỗi chuẩn bị truy vấn"]);
    exit();
}

// Gán giá trị động
$types = str_repeat('i', count($studentIds)); // toàn bộ là int
$stmt->bind_param($types, ...$studentIds);

$stmt->execute();
$resultDetails = $stmt->get_result();

$studentsAbsent = [];
while ($student = $resultDetails->fetch_assoc()) {
    $studentsAbsent[] = [
        'student_id' => $student['student_id'],
        'fullname' => $student['fullname'],
        'class_name' => $student['class_name'],
        'telegram_id' => $student['id_tele'] ?? null
    ];
}

// Trả kết quả
header('Content-Type: application/json; charset=utf-8'); // Thêm dòng này để trả đúng định dạng
echo json_encode($studentsAbsent, JSON_UNESCAPED_UNICODE);
?>
