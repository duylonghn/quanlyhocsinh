<?php
$servername = "192.168.11.139";
$username = "admin";
$password = "123456";
$dbname = "student_management"; // Đổi đúng tên database

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
