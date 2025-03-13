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
    <?php
    // Lấy URL hiện tại
    $current_page = basename($_SERVER['PHP_SELF']);
    ?>
    <div class="container">
        <div class="header">
            <img class="logo" src="/images/header.png">
        </div>
        <div class="menu">
            <button class="tab <?php if($current_page == 'roll-call.php') echo 'a'; ?>" data-href="/student/roll-call/roll-call.php">
                <div class="title">Điểm danh</div>
            </button>
            <button class="tab <?php if($current_page == 'timetable.php') echo 'a'; ?>" data-href="/student/learning/timetable.php">
                <div class="title">Lịch học</div>
            </button>
            <button class="tab <?php if($current_page == 'score.php') echo 'a'; ?>" data-href="/student/score/score.php">
                <div class="title">Điểm thi</div>
            </button>
            <div class="tab with-drop <?php if($current_page == 'info.php' || $current_page == 'change-password.php') echo 'a'; ?>">
                <div class="title">Tài khoản</div>
                <div class="backdrop">
                    <div class="dropdown">
                        <div data-href="/student/info.php" class="tab-child">Thông tin cá nhân</div>
                        <div id="logout" class="tab-child">Đăng xuất</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
