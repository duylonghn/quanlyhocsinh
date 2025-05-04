<?php
// Include header
include __DIR__ . '/../../../header-teacher.php';
?>
<link rel="stylesheet" href="evaluation.css">
<script defer src="evaluation.js"></script>

<div class="container-tichluy">
    <div class="diem-chi-tiet">
        <div class="h1-diem trungbinh">Nhập thông tin Hạnh kiểm, Học lực, Xếp loại</div>
            <div class="table trungbinh">
                <table class="table-content trungbinh">
                    <thead>
                        <tr style="font-weight:bold">
                            <th>MHS</th>
                            <th>Họ tên</th>
                            <th>Học lực</th>
                            <th>Hạnh kiểm</th>
                            <th>Xếp loại</th>

                        </tr>
                    </thead>
                    <tbody id="tbTableBody">
                        <!-- Dữ liệu sẽ được thêm động ở đây -->
                    </tbody>
                </table>
            </div>
            <div class="btn">
                <div class="button-group">
                    <button class="send-evaluation">Lưu</button>
                    <button class="cancel">Xóa</button>
                </div>
            </div>
        </div>
    </div>
</div>