<link rel="stylesheet" href="/admin/input-data/header-input.css">
<script defer src="/admin/input-data/header-input.js"></script>
<?php
// Include header
include __DIR__ . '/../header-input.php';
?>
<link rel="stylesheet" href="teacher.css">
<script defer src="teacher.js"></script>

<div id="teacher-info" class="input-section">
    <h1>Thông tin giáo viên</h1>
        <div class="form-container">
            <div class="left-column">
                <div class="form teacher">
                    <div class="form-row teacher">
                        <div class="form-group teacher">
                            <label for="fullname">Họ tên:</label>
                            <input type="text" id="fullname">
                        </div>
                        <div class="form-group teacher">
                            <label for="msv-info">Mã giáo viên:</label>
                            <input type="text" id="msv-info"> 
                        </div>
                        <div class="form-group teacher">
                            <label for="sex">Giới tính:</label>
                            <input type="text" id="sex">
                        </div>
                        <div class="form-group personal">
                            <label for="phone">Số điện thoại:</label>
                            <input type="text" id="phone">
                        </div>
                        <div class="form-group personal">
                            <label for="address">Địa chỉ:</label>
                            <input type="text" id="address">
                        </div>
                    </div>
                </div>
            </div>
            <div class="middle-column">
                <div class="form teacher">
                    <div class="form-row teacher">
                        <div class="form-group personal">
                            <label for="email">Email:</label>
                            <input type="text" id="email">
                        </div>
                        <div class="form-group personal">
                            <label for="CCCD">CCCD:</label>
                            <input type="text" id="CCCD">
                        </div>
                        <div class="form-group personal">
                            <label for="birthplace">Quê quán:</label>
                            <input type="text" id="birthplace">
                        </div>
                        <div class="form-group personal">
                            <label for="nation">Dân tộc:</label>
                            <input type="text" id="nation">
                        </div>
                        <div class="form-group personal">
                            <label for="religion">Tôn giáo:</label>
                            <input type="text" id="religion">
                        </div>
                    </div>
                </div>
            </div>
            <div class="right-column">
                <div class="form personal">
                    <div class="form-row personal">
                        <div class="form-group teacher">
                            <label for="class">Lớp:</label>
                            <input type="text" id="class">
                        </div>
                        <div class="form-group teacher">
                            <label for="course">Khóa:</label>
                            <input type="text" id="course">
                        </div>
                        <div class="form-group teacher">
                            <label for="school">Trường:</label>
                            <input type="text" id="school">
                        </div>
                    </div>
                </div>
                <div class="btn">
                    <div class="button-group">
                        <button class="download-btn" data-file="results_template.xlsx">Tải file mẫu</button>
                        <button class="add-info">Thêm</button>
                    </div>
                    <label class="file-upload-container">
                        <span class="file-upload-text">Chọn tệp</span>
                        <input type="file" id="upload-results">
                    </label>
                </div>
            </div>
        </div>
        <table class="info-table">
            <thead>
                <tr>
                    <th>Mã giáo viên</th>
                    <th>Họ tên</th>            
                    <th>Giới tính</th>
                    <th>Địa chỉ</th>
                    <th>Số điện thoại</th>
                    <th>Địa chỉ</th>
                    <th>Email</th>
                    <th>CCCD</th>
                    <th>Quê quán</th>
                    <th>Dân tộc</th>
                    <th>Lớp</th>
                    <th>Trường</th>
                    <th>Khóa</th>
                </tr>
            </thead>
            <tbody>
                <!-- Dữ liệu sẽ được thêm vào đây -->
            </tbody>
        </table>
        <div class="buttons-container">
            <button class="button-info" id="save-info">Lưu</button>
            <button class="button-info" id="cancel-info">Hủy</button>
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