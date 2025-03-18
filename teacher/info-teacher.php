<?php
// Include header
include __DIR__ . '/../header-teacher.php';
?>
<link rel="stylesheet" href="info.css">
<script defer src="info.js"></script>

<div class="h1">THÔNG TIN GIÁO VIÊN</div>
<div class="form-container">
    <div class="left-column">
        <div class="form teacher">
            <div class="title-info teacher">THÔNG TIN GIÁO VIÊN</div>
            <div class="form-row teacher">
                <div class="form-group teacher">
                    <label for="fullname">Họ tên:</label>
                    <span id="fullname"></span>
                </div>
                <div class="form-group teacher">
                    <label for="msv">Mã giáo viên:</label>
                    <span id="msv"></span>
                </div>
                <div class="form-group teacher">
                    <label for="sex">Giới tính:</label>
                    <span id="sex"></span>
                </div>
                <div class="form-group teacher">
                    <label for="class">Lớp:</label>
                    <span id="class"></span>
                </div>
                <div class="form-group teacher">
                    <label for="course">Khóa:</label>
                    <span id="course"></span>
                </div>
            </div>
            <div class="buttons-container">
                <button class="button-info" id="change-pass" data-href="/action/change-password/password.php">Đổi mật khẩu</button>
                <button class="button-info" id="edit-info">Chỉnh sửa thông tin</button>
                <button class="button-info" id="save-info" style="display: none;">Lưu</button>
                <button class="button-info" id="cancel-info" style="display: none;">Hủy</button>
            </div>
        </div>
    </div>
    <div class="right-column">
        <div class="form personal">
            <div class="title-info personal">THÔNG TIN CÁ NHÂN</div>
            <div class="form-row personal">
                <div class="form-group personal">
                    <label for="phone">Số điện thoại:</label>
                    <input type="text" id="phone" disabled>
                </div>
                <div class="form-group personal">
                    <label for="email">Email:</label>
                    <input type="text" id="email" disabled>
                </div>
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
                <div class="form-group personal">
                    <label for="address">Địa chỉ:</label>
                    <input type="text" id="address" disabled>
                </div>
            </div>
        </div>
    </div>
    <!-- Hộp thoại xác nhận -->
    <div id="confirmation-modal" class="modal" style="display: none;">
        <div class="modal-content">
            <p>Bạn có chắc chắn muốn lưu thay đổi thông tin tài khoản không?</p>
            <button class="button-info" id="confirm-save">Có</button>
            <button class="button-info" id="cancel-save">Không</button>
        </div>
    </div>
</div>
