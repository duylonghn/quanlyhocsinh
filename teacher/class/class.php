<?php
// Include header
include __DIR__ . 'header-teacher.php';
?>
<link rel="stylesheet" href="class.css">
<script defer src="class.js"></script>


<h1>Danh sách lớp học</h1>

<!-- Lớp chủ nhiệm -->
<div class="container-gv chunhiem">
    <h2>Lớp chủ nhiệm</h2>
    <table>
        <thead>
            <th>Mã lớp</th>
            <th>Tên lớp</th>
            <th>Sỹ số</th>
            <th>Danh sách lớp</th>
            <th>Nhập điểm</th>
        </thead>
        <tr>
            <td><?= $homeroom_class['class_id'] ?? '-' ?></td>
            <td><?= $homeroom_class['class_name'] ?? '-' ?></td>
            <td><?= $homeroom_class['student_count'] ?? '-' ?></td>
            <td>
                <?php if ($homeroom_class): ?>
                    <a href="/teacher/students-list/students-list.php?class_id=<?= $homeroom_class['id'] ?>">Xem chi tiết</a>
                <?php else: ?>
                    -
                <?php endif; ?>
            </td>
            <td>
                <?php if ($homeroom_class): ?>
                    <a href="/teacher/input-score/input-score.php?class_id=<?= $homeroom_class['id'] ?>">Nhập điểm</a>
                <?php else: ?>
                    -
                <?php endif; ?>
            </td>
        </tr>
    </table>
</div>
<!-- Lớp bộ môn -->
<div class="container-gv bomon">
    <h2>Lớp bộ môn</h2>
    <table>
        <thead>
            <th>Mã lớp</th>
            <th>Tên lớp</th>
            <th>Sỹ số</th>
            <th>Môn phụ trách</th>
            <th>Danh sách lớp</th>
            <th>Nhập điểm</th>
        </thead>
        <?php if (!empty($subject_classes)): ?>
            <?php foreach ($subject_classes as $class): ?>
                <tr>
                    <td><?= $class['class_id'] ?? '-' ?></td>
                    <td><?= $class['class_name'] ?? '-' ?></td>
                    <td><?= $class['student_count'] ?? '-' ?></td>
                    <td><?= $class['subject_name'] ?? '-' ?></td>
                    <td><a href="/teacher/input-score/student-list.php?class_id=<?= $class['id'] ?>">Xem chi tiết</a></td>
                    <td><a href="/teacher/input-score/input-score.php?class_id=<?= $class['id'] ?>">Nhập điểm</a></td>
                </tr>
            <?php endforeach; ?>
        <?php else: ?>
            <tr>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
            </tr>
        <?php endif; ?>
    </table>
</div>