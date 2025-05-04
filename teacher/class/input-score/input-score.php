<?php
// Include header
include __DIR__ . '/../../../header-teacher.php';
?>
<link rel="stylesheet" href="input-score.css">
<script defer src="input-score.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.17.1/xlsx.full.min.js"></script>

<div class="container-tichluy">
    <div class="diem-chi-tiet">
        <div class="h1-diem trungbinh">Nhập điểm học sinh</div>
            <div class="table trungbinh">
                <table class="table-content trungbinh">
                    <thead>
                        <tr style="font-weight:bold">
                            <th>MHS</th>
                            <th>Tên</th>
                            <th>Môn</th>
                            <th>M1</th>
                            <th>M2</th>
                            <th>M3</th>
                            <th>P1</th>
                            <th>P2</th>
                            <th>T1</th>
                            <th>T2</th>
                            <th>CK</th>
                            <th>TK</th>
                            <th>HK</th>
                            <th>HL</th>
                            <th>XL</th>
                        </tr>
                    </thead>
                    <tbody id="tbTableBody">
                        <!-- Dữ liệu sẽ được thêm động ở đây -->
                    </tbody>
                </table>
            </div>
            <div class="btn">
                <div class="button-group">
                    <button class="download-btn" data-file="ket_qua_kiem_tra.xlsx">Tải file mẫu</button>
                    <button class="send-score">Lưu</button>
                    <button class="cancel">Xóa</button>
                </div>
                <label class="file-upload-container">
                    <span class="file-upload-text">Chọn tệp</span>
                    <input type="file" id="upload-results">
                </label>
            </div>
        </div>
    </div>
</div>