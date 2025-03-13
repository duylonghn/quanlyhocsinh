<?php
// Include header
include 'header.php';
?>
<link rel="stylesheet" href="score.css">
<script defer src="score.js"></script>

<div class="container-tichluy">
    <div class="info-sv">
        <div class="row one">
            <div class="group">
                <label for="fullname">Họ tên:</label>
                <span id="fullname"></span>
            </div>
            <div class="group">
                <label for="msv">Mã học sinh:</label>
                <span id="msv"></span>
            </div>

            <div class="group">
                <label for="course">Khóa:</label>
                <span id="course"></span>
            </div>
        </div>
        <div class="row two">
            <div class="group">
                <label for="class">Lớp:</label>
                <span id="class"></span>
            </div>
            <div class="group">
                <label for="school">Trường:</label>
                <span id="school"></span>
            </div>
            <div class="group">
                <label for="semester">Học kỳ:</label>
                <select id="semester">
                    <?php
                    // Kiểm tra nếu có kết quả từ database
                    if ($result->num_rows > 0) {
                        // Hiển thị mỗi hàng trong kết quả dưới dạng một thẻ option
                        while($row = $result->fetch_assoc()) {
                            echo "<option value='" . $row['semester_id'] . "'>" . $row['semester_name'] . "</option>";
                        }
                    } else {
                        echo "<option value=''>Không có học kỳ</option>";
                    }
                    ?>
                </select>
            </div>
        </div>
        
    </div>
    <div class="diem-tong">
        <div class="h1-diem tong" style="font-size: 18px;">Điểm trung bình học tập theo Học kỳ, Năm học</div>
        <div class="table diemtong">
            <table class="table-content diemtong">
                <thead>
                    <tr style="font-weight:bold">
                        <th>Năm học</th>
                        <th>Học kỳ</th>
                        <th>Điểm trung bình</th>
                        <th>Học lực</th>
                        <th>Hạnh kiểm</th>
                        <th>Xếp loại</th>
                    </tr>
                </thead>
                <tbody id="diemtongTableBody">
                    <!-- Dữ liệu sẽ được thêm động ở đây -->
                </tbody>
            </table>
        </div> 
    </div>
    <div class="diem-chi-tiet">
    <div class="h1-diem trungbinh" style="font-size: 18px;">Điểm trung bình từng môn</div>
        <div class="table trungbinh">
            <table class="table-content trungbinh">
                <thead>
                    <tr style="font-weight:bold">
                        <th>STT</th>
                        <th>Tên môn học</th>
                        <th>Điểm miệng 1</th>
                        <th>Điểm miệng 2</th>
                        <th>Điểm miệng 3</th>
                        <th>Điểm 15 phút 1</th>
                        <th>Điểm 15 phút 2</th>
                        <th>Điểm 1 tiết 1</th>
                        <th>Điểm 1 tiết 2</th>
                        <th>Điểm cuối kì</th></th>
                        <th>Điểm tổng kết</th>
                    </tr>
                </thead>
                <tbody id="tbTableBody">
                    <!-- Dữ liệu sẽ được thêm động ở đây -->
                </tbody>
            </table>
        </div>
    </div>
</div>