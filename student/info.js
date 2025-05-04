document.addEventListener("DOMContentLoaded", function () {
    var editButton = document.getElementById('edit-info');
    var changepassButton = document.getElementById('change-pass');
    var saveButton = document.getElementById('save-info');
    var cancelButton = document.getElementById('cancel-info');
    var confirmationModal = document.getElementById('confirmation-modal');
    var confirmSaveButton = document.getElementById('confirm-save');
    var cancelSaveButton = document.getElementById('cancel-save');

    // Lấy ID từ session thông qua AJAX
    fetch('/action/get-session.php')
        .then(response => response.json())
        .then(sessionData => {
            if (!sessionData.user_id) {
                console.error("Lỗi: Không tìm thấy ID trong session.");
                return;
            }

            const userId = sessionData.user_id; // Lấy user_id từ session

            // Bắt đầu hiển thị loading
            showLoading();

            // Gọi API lấy thông tin học sinh
            fetch(`/database/info-students.php?id=${userId}`)
                .then(response => response.json())
                .then(data => {
                    // Kết thúc hiển thị loading
                    hideLoading();

                    if (data.error) {
                        alert(data.error);
                        return;
                    }

                    // Hiển thị thông tin học sinh
                    document.getElementById("fullname").textContent = data.fullname;
                    document.getElementById("birthday").textContent = data.birthday;
                    document.getElementById("id").textContent = data.id;
                    document.getElementById("sex").textContent = data.sex;
                    document.getElementById("class").textContent = data.class_name;
                    document.getElementById("course").textContent = data.course;

                    // Hiển thị thông tin cá nhân
                    document.getElementById("phone").textContent = data.phone;
                    document.getElementById("email").textContent = data.email;
                    document.getElementById("CCCD").textContent = data.cccd;
                    document.getElementById("nation").textContent = data.nation;
                    document.getElementById("religion").textContent = data.religion;
                    document.getElementById("birthplace").textContent = data.birthplace;
                    document.getElementById("address").textContent = data.address;

                    // Hiển thị thông tin lớp học
                    document.getElementById("teacher").textContent = data.teacher_name;
                    document.getElementById("phone-teacher").textContent = data.teacher_phone;
                    document.getElementById("email-teacher").textContent = data.teacher_email;

                    // Hiển thị thông tin phụ huynh
                    document.getElementById("parents").textContent = data.parent_name || "Chưa cập nhật";
                    document.getElementById("phone-parents").textContent = data.parent_phone || "Chưa cập nhật";
                    document.getElementById("relationship").textContent = data.relationship || "Chưa cập nhật";
                })
                .catch(error => {
                    // Kết thúc hiển thị loading nếu có lỗi
                    hideLoading();
                    console.error("Lỗi khi lấy dữ liệu học sinh:", error);
                });
        })
        .catch(error => {
            // Kết thúc hiển thị loading nếu có lỗi khi lấy session
            hideLoading();
            console.error("Lỗi khi lấy session:", error);
        });

    // Xử lý sự kiện khi nhấn vào nút "Đổi mật khẩu"
    changepassButton.addEventListener('click', function () {
        var url = changepassButton.getAttribute('data-href');
        if (url) {
            window.location.href = url; // Chuyển hướng đến trang đổi mật khẩu
        } else {
            console.error("Lỗi: Không tìm thấy URL đổi mật khẩu.");
        }
    });
});
