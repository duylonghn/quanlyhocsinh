<?php
// Include header
include __DIR__ . '/../header-admin.php';
?>
<link rel="stylesheet" href="update.css">
<script defer src="update.js"></script>

<div class="input-info">
    <div class="group">
        <label for="msv">ID người dùng:</label>
        <input id="msv">
    </div>  
    <div class="h1">THÔNG TIN TÀI KHOẢN</div>
</div>

<div class="form-container">
    <div class="left-column">
        <div class="form teacher">
            <div class="form-row teacher">
                <div class="form-group teacher">
                    <label for="fullname">Họ tên:</label>
                    <input type="text" id="fullname" disabled>
                </div>
                <div class="form-group teacher">
                    <label for="msv-info">ID:</label>
                    <input type="text" id="msv-info" disabled> 
                </div>
                <div class="form-group teacher">
                    <label for="sex">Giới tính:</label>
                    <input type="text" id="sex" disabled>
                </div>
                <div class="form-group personal">
                    <label for="address">Địa chỉ:</label>
                    <input type="text" id="address" disabled>
                </div>
                <div class="form-group parents">
                    <label for="parents">Họ tên:</label>
                    <input type="text" id="parents" disabled></input>
                </div>
            </div>
        </div>
    </div>
    <div class="middle-column">
        <div class="form teacher">
            <div class="form-row teacher">
                <div class="form-group personal">
                    <label for="phone">Số điện thoại:</label>
                    <input type="text" id="phone" disabled>
                </div>
                <div class="form-group personal">
                    <label for="email">Email:</label>
                    <input type="text" id="email" disabled>
                </div>
                <div class="form-group teacher">
                    <label for="class">Lớp:</label>
                    <input type="text" id="class" disabled>
                </div>
                <div class="form-group teacher">
                    <label for="course">Khóa:</label>
                    <input type="text" id="course" disabled>
                </div>
                <div class="form-group parents">
                    <label for="phone-parents">Số điện thoại:</label>
                    <input type="text" id="phone-parents" disabled></input>
                </div>
            </div>
        </div>
    </div>
    <div class="right-column">
        <div class="form personal">
            <div class="form-row personal">
                <div class="form-group personal">
                    <label for="CCCD">CMND/CCCD:</label>
                    <input type="text" id="CCCD" disabled>
                </div>
                <div class="form-group personal">
                    <label for="nation">Dân tộc:</label>
                    <input type="text" id="nation" disabled>
                </div>
                <div class="form-group personal">
                    <label for="religion">Tôn giáo:</label>
                    <input type="text" id="religion" disabled>
                </div>
                <div class="form-group personal">
                    <label for="birthplace">Quê quán:</label>
                    <input type="text" id="birthplace" disabled>
                </div>
                <div class="form-group parents">
                    <label for="relationship">Quan hệ:</label>
                    <input type="text" id="relationship" disabled></input>
                </div>
            </div>
        </div>
    </div>
</div>
<div class="buttons-container">
    <button class="button-info" id="change-pass" data-href="/../action/change-password/password.php">Đổi mật khẩu</button>
    <button class="button-info" id="edit-info">Chỉnh sửa thông tin</button>
    <button class="button-info" id="save-info" style="display: none;">Lưu</button>
    <button class="button-info" id="cancel-info" style="display: none;">Hủy</button>
</div>
<!-- Hộp thoại xác nhận -->
<div id="confirmation-modal" class="modal" style="display: none;">
    <div class="modal-content">
        <p>Bạn có chắc chắn muốn lưu thay đổi thông tin tài khoản không?</p>
        <button class="button-info" id="confirm-save">Có</button>
        <button class="button-info" id="cancel-save">Không</button>
    </div>
</div>
