<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

include(__DIR__ . '/../config/config-database.php');     // DB: qlhs
include(__DIR__ . '/../config/config-rollcall.php');     // DB: diemdanh

// Nhận teacher_id từ GET request
$teacher_id = isset($_GET['teacher_id']) ? intval($_GET['teacher_id']) : 0;

if ($teacher_id === 0) {
    echo json_encode(["error" => "Thiếu teacher_id"]);
    exit();
}

// 1. Lấy class_id của giáo viên từ bảng teachers
$classStmt = $conn->prepare("SELECT class_id FROM teachers WHERE id = ?");
$classStmt->bind_param("i", $teacher_id);
$classStmt->execute();
$classResult = $classStmt->get_result();

if ($classResult->num_rows === 0) {
    echo json_encode(["error" => "Không tìm thấy lớp của giáo viên"]);
    exit();
}

$class_id = $classResult->fetch_assoc()['class_id'];

// 2. Lấy danh sách student_id thuộc class_id đó từ bảng students
$studentStmt = $conn->prepare("SELECT id FROM students WHERE class_id = ?");
$studentStmt->bind_param("s", $class_id);  // class_id có thể là chuỗi, nên dùng "s" cho bind_param
$studentStmt->execute();
$studentResult = $studentStmt->get_result();

// Kiểm tra nếu không có học sinh trong lớp
if ($studentResult->num_rows === 0) {
    echo json_encode(["error" => "Không có học sinh trong lớp"]);
    exit();
}

// Lấy danh sách student_id
$studentIds = [];
while ($row = $studentResult->fetch_assoc()) {
    $studentIds[] = $row['id'];
}

// Bước 3: Truy vấn thông tin điểm danh từ bảng rollcall trong DB diemdanh
// Nhận ngày từ GET request, ví dụ: 03_05_25
$date_param = isset($_GET['date']) ? $_GET['date'] : '';

if (!preg_match('/^\d{2}_\d{2}_\d{2}$/', $date_param)) {
    echo json_encode(["error" => "Ngày không hợp lệ hoặc thiếu"]);
    exit();
}

$rollcall_table = 'rollcall_' . $date_param;

$studentIdsList = implode(',', $studentIds); // Chuyển danh sách student_id thành chuỗi để truy vấn

// Truy vấn lấy thông tin điểm danh
$rollcallStmt = $conn_rollcall->prepare("SELECT student_id, fullname, status, note 
                                          FROM $rollcall_table 
                                          WHERE student_id IN ($studentIdsList)");

$rollcallStmt->execute();
$rollcallResult = $rollcallStmt->get_result();

// Kiểm tra nếu có dữ liệu điểm danh
if ($rollcallResult->num_rows === 0) {
    echo json_encode(["error" => "Không có thông tin điểm danh cho học sinh"]);
    exit();
}

// Lấy danh sách thông tin điểm danh của học sinh
$students = [];
while ($row = $rollcallResult->fetch_assoc()) {
    $students[] = [
        'student_id' => $row['student_id'],
        'fullname' => $row['fullname'], 
        'status' => match($row['status']) {
            'done' => 'Đúng giờ',
            'late' => 'Muộn',
            'licensed' => 'Có phép',
            default => 'Vắng'
        },
        'notification_status' => $row['note'] === 'sent' ? 'Đã gửi' : 'Chưa gửi'
    ];
}

// Trả kết quả JSON với danh sách thông tin học sinh và điểm danh
echo json_encode([
    'class_id' => $class_id,
    'students' => $students
], JSON_UNESCAPED_UNICODE);
?>
