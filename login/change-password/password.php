<?php
// Include header
include 'header.php';
?>
<link rel="stylesheet" href="changepass.css">
<script defer src="changepass.js"></script>

<div id="wrapper">
    <form action="" id="change-pass">
        <div class="form-heading">Đổi mật khẩu</div>
        <div class="form-group">
            <div class="content">Mật khẩu cũ</div>
            <input type="password" class="form-input" placeholder="Mật khẩu cũ" id="oldPassword">
            <div class="eye">
                <i class="far fa-eye"></i>
            </div>
        </div>
        <div class="form-group">
            <div class="content">Mật khẩu mới</div>
            <input type="password" class="form-input" placeholder="Mật khẩu mới" id="newPassword">
            <div class="eye">
                <i class="far fa-eye"></i>
            </div>
        </div>
        <div class="form-group">
            <div class="content">Xác nhận mật khẩu</div>
            <input type="password" class="form-input" placeholder="Xác nhận mật khẩu" id="confirmPassword">
            <div class="eye">
                <i class="far fa-eye"></i>
            </div>
        </div>
        <div class="form-row">
            <button class="savePass">Lưu</button>
            <button class="cancelPass">Hủy</button>
        </div>
    </form>
</div>
