<?php
// Include header
include 'header.php';
?>
<link rel="stylesheet" href="info.css">
<script defer src="info.js"></script>

<div class="h1">THÔNG TIN HỌC SINH</div>
<div class="form-container">
    <div class="left-column">
        <div class="form student">
            <div class="title-info student">THÔNG TIN HỌC SINH</div>
            <div class="form-row student">
                <div class="form-group student">
                    <label for="fullname">Họ tên:</label>
                    <span id="fullname"></span>
                </div>
                <div class="form-group student">
                    <label for="birthday">Ngày sinh:</label>
                    <span id="birthday"></span>
                </div>
                <div class="form-group student">
                    <label for="id">Mã học sinh:</label>
                    <span id="id"></span>
                </div>
                <div class="form-group student">
                    <label for="sex">Giới tính:</label>
                    <span id="sex"></span>
                </div>
                <div class="form-group student">
                    <label for="class">Lớp:</label>
                    <span id="class"></span>
                </div>
                <div class="form-group student">
                    <label for="course">Khóa:</label>
                    <span id="course"></span>
                </div>
            </div>
        </div>
        <div class="form parents">
            <div class="title-info parents">THÔNG TIN NGƯỜI LIÊN HỆ</div>
            <div class="form-row parents">
                <div class="form-group parents">
                    <label for="parents">Họ tên:</label>
                    <span id="parents"></span>
                </div>
                <div class="form-group parents">
                    <label for="phone-parents">Số điện thoại:</label>
                    <span id="phone-parents"></span>
                </div>
                <div class="form-group parents">
                    <label for="relationship">Quan hệ:</label>
                    <span id="relationship"></span>
                </div>
            </div>
        </div>
    </div>
    <div class="right-column">
        <div class="form personal">
            <div class="title-info personal">THÔNG TIN CÁ NHÂN</div>
            <div class="form-row personal">
                <div class="form-group personal">
                    <label for="phone">Số điện thoại:</label>
                    <span id="phone"></span>
                </div>
                <div class="form-group personal">
                    <label for="email">Email:</label>
                    <span id="email"></span>
                </div>
                <div class="form-group personal">
                    <label for="CCCD">CMND/CCCD:</label>
                    <span id="CCCD"></span>
                </div>
                <div class="form-group personal">
                    <label for="nation">Dân tộc:</label>
                    <span id="nation"></span>
                </div>
                <div class="form-group personal">
                    <label for="religion">Tôn giáo:</label>
                    <span id="religion"></span>
                </div>
                <div class="form-group personal">
                    <label for="birthplace">Quê quán:</label>
                    <span id="birthplace"></span>
                </div>
                <div class="form-group personal">
                    <label for="address">Địa chỉ:</label>
                    <span id="address"></span>
                </div>
            </div>
        </div>
        <div class="form course">
            <div class="title-info course">THÔNG TIN GIÁO VIÊN</div>
                <div class="form-group course">
                    <label for="teacher">GVCN:</label>
                    <span id="teacher"></span>
                </div>
                <div class="form-group course">
                    <label for="phone-teacher">Số điện thoại:</label>
                    <span id="phone-teacher"></span>
                </div>
                <div class="form-group course">
                    <label for="email-teacher">Email:</label>
                    <span id="email-teacher"></span>
                </div>
            </div>
        </div>
    </div>
    <div class="buttons-container">
        <button class="button-info" id="change-pass" data-href="/action/change-password/password.php">Đổi mật khẩu</button>
    </div>
</div>
