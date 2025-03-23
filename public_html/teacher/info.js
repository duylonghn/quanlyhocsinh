document.addEventListener("DOMContentLoaded", function () {
    let originalData = {}; // Biến lưu dữ liệu gốc

    // 🔄 Lấy `teacher_id` từ session
    fetch("/action/get-session.php")
        .then(response => response.json())
        .then(sessionData => {
            if (!sessionData.user_id || isNaN(sessionData.user_id)) {
                alert("Không tìm thấy ID giáo viên trong session hoặc ID không hợp lệ!");
                return;
            }

            const teacherId = sessionData.user_id; // Lấy teacher_id từ session

            // Gọi API lấy thông tin giáo viên
            fetch(`/database/info-teacher.php?teacher_id=${teacherId}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Lỗi HTTP: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.error) {
                        alert(data.error);
                    } else {
                        // Lưu dữ liệu gốc để có thể hoàn tác khi hủy chỉnh sửa
                        originalData = { ...data };

                        // Điền dữ liệu vào HTML
                        document.getElementById("fullname").textContent = data.fullname || "N/A";
                        document.getElementById("msv").textContent = data.id || "N/A";
                        document.getElementById("sex").textContent = data.sex || "N/A";
                        document.getElementById("class").textContent = data.class_id || "N/A";
                        document.getElementById("course").textContent = data.course || "N/A";

                        // Gán giá trị vào input
                        setInputValue("phone", data.phone);
                        setInputValue("email", data.email);
                        setInputValue("CCCD", data.cccd);
                        setInputValue("nation", data.nation);
                        setInputValue("religion", data.religion);
                        setInputValue("birthplace", data.birthplace);
                        setInputValue("address", data.address);

                        // Mặc định khóa input
                        setInputState(true);
                    }
                })
                .catch(error => console.error("❌ Lỗi khi lấy dữ liệu giáo viên:", error));
        })
        .catch(() => console.error("❌ Lỗi khi lấy teacher_id từ session."));

    // Các nút điều khiển
    const editBtn = document.getElementById("edit-info");
    const saveBtn = document.getElementById("save-info");
    const cancelBtn = document.getElementById("cancel-info");
    const changePassBtn = document.getElementById("change-pass");

    // ✏ Sự kiện khi nhấn "Chỉnh sửa thông tin"
    editBtn.addEventListener("click", function () {
        setInputState(false); // Mở khóa input để chỉnh sửa
        toggleButtons(false); // Ẩn nút "Chỉnh sửa", hiện nút "Lưu" & "Hủy"
    });

    // 💾 Sự kiện khi nhấn "Lưu"
    saveBtn.addEventListener("click", function () {
        const updatedData = {
            teacher_id: originalData.id, // ID không đổi
            phone: getInputValue("phone"),
            email: getInputValue("email"),
            cccd: getInputValue("CCCD"),
            nation: getInputValue("nation"),
            religion: getInputValue("religion"),
            birthplace: getInputValue("birthplace"),
            address: getInputValue("address")
        };

        // Gửi dữ liệu lên server
        fetch("/action/update-teacher.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedData)
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                alert("Cập nhật thông tin thành công!");
                originalData = { ...updatedData }; // Cập nhật dữ liệu gốc mới
                setInputState(true); // Khóa input lại
                toggleButtons(true); // Hiển thị lại nút "Chỉnh sửa"
            } else {
                alert("❌ Lỗi khi cập nhật: " + result.error);
            }
        })
        .catch(error => console.error("❌ Lỗi khi cập nhật thông tin:", error));
    });

    // ❌ Sự kiện khi nhấn "Hủy"
    cancelBtn.addEventListener("click", function () {
        // Khôi phục dữ liệu gốc
        setInputValue("phone", originalData.phone);
        setInputValue("email", originalData.email);
        setInputValue("CCCD", originalData.cccd);
        setInputValue("nation", originalData.nation);
        setInputValue("religion", originalData.religion);
        setInputValue("birthplace", originalData.birthplace);
        setInputValue("address", originalData.address);

        setInputState(true); // Khóa input lại
        toggleButtons(true); // Hiển thị lại nút "Chỉnh sửa"
    });

    // 🔑 Sự kiện khi nhấn "Đổi mật khẩu" -> Điều hướng
    changePassBtn.addEventListener("click", function () {
        const href = this.getAttribute("data-href"); // Lấy URL từ data-href
        if (href) {
            window.location.href = href; // Điều hướng đến trang đổi mật khẩu
        } else {
            console.error("❌ Không tìm thấy đường dẫn đổi mật khẩu!");
        }
    });

    // ✅ Hàm cập nhật trạng thái input (true: khóa, false: mở)
    function setInputState(disabled) {
        document.querySelectorAll("input").forEach(input => {
            if (!["msv", "class", "course"].includes(input.id)) {
                input.disabled = disabled;
                input.style.cursor = disabled ? "not-allowed" : "text";
            }
        });
    }

    // ✅ Hàm hiển thị hoặc ẩn các nút phù hợp
    function toggleButtons(isDefault) {
        editBtn.style.display = isDefault ? "inline-block" : "none";
        changePassBtn.style.display = isDefault ? "inline-block" : "none";
        saveBtn.style.display = isDefault ? "none" : "inline-block";
        cancelBtn.style.display = isDefault ? "none" : "inline-block";
    }

    // ✅ Hàm lấy giá trị input
    function getInputValue(id) {
        return document.getElementById(id).value.trim();
    }

    // ✅ Hàm gán giá trị vào input
    function setInputValue(id, value) {
        document.getElementById(id).value = value || "";
    }
});
