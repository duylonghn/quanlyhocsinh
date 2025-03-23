<?php
session_start(); // Đảm bảo session được khởi động
// Kiểm tra trạng thái đăng nhập
/*if (!isset($_SESSION['user_id'])) {
    header("Location: /login/login.php");
    exit(); // Đảm bảo dừng script sau khi điều hướng
}*/
$user_id = $_SESSION['user_id'];
// Lấy URL hiện tại
$current_page = basename($_SERVER['PHP_SELF']);
 // Lấy toàn bộ đường dẫn
$current_dir = $_SERVER['REQUEST_URI'];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="/style.css">
    <link rel="stylesheet" href="https://pro.fontawesome.com/releases/v5.10.0/css/all.css">
    <script src="https://code.jquery.com/jquery-3.6.0.js"></script>
    <script defer src="/app.js"></script>
    <title>Hệ thống thông tin sinh viên</title>
</head>
<body>
<div class="container">
    <div class="header">
        <img class="logo" src="/images/header.png">
    </div>
    <div class="menu">
        <button class="tab <?php if(strpos($current_dir, '/admin/input-data/') !== false) echo 'a'; ?>" 
            data-href="/admin/input-data/header-input.php<?php echo $user_id ? '?id=' . $user_id : ''; ?>">
            <div class="title">Nhập thông tin</div>
        </button>

        <button class="tab <?php if($current_page == 'update.php') echo 'a'; ?>" 
            data-href="/admin/update/update.php<?php echo $user_id ? '?id=' . $user_id : ''; ?>">
            <div class="title">Cập nhật</div>
        </button>

        <button class="tab <?php if($current_page == 'viewlog.php') echo 'a'; ?>" 
            data-href="/admin/viewlog/viewlog.php<?php echo $user_id ? '?id=' . $user_id : ''; ?>">
            <div class="title">Lịch sử</div>
        </button>

        <button class="tab <?php if($current_page == 'admin.php') echo 'a'; ?>" 
            data-href="/admin/admin.php<?php echo $user_id ? '?id=' . $user_id : ''; ?>">
            <div class="title">Quản trị</div>
        </button>

        <button id="logout" class="tab">
            <div class="title">Đăng xuất</div>
        </button>
    </div>
</div>
