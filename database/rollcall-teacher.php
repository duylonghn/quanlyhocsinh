<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Kết nối tới cơ sở dữ liệu qlhs (lấy lớp học của giáo viên)
include(__DIR__ . '/../config/config-database.php');  // Kết nối với qlhs

// Kết nối tới cơ sở dữ liệu diemdanh (lấy điểm danh của sinh viên)
include(__DIR__ . '/../config/config-rollcall.php');  // Kết nối với diemdanh

// Kiểm tra và lấy dữ liệu từ GET
$teacher_id = isset($_GET['teacher_id']) ? intval($_GET['teacher_id']) : 0;
$date = isset($_GET['date']) ? $_GET['date'] : '';

if ($teacher_id == 0 || empty($date)) {
    echo json_encode(["error" => "Thiếu teacher_id hoặc date"]);
    exit();
}

// Sử dụng trực tiếp giá trị date từ URL theo định dạng 'dd_mm_yy'
$rollcall_table = 'rollcall_' . $date;  // Tạo tên bảng theo định dạng dd_mm_yy

// 1. Lấy lớp chủ nhiệm của giáo viên từ cơ sở dữ liệu qlhs
$query = "SELECT c.id AS class_id, c.class_name
          FROM teacher_class tc
          JOIN classes c ON tc.class_id = c.id
          WHERE tc.teacher_id = ?";
$stmt = $conn->prepare($query);  // Sử dụng kết nối `conn` của qlhs
$stmt->bind_param("i", $teacher_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows == 0) {
    echo json_encode(["error" => "Không tìm thấy lớp chủ nhiệm cho giáo viên"]);
    exit();
}

$classData = [];
while ($row = $result->fetch_assoc()) {
    $classData[] = $row;
}

// 2. Lấy trạng thái điểm danh cho từng sinh viên trong ngày từ cơ sở dữ liệu diemdanh
$attendanceData = [];
foreach ($classData as $class) {
    $class_id = $class['class_id'];

    // Truy vấn lấy danh sách sinh viên trong lớp từ cơ sở dữ liệu qlhs
    $studentQuery = "SELECT id AS student_id, fullname
                     FROM students
                     WHERE class_id = ?";
    $studentStmt = $conn->prepare($studentQuery);  // Sử dụng kết nối `conn` của qlhs để truy vấn bảng `students`
    $studentStmt->bind_param("i", $class_id);
    $studentStmt->execute();
    $studentResult = $studentStmt->get_result();

    $students = [];
    while ($studentRow = $studentResult->fetch_assoc()) {
        $students[] = [
            'student_id' => $studentRow['student_id'],
            'fullname' => $studentRow['fullname'],
            'status' => 'Vắng' // Mặc định là vắng nếu không có trạng thái
        ];
    }

    // Truy vấn lấy điểm danh của sinh viên trong lớp cho ngày hiện tại từ bảng điểm danh trong diemdanh
    $attendanceQuery = "SELECT student_id, status
                        FROM $rollcall_table
                        WHERE student_id = ?";
    $attendanceStmt = $conn_rollcall->prepare($attendanceQuery);  // Sử dụng kết nối `conn_rollcall` để truy vấn bảng điểm danh
    foreach ($students as &$student) {
        // Lặp qua các sinh viên và lấy trạng thái điểm danh của từng sinh viên
        $attendanceStmt->bind_param("i", $student['student_id']);
        $attendanceStmt->execute();
        $attendanceResult = $attendanceStmt->get_result();

        // Cập nhật trạng thái điểm danh cho sinh viên
        if ($attendanceRow = $attendanceResult->fetch_assoc()) {
            switch ($attendanceRow['status']) {
                case 'fail':
                    $student['status'] = 'Vắng';
                    break;
                case 'done':
                    $student['status'] = 'Đúng giờ';
                    break;
                case 'late':
                    $student['status'] = 'Muộn';
                    break;
                case 'licensed':
                    $student['status'] = 'Có phép';
                    break;
                default:
                    $student['status'] = 'Vắng'; // Trường hợp mặc định nếu không có trạng thái
                    break;
            }
        }
    }

    // Kiểm tra lớp học đã được thêm vào chưa, nếu chưa thì thêm
    $classExists = false;
    foreach ($attendanceData as $data) {
        if ($data['class_id'] == $class_id) {
            $classExists = true;
            break;
        }
    }

    // Thêm lớp học vào kết quả nếu chưa có
    if (!$classExists) {
        $attendanceData[] = [
            'class_id' => $class_id,
            'class_name' => $class['class_name'],
            'students' => $students
        ];
    }
}

header('Content-Type: application/json; charset=utf-8');
echo json_encode($attendanceData, JSON_UNESCAPED_UNICODE);
?>
