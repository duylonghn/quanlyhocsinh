<?php
ob_start(); // Ngăn lỗi header
error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Content-Type: application/json');

require_once __DIR__ . "/../config/config-database.php";
mysqli_set_charset($conn, "utf8mb4");

if (!$conn) {
    die(json_encode(["error" => "Lỗi kết nối database: " . mysqli_connect_error()]));
}

// Lấy class_id và subject_id từ URL
$class_id = $_GET['class_id'] ?? null;
$subject_id = $_GET['subject_id'] ?? null;

if (!$class_id || !$subject_id) {
    echo json_encode(["success" => false, "message" => "Thiếu class_id hoặc subject_id"]);
    exit;
}

// Lấy danh sách student_id theo class_id
$student_ids = [];
$sql_students = "SELECT id FROM students WHERE class_id = ?";
$stmt_students = $conn->prepare($sql_students);
$stmt_students->bind_param("s", $class_id);
$stmt_students->execute();
$result_students = $stmt_students->get_result();

while ($row = $result_students->fetch_assoc()) {
    $student_ids[] = $row['id'];
}
$stmt_students->close();

if (empty($student_ids)) {
    echo json_encode(["success" => true, "data" => []]);
    exit;
}

// Lấy điểm theo subject_id và danh sách student_id
$placeholders = implode(',', array_fill(0, count($student_ids), '?'));
$types = str_repeat('i', count($student_ids));
$params = array_merge([$subject_id], $student_ids);

// Tạo câu SQL
$sql_scores = "
    SELECT 
        student_id,
        oral_test_1, oral_test_2, oral_test_3,
        quiz_1, quiz_2,
        test_1, test_2,
        final_exam,
        total_score
    FROM scores
    WHERE subject_id = ?
    AND student_id IN ($placeholders)
";

// Chuẩn bị câu lệnh
$stmt_scores = $conn->prepare($sql_scores);
if (!$stmt_scores) {
    echo json_encode(["success" => false, "message" => "Lỗi chuẩn bị truy vấn điểm."]);
    exit;
}

// Gán tham số
$stmt_scores->bind_param("s" . $types, ...$params);
$stmt_scores->execute();
$result_scores = $stmt_scores->get_result();

// Trả dữ liệu ra JSON
$data = [];
while ($row = $result_scores->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode(["success" => true, "data" => $data]);
$stmt_scores->close();
$conn->close();
?>
