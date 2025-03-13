// Cài đặt menu
document.addEventListener('DOMContentLoaded', function () {
    // Lắng nghe sự kiện click trên toàn bộ menu
    document.querySelector('.menu').addEventListener('click', handleMenuClick);
});
var activeButton = null;

function handleMenuClick(event) {
    var target = event.target;

    // Kiểm tra nếu phần tử được nhấn là "title" hoặc phần tử con bên trong "tab"
    while (target && !target.getAttribute('data-href') && target.id !== "logout") {
        target = target.parentElement;
    }

    if (!target) return;

    // Nếu nhấn vào "Đăng xuất"
    if (target.id === "logout") {
        logout();
    } else {
        var url = target.getAttribute('data-href');
        if (url) {
            window.location.href = url;
        }
    }
}

// Hàm logout
function logout() {
    fetch('/action/logout.php', { method: 'POST' })
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                window.location.href = "/action/login.php"; // Chuyển về trang đăng nhập
            } else {
                alert("Đăng xuất thất bại!"); // Thông báo nếu có lỗi
            }
        })
        .catch(error => console.error("Lỗi:", error));
}

// Thêm sự kiện click cho toàn bộ menu
document.querySelector('.dropdown').addEventListener('click', handleMenuClick);
