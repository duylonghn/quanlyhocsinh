<link rel="stylesheet" href="/admin/input-data/header-input.css">
<script defer src="/admin/input-data/header-input.js"></script>
<?php
// Include header
include __DIR__ . '/../header-input.php';
?>
<link rel="stylesheet" href="schedule.css">
<script defer src="schedule.js"></script>

<div id="schedule" class="input-section">
        <div class="lichhoc-container">
            <div class="week">
                <div class="input-info-class">
                    <div class="group">
                        <label for="semester">Học kỳ:</label>
                        <input class="input-data" type="text" id="semester">
                    </div>
                    <div class="group">
                        <label for="school">Trường:</label>
                        <input class="input-data" type="text" id="school">
                    </div>
                    <div class="group">
                        <label for="class">Lớp:</label>
                        <input class="input-data" type="text" id="class">
                    </div>
                    <div class="group">
                        <label for="class_id">ID lớp:</label>
                        <input class="input-data" type="text" id="class_id">
                    </div>
                </div>
                <div class="h1 week">Thời khóa biểu</div>
                <div class="calendar-week">
                    <div class="lich-hoc">
                        <div class="calendar-week-table">
                            <div class="date-header" id="date-header"></div>
                            <div class="buoi">Buổi sáng</div>
                            <div class="lich sang" id="sang"></div>
                            <div class="buoi">Buổi chiều</div>
                            <div class="lich chieu" id="chieu"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="btn">
            <button class="download-btn" data-file="results_template.xlsx">Tải file mẫu</button>
            
            <label class="file-upload-container">
                <span class="file-upload-text">Chọn tệp</span>
                <input type="file" id="upload-results">
            </label>
        </div>
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