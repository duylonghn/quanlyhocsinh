<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="login/reset.css">
    <link rel="stylesheet" href="login.css">
    <link rel="stylesheet" href="../style.css">
    <link rel="stylesheet" href="https://pro.fontawesome.com/releases/v5.10.0/css/all.css">
    <script src="https://code.jquery.com/jquery-3.6.0.js"></script>
    <script defer src="forgot-password.js"></script>
    <title>Hệ thống thông tin sinh viên</title>
</head>
<body>
    <div class="container">
        <table class="header">
            <tbody>
                <td><img class="logo" src="../images/header.png"></td>
                <td style="font-weight: bold;">HỆ THỐNG THÔNG TIN SINH VIÊN</td>
            </tbody>
        </table>
    </div>
    <div class="login-container">
        <div class="login-title">Quên mật khẩu</div>
        <div class="form-group">
            <label class="title">Mã sinh viên:</label>
            <div class="input-container">
                <input type="text" class="form-input" placeholder="Mã sinh viên" id="username" name="username">
            </div>
        </div>
        <div class="back">
            <a href="../login.php">Đăng nhập</a>
        </div>
        <button class="send-email">Đặt lại mật khẩu</button>
    </div>
</body>
</html>
