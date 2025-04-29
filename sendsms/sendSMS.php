<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Cấu hình Bot Token của Telegram
$botToken = '7553473826:AAH5zLgjuBQpVVq1dbUlgOK8aF-9v2y5FUg'; 

// Include file cấu hình database rollcall
include(__DIR__ . '/../config/config-rollcall.php');

// Xác định ngày hôm nay
$date_display = date('d/m/Y');         // Dạng để hiển thị
$date_db = date('Y-m-d');               // Dạng lưu DB
$date_table = date('d_m_y');            // Dùng tạo tên bảng

$rollcall_table = 'rollcall_' . $date_table; // Ví dụ: rollcall_28_04_25

// Gọi API lấy danh sách học sinh
$getStudentListUrl = 'https://duylong.io.vn/sendsms/getStudentList.php?date=' . $date_table;
$response = file_get_contents($getStudentListUrl);

if ($response === FALSE) {
    die('❌ Không thể lấy danh sách sinh viên.');
}

// Giải mã JSON
$students = json_decode($response, true);
if (!is_array($students)) {
    die('❌ Dữ liệu trả về không hợp lệ.');
}

// Hàm gửi tin nhắn Telegram
function sendTelegramMessage($chatId, $message, $botToken) {
    $url = "https://api.telegram.org/bot$botToken/sendMessage";

    $postData = [
        'chat_id' => $chatId,
        'text'    => $message,
    ];

    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
    $result = curl_exec($ch);

    if (curl_errno($ch)) {
        echo '❌ Lỗi CURL: ' . curl_error($ch) . "\n";
        curl_close($ch);
        return false;
    }

    curl_close($ch);

    $resultData = json_decode($result, true);
    if (isset($resultData['ok']) && $resultData['ok'] === true) {
        return true;
    } else {
        echo "❌ Lỗi gửi tin nhắn Telegram: " . ($resultData['description'] ?? 'Không rõ lỗi') . "\n";
        return false;
    }
}

// Xử lý từng học sinh
foreach ($students as $student) {
    $studentId = $student['student_id'] ?? '';
    $fullname  = $student['fullname'] ?? '';
    $className = $student['class_name'] ?? '';
    $telegramId = $student['telegram_id'] ?? '';

    if (empty($telegramId)) {
        echo "❌ Không có Telegram ID cho học sinh $fullname\n";
        continue;
    }

    // Soạn nội dung tin nhắn
    $message = "TRƯỜNG THPT ABC THÔNG BÁO\n";
    $message .= "Học sinh: $fullname\n";
    $message .= "Lớp: $className\n";
    $message .= "Mã học sinh: $studentId\n";
    $message .= "Ngày $date_display không điểm danh vào học. Ghi nhận tình trạng vắng buổi học ngày hôm nay.\n";
    $message .= "Quý phụ huynh vui lòng phản hồi với giáo viên chủ nhiệm về lý do vắng mặt của học sinh.\n";
    $message .= "Trân trọng.";

    // Gửi tin nhắn
    if (sendTelegramMessage($telegramId, $message, $botToken)) {
        // Nếu gửi thành công thì cập nhật note = 'sent' vào đúng bảng rollcall của ngày
        $updateSql = "UPDATE `$rollcall_table` 
                      SET note = 'sent' 
                      WHERE student_id = '$studentId'";

        if ($conn_rollcall->query($updateSql) === TRUE) {
            echo "✅ Đã cập nhật trạng thái 'sent' cho học sinh $fullname\n";
        } else {
            echo "❌ Lỗi cập nhật DB cho học sinh $fullname: " . $conn_rollcall->error . "\n";
        }
    } else {
        echo "❌ Không gửi được tin nhắn cho học sinh $fullname\n";
    }
}

$conn_rollcall->close(); // Đóng kết nối DB
echo "✅ Hoàn tất gửi tin nhắn và cập nhật!\n";
?>
