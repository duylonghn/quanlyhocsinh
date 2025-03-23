<?php
// Include header
include __DIR__ . '/../header-admin.php';
?>
<link rel="stylesheet" href="viewlog.css">
<script defer src="viewlog.js"></script>

<div class="container-viewlog">
    <div class="input-info">
        <div class="group">
            <label for="msv">ID người dùng:</label>
            <input id="msv"></input>
        </div>  
    </div>
    <div class="log">
        <div class="h1-log">LỊCH SỬ CHỈNH SỬA</div></div>
        <div class="table">
            <table class="table-content">
                <thead>
                    <tr style="font-weight:bold">
                        <th>Tài khoản</th>
                        <th>Họ tên</th>
                        <th>Tài khoản sửa</th>
                        <th>Người sửa</th>
                        <th>Ngày</th>
                        <th>Thời gian</th>
                        <th>Nội dung</th>
                    </tr>
                </thead>
                <tbody id="logTableBody">
                    <!-- Dữ liệu sẽ được thêm động ở đây -->
                </tbody>
            </table>
        </div> 
    </div>
</div>