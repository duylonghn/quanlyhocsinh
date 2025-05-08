<?php
header('Content-Type: application/json');

// Kết nối cơ sở dữ liệu
require_once __DIR__ . "/../config/config-database.php";
mysqli_set_charset($conn, "utf8mb4");

$semester_id = $_GET['semester_id'] ?? null;

if (!$semester_id) {
    echo json_encode(['success' => false, 'message' => 'Thiếu thông tin học kỳ']);
    exit;
}

// Truy vấn dữ liệu đánh giá
$sql = "
    SELECT e.student_id, e.behavior, e.academic_performance, e.rating, s.fullname
    FROM evaluations e
    JOIN students s ON e.student_id = s.id
    WHERE e.semester_id = ?
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $semester_id); // chỉ cần semester_id
$stmt->execute();
$result = $stmt->get_result();

$evaluations = [];

while ($row = $result->fetch_assoc()) {
    $evaluations[] = [
        'student_id' => $row['student_id'],
        'fullname' => $row['fullname'],
        'behavior' => $row['behavior'],
        'academic_performance' => $row['academic_performance'],
        'rating' => $row['rating']
    ];
}

$stmt->close();
$conn->close();

echo json_encode(['success' => true, 'data' => $evaluations]);
?>
