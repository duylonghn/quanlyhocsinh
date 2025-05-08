<?php
ob_start();
error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Content-Type: application/json');

require_once __DIR__ . "/../config/config-database.php";
mysqli_set_charset($conn, "utf8mb4");

$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['data']) || !is_array($input['data'])) {
    echo json_encode(['success' => false, 'message' => 'Dữ liệu không hợp lệ!']);
    exit;
}

$errors = [];
$successCount = 0;

foreach ($input['data'] as $item) {
    $student_id = $item['student_id'] ?? null;
    $semester_id = $item['semester_id'] ?? null;
    $behavior = $item['behavior'] ?? null;
    $academic = $item['academic_performance'] ?? null; // Sửa tên biến cho phù hợp với JS
    $rating = $item['rating'] ?? null;

    if (!$student_id || !$semester_id) {
        $errors[] = "Thiếu dữ liệu cho học sinh ID: $student_id";
        continue;
    }

    // Kiểm tra xem có bản ghi nào tồn tại chưa
    $stmt = $conn->prepare("SELECT 1 FROM evaluations WHERE student_id = ? AND semester_id = ?");
    $stmt->bind_param("is", $student_id, $semester_id); // Đảm bảo tham số kiểu phù hợp
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        // Cập nhật
        $stmt_update = $conn->prepare("
            UPDATE evaluations 
            SET behavior = ?, academic_performance = ?, rating = ? 
            WHERE student_id = ? AND semester_id = ?
        ");
        $stmt_update->bind_param("sssis", $behavior, $academic, $rating, $student_id, $semester_id);
        if ($stmt_update->execute()) {
            $successCount++;
        } else {
            $errors[] = "Không thể cập nhật cho HS ID: $student_id, lỗi: " . $stmt_update->error;
        }
        $stmt_update->close();
    } else {
        // Thêm mới
        $stmt_insert = $conn->prepare("
            INSERT INTO evaluations (student_id, semester_id, behavior, academic_performance, rating) 
            VALUES (?, ?, ?, ?, ?)
        ");
        $stmt_insert->bind_param("issss", $student_id, $semester_id, $behavior, $academic, $rating);
        if ($stmt_insert->execute()) {
            $successCount++;
        } else {
            $errors[] = "Không thể thêm đánh giá cho HS ID: $student_id, lỗi: " . $stmt_insert->error;
        }
        $stmt_insert->close();
    }

    $stmt->close();
}

$conn->close();

if (empty($errors)) {
    echo json_encode(['success' => true, 'message' => "Đã lưu $successCount đánh giá."]);
} else {
    echo json_encode(['success' => false, 'message' => 'Một số đánh giá không được lưu.', 'errors' => $errors]);
}
