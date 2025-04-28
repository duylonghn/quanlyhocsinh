<?php
// Include header
include __DIR__ . '/../../header-teacher.php';
?>
<link rel="stylesheet" href="roll-call.css">
<script defer src="roll-call.js"></script>

<h1>Điểm danh học sinh</h1>

<div class="main-container">
    <div class="left-container">
        <div class="container-gv diemdanh">
            <h2>Điểm danh của lớp</h2>
            <table>
                <thead>
                    <th>Mã lớp</th>
                    <th>Tên lớp</th>
                    <th>Sỹ số</th>
                    <th>Điểm danh</th>
                </thead>
                <tr>
                    <td><?= $homeroom_class['class_id'] ?? '-' ?></td>
                    <td><?= $homeroom_class['class_name'] ?? '-' ?></td>
                    <td><?= $homeroom_class['student_count'] ?? '0' ?></td>
                    <td><?= $homeroom_class['attended_count'] ?? '0' ?> / <?= $homeroom_class['student_count'] ?? '0' ?></td>
                </tr>
            </table>
        </div>

        <div class="container-gv chuadiemdanh">
            <h2>Danh sách học sinh vắng, muộn</h2>
            <table>
                <thead>
                    <th>Mã học sinh</th>
                    <th>Họ tên</th>
                    <th>Lớp</th>
                    <th>Tình trạng</th>
                    <th>Ghi chú</th>
                </thead>
                <tbody>
                <?php if (!empty($absent_students)): ?>
                    <?php foreach ($absent_students as $student): ?>
                        <tr>
                            <td><?= $student['student_id'] ?? '-' ?></td>
                            <td><?= $student['fullname'] ?? '-' ?></td>
                            <td><?= $student['class_name'] ?? '-' ?></td>
                            <td>Vắng</td>
                            <td><?= $student['notification_status'] ?? 'Chưa gửi' ?></td>
                        </tr>
                    <?php endforeach; ?>
                <?php else: ?>
                    <tr>
                        <td colspan="5">✅ Tất cả sinh viên đã điểm danh</td>
                    </tr>
                <?php endif; ?>
                </tbody>
            </table>
        </div>
    </div>

    <!-- Lịch bên phải -->
    <div class="calendar-container">
        <div class="choose-day">
            <div id="month-title"></div>
            <button onclick="prevMonth()">◀</button>
            <button onclick="nextMonth()">▶</button>
        </div>
        <table class="month-calendar">
            <thead>
                <tr>
                    <th>T2</th>
                    <th>T3</th>
                    <th>T4</th>
                    <th>T5</th>
                    <th>T6</th>
                    <th>T7</th>
                    <th>CN</th>
                </tr>
            </thead>
            <tbody id="month-body">
                <!-- Dữ liệu ngày sẽ được tạo bằng JavaScript -->
            </tbody>
        </table>
    </div>
</div>
