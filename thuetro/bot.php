<?php
require 'vendor/autoload.php';
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();
$token = getenv('TELEGRAM_BOT_TOKEN2');

// ID user cần forward tin nhắn
$forward_user_id = "7957387866";

// URL Google Apps Script để ghi dữ liệu
$sheet_url = "https://script.google.com/macros/s/AKfycbwdO5Q7Ik8wdRr0WQYirKQbTFYIIhpsHI51S4CS7w4ijSDVXgVMhWV2rSScRYQkiENLhA/exec";

// Nhận dữ liệu từ webhook
$content = file_get_contents("php://input");
$update = json_decode($content, true);

// Kiểm tra có message hay không
if (isset($update["message"])) {
    $message = $update["message"];
    $chat_id = $message["chat"]["id"];
    $message_id = $message["message_id"];
    $text = isset($message["text"]) ? $message["text"] : "";
    $is_reply = isset($message["reply_to_message"]);

    // Nếu là reply, lấy ID từ tin nhắn gốc để cập nhật "Hết phòng"
    if ($is_reply) {
        $original_message = $message["reply_to_message"];
        
        // Lấy ID từ tin nhắn gốc (reply_to_message)
        if (preg_match('/ID[:： ]+(\S+)/i', $original_message["text"], $matches)) {
            $id = trim($matches[1]);

            // Gửi yêu cầu cập nhật "Hết phòng" vào Google Sheet
            $postData = http_build_query([
                'action' => 'update_status',
                'id' => $id
            ]);
            $response = sendRequest($sheet_url, $postData); // Gửi yêu cầu với cURL

            // Kiểm tra phản hồi từ Google Sheets
            if ($response) {
                sendMessage($chat_id, "✅ Đã cập nhật Google Sheet.");
            } else {
                sendMessage($chat_id, "❌ Không thể cập nhật Google Sheet.");
            }
        }
        exit;
    }

    // Nếu tin nhắn không phải reply và là ảnh (hoặc tin nhắn không có ID)
    if (isset($message['photo'])) {
        // Nếu là ảnh, forward tin nhắn tới user đích
        forwardPhoto($forward_user_id, $chat_id, $message_id);
    }

    // Nếu có nội dung ID, tiến hành parse và gửi dữ liệu
    if (preg_match('/ID[:： ]+(\S+)/i', $text, $matches)) {
        $id = trim($matches[1]);
        $hoa_hong = getValue($text, '/Hoa hồng[:： ]+(.+)/i');
        $dia_chi = getValue($text, '/🏢.*?: (.+)/i');
        $tinh_trang = getValue($text, '/⌛️.*?: (.+)/i');
        $gia = getValue($text, '/☘Giá[:： ]+(.+)/i');
        $dang_phong = getValue($text, '/☘Dạng phòng[:： ]+(.+)/i');
        $thang = getValue($text, '/Thang[:： ]+(.+)/i');
        $noi_that = getValue($text, '/🏆Nội thất[:： ]+(.+)/i');
        $dich_vu = getValue($text, '/🏆Dịch vụ[:： ]+(.+)/is');
        $luu_y = getValue($text, '/⭐Lưu ý[:： ]+(.+)/is');

        // Thay thế viết tắt trong nội thất
        $noi_that = str_ireplace(["Dh", "Nl", "vskk"], ["Điều hòa", "Nóng lạnh", "Vệ sinh khép kín"], $noi_that);

        // Gửi dữ liệu lên Google Sheets
        $postData = http_build_query([
            'id' => $id,
            'hoa_hong' => $hoa_hong,
            'dia_chi' => $dia_chi,
            'tinh_trang' => $tinh_trang,
            'gia' => $gia,
            'dang_phong' => $dang_phong,
            'thang' => $thang, // Điền giá trị thang từ tin nhắn
            'noi_that' => $noi_that,
            'dich_vu' => $dich_vu,
            'luu_y' => $luu_y
        ]);
        $response = sendRequest($sheet_url, $postData); // Gửi yêu cầu với cURL

        // Kiểm tra phản hồi từ Google Sheets
        if ($response) {
            sendMessage($chat_id, "✅ Đã gửi tin nhắn và cập nhật Google Sheet.");
        } else {
            sendMessage($chat_id, "❌ Không thể cập nhật Google Sheet.");
        }

        // Gửi tin nhắn tới user đích
        forwardMessage($forward_user_id, $chat_id, $message_id);
    } else {
        // Nếu chỉ là tin nhắn văn bản mà không có ID, vẫn forward
        forwardMessage($forward_user_id, $chat_id, $message_id);
    }
}

// Hàm gửi tin nhắn
function sendMessage($chat_id, $text) {
    global $token;
    $url = "https://api.telegram.org/bot$token/sendMessage";
    $post_fields = [
        'chat_id' => $chat_id,
        'text' => $text
    ];
    file_get_contents($url . "?" . http_build_query($post_fields));
}

// Hàm forward tin nhắn
function forwardMessage($to_chat_id, $from_chat_id, $message_id) {
    global $token;
    $url = "https://api.telegram.org/bot$token/forwardMessage";
    $post_fields = [
        'chat_id' => $to_chat_id,
        'from_chat_id' => $from_chat_id,
        'message_id' => $message_id
    ];
    file_get_contents($url . "?" . http_build_query($post_fields));
}

// Hàm forward ảnh
function forwardPhoto($to_chat_id, $from_chat_id, $message_id) {
    global $token;
    $url = "https://api.telegram.org/bot$token/forwardMessage";
    $post_fields = [
        'chat_id' => $to_chat_id,
        'from_chat_id' => $from_chat_id,
        'message_id' => $message_id
    ];
    file_get_contents($url . "?" . http_build_query($post_fields));
}

// Hàm gửi yêu cầu HTTP sử dụng cURL
function sendRequest($url, $data) {
    $ch = curl_init();

    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data);

    $response = curl_exec($ch);
    
    if(curl_errno($ch)) {
        // Nếu có lỗi cURL
        echo 'Error:' . curl_error($ch);
        curl_close($ch);
        return false;
    }

    curl_close($ch);
    return $response;
}

// Hàm lấy dữ liệu từ tin nhắn
function getValue($text, $pattern) {
    if (preg_match($pattern, $text, $matches)) {
        return trim($matches[1]);
    }
    return '';
}
?>
