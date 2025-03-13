<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="login.css">
    <link rel="stylesheet" href="../style.css">
    <link rel="stylesheet" href="https://pro.fontawesome.com/releases/v5.10.0/css/all.css">
    <script src="https://code.jquery.com/jquery-3.6.0.js"></script>
    <script defer src="login.js"></script>
    <title>Hệ thống thông tin học sinh</title>
</head>
<body>
    <div class="container">
        <table class="header">
            <tbody>
                <td><img class="logo" src="/images/header.png"></td>
                <td style="font-weight: bold;">HỆ THỐNG THÔNG TIN HỌC SINH</td>
            </tbody>
        </table>
    </div>
    <div class="login-container">
        <div class="login-title">Đăng nhập</div>
        <form action="act-login.php" method="POST">
        <div class="form-group">
            <label class="title">ID người dùng:</label>
            <div class="input-container">
                <input type="text" class="form-input" placeholder="Mã học sinh/ giáo viên" id="id" name="id" required>
            </div>
        </div>
        <div class="form-group">
            <label class="title">Mật khẩu:</label>
            <div class="input-container">
                <input type="password" class="form-input" placeholder="Mật khẩu" id="password" name="password" required>
                <div id="eye">
                    <i class="far fa-eye"></i>
                </div>
            </div>
        </div>
        <?php if (isset($_GET['error'])): ?>
            <div id="error-message" style="color: red;">Tên đăng nhập hoặc mật khẩu không đúng!</div>
        <?php endif; ?>
        <div class="forgot-password">
            <a href="/forgot-password.php">Quên mật khẩu</a>
        </div>
        <button type="submit" class="login-button">Đăng nhập</button>
    </form>
</body>
</html>
