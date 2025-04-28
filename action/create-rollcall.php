<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Bao gồm cấu hình kết nối cơ sở dữ liệu
include(__DIR__ . '/../config/config-rollcall.php');  // Kết nối database diemdanh

// Kiểm tra kết nối
if (!$conn_rollcall) {
    die("Kết nối tới cơ sở dữ liệu thất bại: " . $conn_rollcall->connect_error);
}

// Nhận dữ liệu từ ESP32 gửi lên
$uid = isset($_GET['uid']) ? $_GET['uid'] : '';
$time = isset($_GET['time']) ? $_GET['time'] : '';

// Kiểm tra dữ liệu đầu vào
if (empty($uid) || empty($time)) {
    echo json_encode(["status" => "error", "message" => "Thiếu uid hoặc time"]);
    exit;
}

// Lấy ngày hiện tại để xác định tên bảng rollcall
$date = date('d_m_y');
$tableName = "rollcall_$date";

// Tìm kiếm học sinh trong bảng rollcall_$date
$sql = "SELECT student_id, fullname FROM `$tableName` WHERE id_card = ?";
$stmt = $conn_rollcall->prepare($sql);
if (!$stmt) {
    echo json_encode(["status" => "error", "message" => "Chuẩn bị truy vấn thất bại"]);
    exit;
}
$stmt->bind_param("s", $uid);
$stmt->execute();
$result = $stmt->get_result();

// Nếu tìm thấy học sinh
if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $student_id = $row['student_id'];
    $fullname = $row['fullname'];

    // Xác định trạng thái điểm danh
    $current_time = strtotime($time);
    $threshold_time = strtotime('07:00:00');
    $status = ($current_time > $threshold_time) ? 'late' : 'done';

    // Cập nhật thông tin time và status
    $update = "UPDATE `$tableName` SET time = ?, status = ? WHERE id_card = ?";
    $stmt_update = $conn_rollcall->prepare($update);
    if (!$stmt_update) {
        echo json_encode(["status" => "error", "message" => "Chuẩn bị cập nhật thất bại"]);
        exit;
    }
    $stmt_update->bind_param("sss", $time, $status, $uid);

    if ($stmt_update->execute()) {
        echo json_encode([
            "status" => "success",
            "id" => $student_id,
            "fullname" => $fullname,
            "time" => $time,
            "rollcall_status" => $status
        ]);
    } else {
        echo json_encode(["status" => "error", "message" => "Cập nhật thất bại"]);
    }
    $stmt_update->close();
} else {
    // Không tìm thấy học sinh với id_card đã cho
    echo json_encode(["status" => "error", "message" => "Không tìm thấy học sinh"]);
}

// Đóng kết nối
$stmt->close();
$conn_rollcall->close();
?>
