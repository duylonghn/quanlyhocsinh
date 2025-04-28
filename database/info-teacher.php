<?php
session_start();
include(__DIR__ . '/../config/config-database.php'); // Kết nối database
// Đảm bảo kết nối MySQL sử dụng UTF-8
$conn->set_charset("utf8mb4");

// Thiết lập header JSON
header('Content-Type: application/json; charset=utf-8');

// Lấy `teacher_id` từ URL (đúng với URL bạn đang dùng)
$teacher_id = isset($_GET['teacher_id']) ? intval($_GET['teacher_id']) : 0;

// Ghi log để kiểm tra ID nhận được
error_log("Teacher ID nhận được: " . $teacher_id);

// Kiểm tra ID hợp lệ
if ($teacher_id <= 0) {
    echo json_encode(["error" => "ID giáo viên không hợp lệ"]);
    exit;
}

// Lấy thông tin giáo viên theo `teacher_id`
$sql = "SELECT id, fullname, sex, class_id, course, phone, email, cccd, nation, religion, birthplace, address
        FROM teachers WHERE id = ? LIMIT 1";

if ($stmt = $conn->prepare($sql)) {
    $stmt->bind_param("i", $teacher_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        echo json_encode($result->fetch_assoc(), JSON_UNESCAPED_UNICODE);
    } else {
        echo json_encode(["error" => "Không tìm thấy giáo viên"]);
    }

    $stmt->close();
} else {
    echo json_encode(["error" => "Lỗi truy vấn: " . $conn->error]);
}

$conn->close();
?>
