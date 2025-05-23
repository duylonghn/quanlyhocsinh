<?php
// Include header
include __DIR__ . '/../../header.php';
?>
<link rel="stylesheet" href="timetable.css">
<script defer src="timetable.js"></script>

<div class="thoikhoabieu-container">
    <div class="week">
        <div class="h1 week">Thời khóa biểu</div>
        <div class="group">
                <label for="semester">Học kỳ:</label>
                <select id="semester">Chọn học kỳ
                    <option value="">Chọn học kỳ</option>
                </select>
            </div>
        <div class="calendar-week">
            <div class="lich-hoc">
                <div class="calendar-week-table">
                    <div class="date-header" id="date-header">
                        
                    </div>
                    <div class="buoi">Buổi sáng</div>
                    <div class="lich sang" id="sang"></div>
                    <div class="buoi">Buổi chiều</div>
                    <div class="lich chieu" id="chieu"></div>
                </div>
            </div>
        </div>
    </div>
</div>