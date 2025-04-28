<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

session_start();
// Kết nối cơ sở dữ liệu
include(__DIR__ . '/../config/config-rollcall.php');  // Đảm bảo file config-rollcall.php đã được bao gồm

// Lấy ngày hiện tại theo định dạng dd_mm_yy
$date = date('d_m_y');  // Ví dụ: 25_04_25

// Tạo bảng điểm danh theo ngày
$sql_create_table = "CREATE TABLE IF NOT EXISTS rollcall_$date (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT,
    id_card VARCHAR(20),
    time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('done', 'late', 'fail', 'licensed') DEFAULT 'fail',
    FOREIGN KEY (student_id) REFERENCES qlhs.students(id) ON DELETE CASCADE
)";

if ($conn->query($sql_create_table) === TRUE) {
    echo "Table rollcall_$date created successfully\n";
} else {
    echo "Error creating table: " . $conn->error;
}

// Đóng kết nối
$conn->close();
?>