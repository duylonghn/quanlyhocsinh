<?php
session_start();
session_destroy(); // Hủy toàn bộ session
echo json_encode(["status" => "success"]);
exit();
?>
