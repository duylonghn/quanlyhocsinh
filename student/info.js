document.addEventListener("DOMContentLoaded", function () {
    var editButton = document.getElementById('edit-info');
    var changepassButton = document.getElementById('change-pass');
    var saveButton = document.getElementById('save-info');
    var cancelButton = document.getElementById('cancel-info');
    var confirmationModal = document.getElementById('confirmation-modal');
    var confirmSaveButton = document.getElementById('confirm-save');
    var cancelSaveButton = document.getElementById('cancel-save');

    // Lấy thông tin học sinh từ server
    fetch("/database/info-students.php")
        .then(response => response.json())
        .then(data => {
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
        .catch(error => console.error("Lỗi:", error));

    // Chỉnh sửa thông tin (Bật/Tắt input)
    editButton.addEventListener('click', function () {
        var inputs = document.querySelectorAll('input');

        inputs.forEach(function (input) {
            input.disabled = !input.disabled;
            input.style.cursor = input.disabled ? 'not-allowed' : 'text';
        });

        // Hiển thị các nút phù hợp
        saveButton.style.display = 'inline-block';
        cancelButton.style.display = 'inline-block';
        editButton.style.display = 'none';
        changepassButton.style.display = 'none';
    });

    // Hủy chỉnh sửa
    cancelButton.addEventListener('click', function () {
        var inputs = document.querySelectorAll('input');

        inputs.forEach(function (input) {
            input.disabled = true;
            input.style.cursor = 'not-allowed';
        });

        saveButton.style.display = 'none';
        cancelButton.style.display = 'none';
        editButton.style.display = 'inline-block';
        changepassButton.style.display = 'inline-block';
    });

    // Lưu thông tin (Hiển thị hộp thoại xác nhận)
    saveButton.addEventListener('click', function () {
        confirmationModal.style.display = 'block';
    });

    // Xác nhận lưu
    confirmSaveButton.addEventListener('click', function () {
        var formData = new FormData();
        formData.append("id", document.getElementById("msv").textContent);
        formData.append("fullname", document.getElementById("fullname").textContent);
        formData.append("phone", document.getElementById("phone").textContent);
        formData.append("email", document.getElementById("email").textContent);
        formData.append("address", document.getElementById("address").textContent);

        fetch("update_info.php", {
            method: "POST",
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert("Cập nhật thành công!");
                } else {
                    alert("Lỗi: " + data.error);
                }
                confirmationModal.style.display = 'none';
            })
            .catch(error => console.error("Lỗi:", error));

        cancelButton.click(); // Tắt chế độ chỉnh sửa
    });

    // Hủy xác nhận
    cancelSaveButton.addEventListener('click', function () {
        confirmationModal.style.display = 'none';
    });

    // Đóng modal khi click bên ngoài
    window.addEventListener('click', function (event) {
        if (event.target === confirmationModal) {
            confirmationModal.style.display = 'none';
        }
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