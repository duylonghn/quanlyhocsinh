<?php
// Include header
include __DIR__ . '/../../header-teacher.php';
?>
<link rel="stylesheet" href="lichday.css">
<script defer src="lichday.js"></script>

<div class="lichday-container">
    <div class="week">
        <div class="h1 week">Lịch dạy</div>
        <div class="group">
                <label for="semester">Học kỳ:</label>
                <select id="semester">Chọn học kỳ
                    <option value="">Chọn học kỳ</option>
                </select>
            </div>
        <div class="calendar-week">
            <div class="lich-day">
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