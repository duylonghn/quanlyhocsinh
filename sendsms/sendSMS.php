<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Cấu hình Bot Token của Telegram
$botToken = '7553473826:AAH5zLgjuBQpVVq1dbUlgOK8aF-9v2y5FUg'; // 👈 Thay token bot của bạn ở đây!

// Lấy ngày hôm nay để gửi
$date = date('d/m/Y');

// Gọi API getStudentList.php
$getStudentListUrl = 'https://duylong.io.vn/sendsms/getStudentList.php?date=' . date('d_m_y');

$response = file_get_contents($getStudentListUrl);
if ($response === FALSE) {
    die('❌ Không thể lấy danh sách sinh viên.');
}

// Giải mã JSON thành mảng PHP
$students = json_decode($response, true);

// Kiểm tra dữ liệu
if (!is_array($students)) {
    die('❌ Dữ liệu trả về không hợp lệ.');
}

// Hàm kiểm tra quyền của người dùng với bot
function checkUserPermission($chatId, $botToken) {
    $url = "https://api.telegram.org/bot$botToken/getChat?chat_id=$chatId";
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $result = curl_exec($ch);
    curl_close($ch);

    $resultData = json_decode($result, true);
    if ($resultData['ok']) {
        return true;
    } else {
        echo '❌ Người dùng chưa bắt đầu trò chuyện với bot hoặc bot không có quyền gửi tin nhắn.\n';
        return false;
    }
}

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

    if (curl_errno($ch)) {
        echo '❌ Lỗi khi gửi tin nhắn: ' . curl_error($ch);
    }

    curl_close($ch);
}

// Gửi tin nhắn cho từng học sinh
foreach ($students as $student) {
    // Kiểm tra nếu học sinh có telegram_id
    if (empty($student['telegram_id'])) {
        echo "❌ Không có Telegram ID cho học sinh " . $student['fullname'] . "\n";
        continue; // Bỏ qua nếu không có telegram_id
    }

    // Kiểm tra quyền gửi tin nhắn
    if (!checkUserPermission($student['telegram_id'], $botToken)) {
        continue; // Bỏ qua nếu không có quyền gửi tin nhắn
    }

    // Soạn nội dung tin nhắn
    $message = "TRƯỜNG THPT ABC THÔNG BÁO\n";
    $message .= "Học sinh: " . $student['fullname'] . "\n";
    $message .= "Lớp: " . $student['class_name'] . "\n";
    $message .= "Mã học sinh: " . $student['student_id'] . "\n";
    $message .= "Ngày $date không điểm danh vào học. Ghi nhận tình trạng vắng buổi học ngày hôm nay. ";
    $message .= "Quý phụ huynh vui lòng phản hồi với giáo viên chủ nhiệm về lý do vắng mặt của học sinh.\n";
    $message .= "Trân trọng.";

    // Gửi tin nhắn đến tài khoản Telegram của học sinh
    sendTelegramMessage($student['telegram_id'], $message, $botToken);
}

echo "✅ Đã gửi tin nhắn đến học sinh vắng học!";
?>
