document.addEventListener("DOMContentLoaded", function () {
    const menuItems = document.querySelectorAll(".menuinput");

    menuItems.forEach(item => {
        item.addEventListener("click", function () {
            const targetUrl = this.dataset.href;
            if (targetUrl) {
                window.location.href = targetUrl; // Chuyển hướng sang trang mới
            }
        });
    });
});
