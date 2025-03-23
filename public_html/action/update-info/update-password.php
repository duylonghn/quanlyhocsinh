<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

session_start();
include(__DIR__ . '/../../config/config-database.php'); // Đảm bảo đường dẫn đúng

if (!isset($conn)) {
    die("Lỗi: Không thể kết nối database.");
}

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["success" => false, "error" => "Phương thức không hợp lệ!"]);
    exit;
}

$userId = $_SESSION['user_id'] ?? null;
$oldPassword = $_POST['oldPassword'] ?? '';
$newPassword = $_POST['newPassword'] ?? '';

if (!$userId) {
    echo json_encode(["success" => false, "error" => "Người dùng chưa đăng nhập!"]);
    exit;
}

if (!$oldPassword || !$newPassword) {
    echo json_encode(["success" => false, "error" => "Thiếu thông tin mật khẩu!"]);
    exit;
}

// ✅ Ghi log để debug
file_put_contents("debug_log.txt", "UserID: $userId, OldPass: $oldPassword, NewPass: $newPassword\n", FILE_APPEND);

// ✅ Kiểm tra mật khẩu cũ
$stmt = $conn->prepare("SELECT password FROM users WHERE id = ?");
$stmt->bind_param("i", $userId);
$stmt->execute();
$stmt->bind_result($storedPassword);
$stmt->fetch();
$stmt->close();

if ($oldPassword !== $storedPassword) {
    echo json_encode(["success" => false, "error" => "Mật khẩu cũ không đúng!"]);
    exit;
}

// 🔄 Cập nhật mật khẩu mới
$updateStmt = $conn->prepare("UPDATE users SET password = ? WHERE id = ?");
$updateStmt->bind_param("si", $newPassword, $userId);

if ($updateStmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "error" => "Lỗi khi cập nhật mật khẩu!"]);
}

$updateStmt->close();
$conn->close();
