<?php
// Include header
include __DIR__ . '/../header-admin.php';
// Lấy tên file hiện tại
$current_page = basename($_SERVER['PHP_SELF']);
// Nếu đang ở header-input.php, tự động điều hướng đến teacher.php
if (basename($_SERVER['PHP_SELF']) == 'header-input.php') {
    header("Location: /admin/input-data/teacher-info/teacher.php");
    exit();
}
?>

<div class="container-inputdata">
    <div class="header-input">
        <div class="menuinput <?php if ($current_page == 'teacher.php') echo 'b'; ?>" 
            data-href="/admin/input-data/teacher-info/teacher.php">Thông tin giáo viên</div>

        <div class="menuinput <?php if ($current_page == 'student.php') echo 'b'; ?>" 
            data-href="/admin/input-data/student-info/student.php">Thông tin học sinh</div>

        <div class="menuinput <?php if ($current_page == 'schedule.php') echo 'b'; ?>" 
            data-href="/admin/input-data/schedule/schedule.php">Thời khóa biểu</div>

        <div class="menuinput <?php if ($current_page == 'score.php') echo 'b'; ?>" 
            data-href="/admin/input-data/score/score.php">Kết quả</div>
    </div>
</div>
