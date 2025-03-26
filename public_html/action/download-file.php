<?php
// Kiểm tra tham số file
if (!isset($_GET['file']) || empty($_GET['file'])) {
    die("Lỗi: Không có file nào được chỉ định.");
}

$fileName = basename($_GET['file']); // Lấy tên file từ URL, tránh truy cập thư mục khác
$filePath = $_SERVER["DOCUMENT_ROOT"] . "/../private_html/templates/" . $fileName;

// Kiểm tra file có tồn tại không
if (!file_exists($filePath)) {
    die("Lỗi: File không tồn tại. Đường dẫn: " . $filePath);
}

// Thiết lập header để tải file
header("Content-Description: File Transfer");
header("Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
header("Content-Disposition: attachment; filename=\"$fileName\"");
header("Expires: 0");
header("Cache-Control: must-revalidate");
header("Pragma: public");
header("Content-Length: " . filesize($filePath));

readfile($filePath); // Gửi file xuống trình duyệt
exit;
?>
