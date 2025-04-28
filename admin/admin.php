<?php
// Include header
include __DIR__ . '/header-admin.php';
?>
<link rel="stylesheet" href="admin.css">
<script defer src="admin.js"></script>

<h1>Cài đặt hệ thống</h1>
<div class="admin-container">
    <div class="left-col">
        <!-- Cấu hình ngày không điểm danh -->
        <div class="group diemdanh">
            <div class="content">Ngày không điểm danh</div>
            <input type="date" id="input-date">
            <button class="button" id="add-date">Thêm ngày</button>

            <div class="table-container">
                <table id="date-table">
                    <thead>
                        <tr>
                            <th>Ngày</th>
                            <th>Chọn</th>
                            <th>Xóa</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Thứ 7</td>
                            <td><input type="checkbox"></td>
                            <td>--</td>
                        </tr>
                        <tr>
                            <td>Chủ Nhật</td>
                            <td><input type="checkbox"></td>
                            <td>--</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Cấu hình giờ điểm danh -->
        <div class="group">
            <div class="content">Giờ điểm danh</div>
            <input type="time" id="time-rollcall" value="07:30">
        </div>

        <!-- Cấu hình gửi tin nhắn -->
        <div class="group sms">
            <div class="content">Giờ gửi tin nhắn</div>
            <input type="time" id="time-sms" value="18:00">
        </div>
        <button class="button save-settings" id="save-settings">Lưu cài đặt điểm danh</button>
    </div>

    <div class="right-col">
        <div class="group">
            <div class="content">Học kỳ</div>
            <div class="table-container">
                <button class="button add-semesters" id="add-semesters">Thêm</button>
                <table class="table-content semester" id="semesters-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Học kỳ</th>
                            <th>Xóa</th>
                        </tr>
                    </thead>
                    <tbody>

                    </tbody>
                </table>
            </div>
        </div>
        <div class="group">
            <div class="content">Mẫu SMS</div>
            <div class="table-container">
                <button class="button add-sms" id="add-sms">Thêm</button>
                <table class="table-content add-sms" id="sms-table">
                    <thead>
                        <tr>
                            <th>Mẫu SMS</th>
                            <th>Nội dung</th>
                            <th>Xóa</th>
                        </tr>
                    </thead>
                    <tbody>

                    </tbody>
                </table>
            </div>
        </div>
        <div class="group">
            <div class="content">Gửi SMS</div>
            <div class="table-container">
                <table class="table-content send-sms" id="sms-table">
                    <thead>
                        <tr>
                            <th>ID SV</th>
                            <th>Mẫu tin nhắn</th>
                            <th>Xóa</th>
                        </tr>
                    </thead>
                    <tbody>

                    </tbody>
                </table>
                <button class="button send-sms" id="send-sms">Gửi</button>
            </div>
        </div>
    </div>
</div>
