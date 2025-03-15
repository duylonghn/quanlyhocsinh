<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

session_start();
include(__DIR__ . '/../config/config-database.php'); // Đảm bảo đường dẫn đúng

if (!isset($conn)) {
    die("Lỗi: Không thể kết nối database.");
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $user_id = $_POST['id']; // Lấy ID từ form
    $password = $_POST['password'];

    // Kiểm tra ID có trong database không
    $sql = "SELECT * FROM users WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $user_id); // id dạng chuỗi (9 số)
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $user = $result->fetch_assoc();

        // Kiểm tra mật khẩu (Nên dùng password_verify nếu lưu mật khẩu dạng hash)
        if ($password == $user['password']) {
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['role'] = $user['role'];

            // Nếu là student, kiểm tra trong bảng students
            if ($user['role'] == 'student') {
                $sql_student = "SELECT id FROM students WHERE id = ?";
                $stmt_student = $conn->prepare($sql_student);
                $stmt_student->bind_param("s", $user['id']);
                $stmt_student->execute();
                $result_student = $stmt_student->get_result();

                if ($result_student->num_rows === 1) {
                    $_SESSION['student_id'] = $user['id'];
                }
            }

            // Nếu là teacher, kiểm tra trong bảng teachers
            if ($user['role'] == 'teacher') {
                $sql_teacher = "SELECT id FROM teachers WHERE id = ?";
                $stmt_teacher = $conn->prepare($sql_teacher);
                $stmt_teacher->bind_param("s", $user['id']);
                $stmt_teacher->execute();
                $result_teacher = $stmt_teacher->get_result();

                if ($result_teacher->num_rows === 1) {
                    $_SESSION['teacher_id'] = $user['id'];
                }
            }

            // Điều hướng theo role
            if ($user['role'] == 'student') {
                header("Location: /../../student/info.php?id=" . urlencode($user['id']));
            } elseif ($user['role'] == 'teacher') {
                header("Location: /../../teacher/info-teacher.php?id=" . urlencode($user['id']));
            } else {
                header("Location: login.php?error=invalid_role");
            }
            exit();
        } else {
            header("Location: login.php?error=wrong_password");
            exit();
        }
    } else {
        header("Location: login.php?error=user_not_found");
        exit();
    }
}
?>
