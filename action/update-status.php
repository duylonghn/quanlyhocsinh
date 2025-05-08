<?php
ob_start();
error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Content-Type: application/json');

// Kết nối cơ sở dữ liệu
require_once __DIR__ . "/../config/config-rollcall.php";
mysqli_set_charset($conn_rollcall, "utf8mb4");

// Lấy dữ liệu từ request (dạng JSON)
$input = json_decode(file_get_contents("php://input"), true);

// Kiểm tra dữ liệu đầu vào
if (!isset($input['student_id'], $input['status'], $input['date'])) {
    http_response_code(400);
    echo json_encode(["error" => "Thiếu dữ liệu đầu vào."]);
    exit;
}

$student_id = $input['student_id'];
$status = $input['status'];

// Thay đổi giá trị status theo yêu cầu
$status_map = [
    "Vắng" => "fail",
    "Muộn" => "late",
    "Có phép" => "licensed",
    "Đúng giờ" => "done"
];

// Kiểm tra nếu trạng thái là hợp lệ
if (!array_key_exists($status, $status_map)) {
    http_response_code(400);
    echo json_encode(["error" => "Trạng thái không hợp lệ."]);
    exit;
}

// Chuyển trạng thái theo bảng quy đổi
$status = $status_map[$status];

// Kiểm tra định dạng ngày
$date_parts = explode('_', $input['date']);
if (count($date_parts) !== 3) {
    http_response_code(400);
    echo json_encode(["error" => "Định dạng ngày không hợp lệ."]);
    exit;
}

// Tạo tên bảng theo định dạng 'rollcall_dd_mm_yy'
$table_name = "rollcall_" . $date_parts[0] . "_" . $date_parts[1] . "_" . $date_parts[2];

// Cập nhật trạng thái trong cơ sở dữ liệu
try {
    // Cập nhật status dựa trên student_id mà không cần tham chiếu đến cột date trong bảng
    $stmt = $conn_rollcall->prepare("UPDATE `$table_name` SET status = ? WHERE student_id = ?");
    $stmt->bind_param("ss", $status, $student_id);  // Không cần cột 'date', chỉ cần student_id

    if ($stmt->execute()) {
        echo json_encode([
            "success" => true,
            "student_id" => $student_id,
            "new_status" => $status
        ]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Không thể cập nhật dữ liệu."]);
    }

    $stmt->close();
    $conn_rollcall->close();
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>
