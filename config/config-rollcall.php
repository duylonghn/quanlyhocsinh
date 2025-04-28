<?php
$servername = "103.97.126.29";
$username = "hwdkopen_admin";
$password = "Qlhs@2025";
$dbname = "hwdkopen_diemdanh"; // Đổi đúng tên database

// Bật hiển thị lỗi
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Tạo kết nối
$conn_rollcall = new mysqli($servername, $username, $password, $dbname);

// Kiểm tra kết nối
if ($conn_rollcall->connect_error) {
    die("Kết nối thất bại: " . $conn_rollcall->connect_error);
} 
echo "";
// Thiết lập mã hóa UTF-8 cho kết nối tới diemdanh
$conn_rollcall->set_charset('utf8mb4');
?>
