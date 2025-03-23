<?php
$servername = "103.97.126.29";
$username = "hwdkopen_admin";
$password = "Qlhs@2025";
$dbname = "hwdkopen_qlhs"; // Đổi đúng tên database

// Bật hiển thị lỗi
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Tạo kết nối
$conn = new mysqli($servername, $username, $password, $dbname);

// Kiểm tra kết nối
if ($conn->connect_error) {
    die("Kết nối thất bại: " . $conn->connect_error);
} 
echo "";
?>
