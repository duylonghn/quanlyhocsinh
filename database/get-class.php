<?php
session_start();
include(__DIR__ . '/../config/config-database.php'); // Kết nối database
// Đảm bảo kết nối MySQL sử dụng UTF-8
$conn->set_charset("utf8mb4");

header('Content-Type: application/json; charset=utf-8');

// Lấy ID giáo viên từ URL
$teacher_id = isset($_GET['teacher_id']) ? intval($_GET['teacher_id']) : 0;

// Kiểm tra ID hợp lệ
if ($teacher_id <= 0) {
    echo json_encode(["error" => "ID giáo viên không hợp lệ"], JSON_UNESCAPED_UNICODE);
    exit;
}

// Bước 1: Lấy danh sách các lớp mà giáo viên phụ trách từ bảng teacher_class
$sql = "SELECT tc.class_id, tc.subject_id 
        FROM teacher_class tc
        WHERE tc.teacher_id = ?";  // Lấy các lớp mà giáo viên phụ trách
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $teacher_id);
$stmt->execute();
$result = $stmt->get_result();

$classes_info = [];
while ($row = $result->fetch_assoc()) {
    $classes_info[] = $row;
}

// Bước 2: Lấy tên môn từ bảng subjects theo subject_id (Tên môn trong bảng `subjects` là cột `name`)
foreach ($classes_info as &$class) {
    $subject_id = $class['subject_id'];
    
    // Lấy tên môn từ bảng subjects
    $sql_subject = "SELECT name AS subject_name FROM subjects WHERE id = ?";
    $stmt_subject = $conn->prepare($sql_subject);
    $stmt_subject->bind_param("s", $subject_id); // Sử dụng 's' nếu subject_id là chuỗi
    $stmt_subject->execute();
    $subject_result = $stmt_subject->get_result();

    if ($subject_result->num_rows > 0) {
        $subject_row = $subject_result->fetch_assoc();
        $class['subject_name'] = $subject_row['subject_name'];
    } else {
        $class['subject_name'] = 'Không xác định';  // Trường hợp không tìm thấy môn học
    }

    // Bước 3: Lấy thông tin lớp và đếm số học sinh trong mỗi lớp
    $class_id = $class['class_id'];

    // Lấy tên lớp từ bảng classes
    $sql_class_name = "SELECT class_name FROM classes WHERE id = ?";
    $stmt_class_name = $conn->prepare($sql_class_name);
    $stmt_class_name->bind_param("s", $class_id); // Lấy class_name cho từng class_id
    $stmt_class_name->execute();
    $class_name_result = $stmt_class_name->get_result();

    if ($class_name_result->num_rows > 0) {
        $class_name_row = $class_name_result->fetch_assoc();
        $class['class_name'] = $class_name_row['class_name'];
    } else {
        $class['class_name'] = 'Không xác định';
    }

    // Đếm số học sinh trong lớp
    $sql_student_count = "SELECT COUNT(id) AS student_count FROM students WHERE class_id = ?";
    $stmt_student_count = $conn->prepare($sql_student_count);
    $stmt_student_count->bind_param("s", $class_id); // Sử dụng 's' cho class_id là chuỗi
    $stmt_student_count->execute();
    $student_count_result = $stmt_student_count->get_result();

    if ($student_count_result->num_rows > 0) {
        $student_count = $student_count_result->fetch_assoc()['student_count'];
        $class['student_count'] = $student_count;
    } else {
        $class['student_count'] = 0;
    }
}

// Bước 4: Lấy thông tin lớp chủ nhiệm (Nếu có)
$homeroom_class = null;
$sql_homeroom = "SELECT c.id, c.class_name, COUNT(s.id) AS student_count
                 FROM classes c
                 LEFT JOIN students s ON s.class_id = c.id
                 WHERE c.teacher_id = ?  -- Giáo viên chủ nhiệm được xác định qua teacher_id
                 GROUP BY c.id";
$stmt_homeroom = $conn->prepare($sql_homeroom);
$stmt_homeroom->bind_param("i", $teacher_id);
$stmt_homeroom->execute();
$homeroom_result = $stmt_homeroom->get_result();
if ($homeroom_result->num_rows > 0) {
    $homeroom_class = $homeroom_result->fetch_assoc();
}

// Đóng kết nối
$stmt->close();
$stmt_homeroom->close();
$conn->close();

// Trả về dữ liệu bao gồm lớp chủ nhiệm và các lớp dạy môn
echo json_encode([
    'homeroom_class' => $homeroom_class,
    'subject_classes' => $classes_info
], JSON_UNESCAPED_UNICODE);
?>
