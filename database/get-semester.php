<?php
session_start();
include(__DIR__ . '/../config/config-database.php'); // Kết nối database

header('Content-Type: application/json; charset=utf-8');

// Truy vấn tất cả các kỳ học từ bảng semesters
$sql = "SELECT id, name FROM semesters ORDER BY stt DESC";

// Thực thi truy vấn
$result = $conn->query($sql);

// Khởi tạo mảng để chứa dữ liệu
$semesters = array();

// Kiểm tra và lưu dữ liệu vào mảng
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $semesters[] = $row;  // Thêm dữ liệu vào mảng
    }
} else {
    $semesters = array("message" => "Không có dữ liệu kỳ học.");
}

// Chuyển dữ liệu thành JSON và trả về
echo json_encode($semesters);

// Đóng kết nối
$conn->close();
?>