<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Cấu hình Bot Token của Telegram
$botToken = '7553473826:AAH5zLgjuBQpVVq1dbUlgOK8aF-9v2y5FUg'; // 👈 Thay token bot của bạn ở đây!

// Cấu hình cơ sở dữ liệu
include(__DIR__ . '/../config/config-database.php'); // Cấu hình kết nối database

// Hàm gửi tin nhắn Telegram
function sendTelegramMessage($chatId, $message, $botToken) {
    $url = "https://api.telegram.org/bot$botToken/sendMessage";
    
    $postData = [
        'chat_id' => $chatId,
        'text' => $message,
    ];

    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
    $result = curl_exec($ch);

    if ($result === false) {
        error_log('Lỗi khi gửi tin nhắn: ' . curl_error($ch));
    } else {
        error_log('Tin nhắn gửi thành công: ' . $result);
    }

    curl_close($ch);
}

// Hàm xử lý webhook
function handleWebhook($update) {
    global $conn, $botToken;

    // Kiểm tra nếu có tin nhắn từ người dùng
    if (!isset($update['message'])) {
        error_log("Không có tin nhắn trong webhook");
        return;
    }

    $message = $update['message'];
    $chatId = $message['chat']['id'];

    // Kiểm tra xem người dùng có đang gửi lệnh /start không
    if (isset($message['text']) && $message['text'] === '/start') {
        error_log("Đã nhận lệnh /start từ người dùng: " . $chatId);
        
        // Yêu cầu người dùng nhập mã học sinh
        $text = "Xin chào phụ huynh! Ba mẹ vui lòng nhập mã học sinh của con:";
        sendTelegramMessage($chatId, $text, $botToken);
    }

    // Kiểm tra nếu người dùng nhập mã học sinh
    elseif (isset($message['text'])) {
        $studentId = trim($message['text']);
        
        // Kiểm tra mã học sinh hợp lệ
        if (!is_numeric($studentId)) {
            $text = "Mã học sinh không hợp lệ. Vui lòng nhập lại mã học sinh hợp lệ.";
            sendTelegramMessage($chatId, $text, $botToken);
            return;
        }

        // Kiểm tra trong cơ sở dữ liệu
        $query = "SELECT id, fullname, class_id FROM students WHERE id = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("i", $studentId);
        $stmt->execute();
        $result = $stmt->get_result();

        // Kiểm tra nếu có lỗi trong truy vấn
        if ($stmt->error) {
            error_log("Lỗi khi truy vấn cơ sở dữ liệu: " . $stmt->error);
        }

        // Nếu tìm thấy sinh viên
        if ($result->num_rows > 0) {
            $student = $result->fetch_assoc();
            $classId = $student['class_id'];

            // Lấy tên lớp từ bảng classes
            $classQuery = "SELECT class_name FROM classes WHERE id = ?";
            $classStmt = $conn->prepare($classQuery);
            $classStmt->bind_param("i", $classId);
            $classStmt->execute();
            $classResult = $classStmt->get_result();

            // Nếu tìm thấy lớp học
            if ($classResult->num_rows > 0) {
                $class = $classResult->fetch_assoc();
                $className = $class['class_name'];
            } else {
                $className = "Không tìm thấy tên lớp.";
            }

            // Cập nhật id_tele trong bảng students
            $updateQuery = "UPDATE students SET id_tele = ? WHERE id = ?";
            $updateStmt = $conn->prepare($updateQuery);
            $updateStmt->bind_param("si", $chatId, $studentId);
            if ($updateStmt->execute()) {
                error_log("Cập nhật id_tele thành công cho học sinh có mã: $studentId");
            } else {
                error_log("Lỗi khi cập nhật id_tele cho học sinh có mã: $studentId");
            }

            // Gửi thông tin học sinh đến người dùng
            $text = "Thông tin học sinh:\n";
            $text .= "Họ tên: " . $student['fullname'] . "\n";
            $text .= "Mã học sinh: " . $student['id'] . "\n";
            $text .= "Lớp: " . $className . "\n";

            sendTelegramMessage($chatId, $text, $botToken);
        } else {
            error_log("Không tìm thấy học sinh với mã số: $studentId");
            // Nếu không tìm thấy học sinh trong database
            $text = "Không tìm thấy học sinh với mã số: $studentId. Vui lòng kiểm tra lại mã học sinh.";
            sendTelegramMessage($chatId, $text, $botToken);
        }
    }
}

// Lấy dữ liệu POST từ Telegram (Webhook)
$input = file_get_contents("php://input");
$update = json_decode($input, true);

// Ghi lại dữ liệu nhận được từ Telegram để debug
error_log("Dữ liệu nhận được từ Telegram: " . print_r($update, true));

// Kiểm tra dữ liệu webhook từ Telegram và xử lý
if (isset($update['message'])) {
    handleWebhook($update);
} else {
    error_log("Không có tin nhắn trong webhook");
}
?>
