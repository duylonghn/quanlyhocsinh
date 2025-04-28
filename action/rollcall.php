<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Bao gồm cấu hình kết nối cơ sở dữ liệu cho diemdanh
include(__DIR__ . '/../config/config-rollcall.php');  // Kết nối diemdanh

// Kiểm tra kết nối cơ sở dữ liệu
if (!$conn_rollcall) {
    die("Kết nối tới cơ sở dữ liệu diemdanh thất bại: " . $conn_rollcall->connect_error);
}

// Lấy thông tin UID và thời gian từ request GET (ESP32 gửi lên)
$uid = isset($_GET['uid']) ? $_GET['uid'] : '';  // UID (id_card)
$time = isset($_GET['time']) ? $_GET['time'] : '';  // Thời gian điểm danh

// Kiểm tra xem UID và time có được gửi hay không
if (empty($uid) || empty($time)) {
    echo json_encode(["status" => "error", "message" => "UID or time missing"]);
    exit;
}

// Lấy ngày hiện tại theo định dạng dd_mm_yy
$date = date('d_m_y');

// Kiểm tra xem học sinh có tồn tại trong bảng `students` với UID (id_card)
$sql_check_student = "SELECT id, fullname FROM students WHERE id_card = ?";
$stmt = $conn_rollcall->prepare($sql_check_student);
$stmt->bind_param("s", $uid);
$stmt->execute();
$result = $stmt->get_result();

// Nếu học sinh tồn tại
if ($result->num_rows > 0) {
    // Lấy thông tin học sinh
    $student = $result->fetch_assoc();
    $student_id = $student['id'];
    $fullname = $student['fullname'];

    // Kiểm tra thời gian để xác định trạng thái
    $status = 'done';
    $current_time = strtotime($time);  // Chuyển thời gian sang timestamp
    $threshold_time = strtotime('07:00:00');  // Thời gian 7:00 AM

    // Nếu điểm danh sau 7h sáng thì trạng thái là 'late'
    if ($current_time > $threshold_time) {
        $status = 'late';
    }

    // Chèn thông tin điểm danh vào bảng `rollcall_$date`
    $sql_insert = "INSERT INTO rollcall_$date (student_id, id_card, time, status) VALUES (?, ?, ?, ?)";
    $stmt_insert = $conn_rollcall->prepare($sql_insert);
    $stmt_insert->bind_param("isss", $student_id, $uid, $time, $status);

    if ($stmt_insert->execute()) {
        // Trả về thông tin học sinh và trạng thái điểm danh
        echo json_encode([
            "status" => "success",
            "id" => $student_id,
            "fullname" => $fullname,
            "status" => $status,
            "time" => $time
        ]);
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to insert record"]);
    }
} else {
    // Nếu không tìm thấy học sinh với UID
    echo json_encode(["status" => "error", "message" => "Student not found"]);
}

// Đóng kết nối
$stmt->close();
$stmt_insert->close();
$conn_rollcall->close();
?>
