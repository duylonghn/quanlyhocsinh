<?php
header("Content-Type: application/json; charset=UTF-8");
require_once __DIR__ . "/../../config/config-database.php";

// Đảm bảo kết nối MySQL là utf8mb4
mysqli_set_charset($conn, "utf8mb4");

// Nhận dữ liệu từ AJAX
$data = json_decode(file_get_contents("php://input"), true);

// Kiểm tra dữ liệu đầu vào
if (!$data || !isset($data['teacher_id']) || !is_numeric($data['teacher_id'])) {
    echo json_encode(["success" => false, "error" => "Dữ liệu không hợp lệ!"], JSON_UNESCAPED_UNICODE);
    exit;
}

$teacher_id = intval($data['teacher_id']); // Chuyển `teacher_id` về kiểu số nguyên
$phone = trim($data['phone'] ?? "");
$email = trim($data['email'] ?? "");
$cccd = trim($data['cccd'] ?? "");
$nation = trim($data['nation'] ?? "");
$religion = trim($data['religion'] ?? "");
$birthplace = trim($data['birthplace'] ?? "");
$address = trim($data['address'] ?? "");

// Kiểm tra nếu teacher_id không tồn tại trong database
$query_check = "SELECT id FROM teachers WHERE id = ?";
$stmt_check = $conn->prepare($query_check);
$stmt_check->bind_param("i", $teacher_id);
$stmt_check->execute();
$result_check = $stmt_check->get_result();

if ($result_check->num_rows === 0) {
    echo json_encode(["success" => false, "error" => "Không tìm thấy giáo viên với ID này!"], JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    // Chuẩn bị câu lệnh UPDATE
    $stmt = $conn->prepare("UPDATE teachers 
                            SET phone = ?, email = ?, cccd = ?, nation = ?, religion = ?, birthplace = ?, address = ?
                            WHERE id = ?");
    $stmt->bind_param("sssssssi", $phone, $email, $cccd, $nation, $religion, $birthplace, $address, $teacher_id);
    
    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Cập nhật thành công!"], JSON_UNESCAPED_UNICODE);
    } else {
        echo json_encode(["success" => false, "error" => "Lỗi khi cập nhật dữ liệu!"], JSON_UNESCAPED_UNICODE);
    }
} catch (Exception $e) {
    echo json_encode(["success" => false, "error" => "Lỗi hệ thống: " . $e->getMessage()], JSON_UNESCAPED_UNICODE);
}
?>
