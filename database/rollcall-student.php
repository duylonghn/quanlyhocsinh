<?php
header('Content-Type: application/json');
include(__DIR__ . '/../config/config-rollcall.php'); // Khai báo $conn_rollcall

$studentId = $_GET['student_id'] ?? null;
$startDate = $_GET['start_date'] ?? null;

if (!$studentId || !$startDate) {
    echo json_encode(['error' => 'Thiếu student_id hoặc start_date']);
    exit;
}

$start = new DateTime($startDate);
$data = [];

for ($i = 0; $i < 7; $i++) {
    $day = clone $start;
    $day->modify("+$i day");
    $table = 'rollcall_' . $day->format('d_m_y');
    $dateKey = $day->format('Y-m-d');

    // Kiểm tra bảng tồn tại trong DB hwdkopen_diemdanh
    $checkQuery = $conn_rollcall->prepare("
        SELECT 1 
        FROM information_schema.tables 
        WHERE table_schema = 'hwdkopen_diemdanh' 
        AND table_name = ?
    ");
    $checkQuery->bind_param("s", $table);
    $checkQuery->execute();
    $checkResult = $checkQuery->get_result();

    if ($checkResult->num_rows > 0) {
        // Bảng tồn tại → truy vấn dữ liệu
        $sql = "SELECT time, status FROM `hwdkopen_diemdanh`.`$table` WHERE student_id = ?";
        $stmt = $conn_rollcall->prepare($sql);
        $stmt->bind_param("s", $studentId);
        $stmt->execute();
        $result = $stmt->get_result();

        $entries = [];
        while ($row = $result->fetch_assoc()) {
            $entries[] = $row;
        }
        $data[$dateKey] = $entries;
    } else {
        $data[$dateKey] = []; // Bảng không tồn tại
    }
}

echo json_encode($data);
?>
