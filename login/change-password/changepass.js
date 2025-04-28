$(document).ready(function () {
    // 👁 Toggle hiển thị mật khẩu
    $(".eye").click(function () {
        $(this).toggleClass("open");
        $(this).children("i").toggleClass("fa-eye-slash fa-eye");
        let input = $(this).prev("input");
        input.attr("type", input.attr("type") === "password" ? "text" : "password");
    });

    // 📩 Gửi yêu cầu đổi mật khẩu
    $(".savePass").click(function (e) {
        e.preventDefault(); // Ngăn chặn reload trang

        let oldPassword = $("#oldPassword").val().trim();
        let newPassword = $("#newPassword").val().trim();
        let confirmPassword = $("#confirmPassword").val().trim();

        // ✅ Kiểm tra nhập liệu
        if (!oldPassword || !newPassword || !confirmPassword) {
            alert("❌ Vui lòng nhập đầy đủ thông tin!");
            return;
        }
        if (newPassword !== confirmPassword) {
            alert("❌ Mật khẩu xác nhận không khớp!");
            return;
        }

        // 🚀 Gửi yêu cầu AJAX
        $.ajax({
            url: "/action/update-info/update-password.php",
            type: "POST",
            data: {
                oldPassword: oldPassword,
                newPassword: newPassword
            },
            dataType: "json",
            success: function (response) {
                console.log("📩 Server response:", response); // 🔍 Debug phản hồi từ server
                if (response.success) {
                    alert("✅ Đổi mật khẩu thành công!");

                    // ⚡ Quay lại trang trước đó nếu có, nếu không thì về trang chủ
                    let previousPage = document.referrer ? document.referrer : "/index.php";
                    window.location.href = previousPage;
                } else {
                    alert("❌ " + response.error);
                }
            },
            error: function (xhr, status, error) {
                console.error("❌ AJAX Error:", status, error, xhr.responseText); // 🔍 Debug lỗi AJAX
                alert("❌ Lỗi khi gửi yêu cầu, vui lòng thử lại!");
            }
        });
    });

    // ❌ Hủy đổi mật khẩu
    $(".cancelPass").click(function (e) {
        e.preventDefault();
        $("#oldPassword, #newPassword, #confirmPassword").val(""); // Xóa nội dung nhập
    });
});
