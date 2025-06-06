<?php
ob_start();
error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Content-Type: application/json');

require_once __DIR__ . "/../config/config-database.php";
mysqli_set_charset($conn, "utf8mb4");

$input = json_decode(file_get_contents("php://input"), true);

if (!isset($input['data']) || !is_array($input['data'])) {
    echo json_encode(["success" => false, "message" => "Dữ liệu không hợp lệ"]);
    exit;
}

foreach ($input['data'] as $entry) {
    $studentId = intval($entry['student_id']);
    $classId = $conn->real_escape_string($entry['class_id'] ?? '');
    $subjectId = $conn->real_escape_string($entry['subject_id'] ?? '');
    $semesterId = $conn->real_escape_string($entry['semester_id'] ?? '');

    // Kiểm tra xem có đủ dữ liệu quan trọng không
    if (!$studentId || !$subjectId || !$semesterId) {
        continue; // Bỏ qua nếu thiếu dữ liệu quan trọng
    }

    // Lấy điểm
    $m1 = $entry['oral_test_1'] ?? null;
    $m2 = $entry['oral_test_2'] ?? null;
    $m3 = $entry['oral_test_3'] ?? null;
    $p1 = $entry['quiz_1'] ?? null;
    $p2 = $entry['quiz_2'] ?? null;
    $t1 = $entry['test_1'] ?? null;
    $t2 = $entry['test_2'] ?? null;
    $ck = $entry['final_exam'] ?? null;

    // Kiểm tra xem có dữ liệu điểm nào không
    if (!$m1 && !$m2 && !$m3 && !$p1 && !$p2 && !$t1 && !$t2 && !$ck) {
        continue; // Bỏ qua nếu không có điểm nào
    }

    // Chèn điểm hoặc cập nhật nếu đã tồn tại
    $stmt = $conn->prepare("
        INSERT INTO scores (student_id, subject_id, semester_id, oral_test_1, oral_test_2, oral_test_3, quiz_1, quiz_2, test_1, test_2, final_exam)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
            oral_test_1 = VALUES(oral_test_1),
            oral_test_2 = VALUES(oral_test_2),
            oral_test_3 = VALUES(oral_test_3),
            quiz_1 = VALUES(quiz_1),
            quiz_2 = VALUES(quiz_2),
            test_1 = VALUES(test_1),
            test_2 = VALUES(test_2),
            final_exam = VALUES(final_exam)
    ");
    $stmt->bind_param(
        "issdddddddd",
        $studentId, $subjectId, $semesterId,
        $m1, $m2, $m3, $p1, $p2, $t1, $t2, $ck
    );
    $stmt->execute();
    $stmt->close();
}

echo json_encode(["success" => true]);
