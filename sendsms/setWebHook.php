<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

$botToken = '7553473826:AAH5zLgjuBQpVVq1dbUlgOK8aF-9v2y5FUg';  // Token bot của bạn
$webhookUrl = 'https://duylong.io.vn/sendsms/get_id_tele.php';  // URL webhook của bạn

// Gọi API Telegram để cài đặt webhook
$response = file_get_contents("https://api.telegram.org/bot$botToken/setWebhook?url=$webhookUrl");

// In ra kết quả trả về để kiểm tra chi tiết lỗi
echo "<pre>";
print_r(json_decode($response, true));  // Đưa kết quả về dạng dễ đọc
echo "</pre>";
?>
