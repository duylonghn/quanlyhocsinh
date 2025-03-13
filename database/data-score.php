<?php
session_start();
include(__DIR__ . '/../config/config-database.php');

header('Content-Type: application/json; charset=utf-8');

// Lấy user_id từ session (đã kiểm tra đăng nhập ở file khác)
$user_id = $_SESSION['user_id'];

// Lấy học kỳ từ request (nếu có)
$semester_id = isset($_GET['semester']) ? $_GET['semester'] : null;

// Truy vấn thông tin học sinh
$sql_student = "SELECT st.id AS student_id, st.fullname AS fullname, 
                       c.class_name AS class, st.course AS course, sch.name AS school 
                FROM students st 
                JOIN schools sch ON st.school_id = sch.id 
                JOIN classes c ON st.class_id = c.id 
                WHERE st.id = ?";

$stmt_student = $conn->prepare($sql_student);
$stmt_student->bind_param("i", $user_id);
$stmt_student->execute();
$result_student = $stmt_student->get_result();
$student_info = $result_student->fetch_assoc();

// Nếu không tìm thấy học sinh, trả về lỗi
if (!$student_info) {
    echo json_encode(["error" => "Không tìm thấy học sinh"], JSON_UNESCAPED_UNICODE);
    exit;
}

// Truy vấn danh sách học kỳ
$sql_semesters = "SELECT id AS semester_id, name AS semester_name FROM semesters";
$result_semesters = $conn->query($sql_semesters);
$semesters = $result_semesters->fetch_all(MYSQLI_ASSOC);

// Truy vấn điểm số theo học kỳ (lọc nếu có semester_id)
$sql_scores = "SELECT s.name AS subject, sem.id AS semester, sem.name AS semester_name, 
                      sc.oral_test_1, sc.oral_test_2, sc.oral_test_3, 
                      sc.quiz_1, sc.quiz_2, sc.test_1, sc.test_2, sc.final_exam, sc.total_score
               FROM scores sc
               JOIN subjects s ON sc.subject_id = s.id
               JOIN semesters sem ON sc.semester_id = sem.id
               WHERE sc.student_id = ?";

if ($semester_id) {
    $sql_scores .= " AND sc.semester_id = ?";
}

$stmt_scores = $conn->prepare($sql_scores);

if ($semester_id) {
    $stmt_scores->bind_param("ii", $user_id, $semester_id);
} else {
    $stmt_scores->bind_param("i", $user_id);
}

$stmt_scores->execute();
$result_scores = $stmt_scores->get_result();
$scores = $result_scores->fetch_all(MYSQLI_ASSOC);

// Trả về JSON
echo json_encode([
    "student_info" => $student_info,
    "semesters" => $semesters,
    "scores" => $scores
], JSON_UNESCAPED_UNICODE);
?>
