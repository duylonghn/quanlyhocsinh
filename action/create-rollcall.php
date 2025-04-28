<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

session_start();

// Bao gồm các file cấu hình cho cơ sở dữ liệu diemdanh và qlhs
include(__DIR__ . '/../config/config-rollcall.php');  // Kết nối diemdanh
include(__DIR__ . '/../config/config-database.php');  // Kết nối qlhs

// Lấy ngày hiện tại theo định dạng dd_mm_yy
$date = date('d_m_y');  // Ví dụ: 28_04_25

// Kiểm tra kết nối tới cơ sở dữ liệu diemdanh
if (!$conn_rollcall) {
    die("Kết nối tới cơ sở dữ liệu diemdanh thất bại: " . $conn_rollcall->connect_error);
}

// Kiểm tra kết nối tới cơ sở dữ liệu qlhs
if (!$conn) {
    die("Kết nối tới cơ sở dữ liệu qlhs thất bại: " . $conn->connect_error);
}

// Thiết lập mã hóa UTF-8 cho kết nối tới cơ sở dữ liệu diemdanh
$conn_rollcall->set_charset('utf8mb4');

// Tạo bảng điểm danh trong cơ sở dữ liệu diemdanh
$sql_create_table = "CREATE TABLE IF NOT EXISTS rollcall_$date (
    student_id INT,
    id_card VARCHAR(20),
    fullname VARCHAR(255) NOT NULL,
    time TIME DEFAULT NULL,  -- Chỉ có thể là NULL, không tự động nhập thời gian
    status ENUM('done', 'late', 'fail', 'licensed') DEFAULT 'fail',
    FOREIGN KEY (student_id) REFERENCES hwdkopen_qlhs.students(id) ON DELETE CASCADE
)";

if ($conn_rollcall->query($sql_create_table) === TRUE) {
    echo "Table rollcall_$date created successfully\n";
} else {
    echo "Error creating table: " . $conn_rollcall->error;
}

// Lấy thông tin học sinh từ cơ sở dữ liệu qlhs
$sql_select_students = "SELECT id, id_card, fullname FROM students";
$result = $conn->query($sql_select_students);

if ($result->num_rows > 0) {
    // Duyệt qua tất cả học sinh và chèn vào bảng điểm danh
    while ($row = $result->fetch_assoc()) {
        $student_id = $row['id'];
        $id_card = $row['id_card'];
        $fullname = $row['fullname'];  // Lấy tên học sinh
        
        // Kiểm tra nếu fullname là NULL
        if ($fullname === NULL) {
            echo "Warning: Fullname for student ID $student_id is NULL.\n";
            continue; // Bỏ qua nếu fullname là NULL
        } else {
            echo "Processing student: $fullname (ID: $student_id)\n";
        }

        // Chèn vào bảng điểm danh trong cơ sở dữ liệu diemdanh
        $sql_insert_rollcall = "INSERT INTO rollcall_$date (student_id, id_card, fullname) 
                                VALUES ($student_id, '$id_card', '$fullname')";

        if ($conn_rollcall->query($sql_insert_rollcall) === TRUE) {
            echo "Record for student $student_id inserted successfully\n";
        } else {
            echo "Error inserting record for student $student_id: " . $conn_rollcall->error . "\n";
        }
    }
} else {
    echo "No students found in the qlhs database\n";
}

// Đóng kết nối
$conn->close();
$conn_rollcall->close();
?>
