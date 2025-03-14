<?php include 'header.php'; ?>
<link rel="stylesheet" href="roll-call.css">
<script defer src="roll-call.js"></script>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/flatpickr/4.6.9/flatpickr.min.css">
<script src="https://cdnjs.cloudflare.com/ajax/libs/flatpickr/4.6.9/flatpickr.min.js"></script>

<div class="roll-call">
<div class="attendance-container">
        <h2>Điểm Danh Hàng Ngày</h2>
        <table class="attendance-table">
            <thead>
                <tr>
                    <th rowspan="1" colspan="2">Thứ</th>
                    <th>Thứ 2</th>
                    <th>Thứ 3</th>
                    <th>Thứ 4</th>
                    <th>Thứ 5</th>
                    <th>Thứ 6</th>
                    <th>Thứ 7</th>
                    <th>Chủ Nhật</th>
                </tr>
                <tr id="attendance-dates">
                    <th rowspan="1" colspan="2">Ngày</th>
                    <th></th><th></th><th></th><th></th><th></th><th></th><th></th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td rowspan="3" class="buoi">Buổi sáng</td>
                    <td class="status-label">Trạng thái</td>
                    <td></td><td></td><td></td><td></td><td></td><td></td><td></td>
                </tr>
                <tr>
                    <td class="status-label">Checkin</td>
                    <td></td><td></td><td></td><td></td><td></td><td></td><td></td>
                </tr>
                <tr>
                    <td class="status-label">Checkout</td>
                    <td></td><td></td><td></td><td></td><td></td><td></td><td></td>
                </tr>
                <tr>
                    <td rowspan="3" class="buoi">Buổi chiều</td>
                    <td class="status-label">Trạng thái</td>
                    <td></td><td></td><td></td><td></td><td></td><td></td><td></td>
                </tr>
                <tr>
                    <td class="status-label">Checkin</td>
                    <td></td><td></td><td></td><td></td><td></td><td></td><td></td>
                </tr>
                <tr>
                    <td class="status-label">Checkout</td>
                    <td></td><td></td><td></td><td></td><td></td><td></td><td></td>
                </tr>
            </tbody>
        </table>
    </div>
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