<?php
session_start();
include(__DIR__ . '/../config/config-database.php');
$conn->set_charset("utf8mb4");

header('Content-Type: application/json; charset=utf-8');

$user_id = isset($_GET['id']) ? $_GET['id'] : null;
$semester_id = isset($_GET['semester']) ? $_GET['semester'] : null;

if ($user_id === null) {
    echo json_encode(["error" => "Thiếu user_id trong URL"], JSON_UNESCAPED_UNICODE);
    exit;
}

// Lấy thông tin học sinh
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

if (!$student_info) {
    echo json_encode(["error" => "Không tìm thấy học sinh"], JSON_UNESCAPED_UNICODE);
    exit;
}

// Danh sách học kỳ
$sql_semesters = "SELECT id AS semester_id, name AS semester_name FROM semesters";
$result_semesters = $conn->query($sql_semesters);
$semesters = $result_semesters->fetch_all(MYSQLI_ASSOC);

// Điểm số
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

// Hạnh kiểm (luôn lấy toàn bộ các kỳ)
$sql_eval = "SELECT semester_id, behavior, academic_performance, rating FROM evaluations WHERE student_id = ?";
$stmt_eval = $conn->prepare($sql_eval);
$stmt_eval->bind_param("i", $user_id);
$stmt_eval->execute();
$result_eval = $stmt_eval->get_result();

$evaluations = [];
while ($row = $result_eval->fetch_assoc()) {
    $evaluations[$row['semester_id']] = [
        "behavior" => $row['behavior'],
        "academic_performance" => $row['academic_performance'],
        "rating" => $row['rating']
    ];
}

$stmt_eval->execute();
$result_eval = $stmt_eval->get_result();

if ($semester_id) {
    $evaluations = $result_eval->fetch_assoc() ?: [
        "behavior" => "",
        "academic_performance" => "",
        "rating" => ""
    ];
} else {
    $evaluations = [];
    while ($row = $result_eval->fetch_assoc()) {
        $evaluations[$row['semester_id']] = [
            "behavior" => $row['behavior'],
            "academic_performance" => $row['academic_performance'],
            "rating" => $row['rating']
        ];
    }
}

// Trả về JSON
echo json_encode([
    "student_info" => $student_info,
    "semesters" => $semesters,
    "scores" => $scores,
    "evaluations" => $evaluations
], JSON_UNESCAPED_UNICODE);
?>
