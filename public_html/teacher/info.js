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

            const teacherId = sessionData.user_id;

            // Gọi API lấy thông tin giáo viên
            fetch(`/database/info-teacher.php?teacher_id=${teacherId}`)
                .then(response => response.json())
                .then(data => {
                    if (data.error) {
                        alert(data.error);
                    } else {
                        originalData = { ...data, teacher_id: teacherId }; // Lưu cả teacher_id

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

                        setInputState(true);
                    }
                });
        });

    // Các nút điều khiển
    const editBtn = document.getElementById("edit-info");
    const saveBtn = document.getElementById("save-info");
    const cancelBtn = document.getElementById("cancel-info");
    const changePassBtn = document.getElementById("change-pass");

    editBtn.addEventListener("click", function () {
        setInputState(false);
        toggleButtons(false);
    });

    saveBtn.addEventListener("click", function () {
        const updatedData = {
            teacher_id: originalData.teacher_id,
            phone: getInputValue("phone"),
            email: getInputValue("email"),
            cccd: getInputValue("CCCD"),
            nation: getInputValue("nation"),
            religion: getInputValue("religion"),
            birthplace: getInputValue("birthplace"),
            address: getInputValue("address")
        };

        if (!updatedData.teacher_id || updatedData.teacher_id <= 0) {
            alert("❌ Lỗi: ID giáo viên không hợp lệ!");
            return;
        }

        if (!isDataChanged(updatedData, originalData)) {
            alert("⚠ Không có thay đổi nào trong thông tin!");
            return;
        }

        fetch("/action/update-info/update-info-teacher.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedData)
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                alert("✅ Cập nhật thông tin thành công!");
                originalData = { ...updatedData, teacher_id: originalData.teacher_id };
                setInputState(true);
                toggleButtons(true);
            } else {
                alert("❌ Lỗi khi cập nhật: " + result.error);
            }
        });
    });

    cancelBtn.addEventListener("click", function () {
        setInputValue("phone", originalData.phone);
        setInputValue("email", originalData.email);
        setInputValue("CCCD", originalData.cccd);
        setInputValue("nation", originalData.nation);
        setInputValue("religion", originalData.religion);
        setInputValue("birthplace", originalData.birthplace);
        setInputValue("address", originalData.address);

        setInputState(true);
        toggleButtons(true);
    });

    changePassBtn.addEventListener("click", function () {
        const href = this.getAttribute("data-href");
        if (href) {
            window.location.href = href;
        }
    });

    function setInputState(disabled) {
        document.querySelectorAll("input").forEach(input => {
            if (!["msv", "class", "course"].includes(input.id)) {
                input.disabled = disabled;
                input.style.cursor = disabled ? "not-allowed" : "text";
            }
        });
    }

    function toggleButtons(isDefault) {
        editBtn.style.display = isDefault ? "inline-block" : "none";
        changePassBtn.style.display = isDefault ? "inline-block" : "none";
        saveBtn.style.display = isDefault ? "none" : "inline-block";
        cancelBtn.style.display = isDefault ? "none" : "inline-block";
    }

    function getInputValue(id) {
        return document.getElementById(id).value.trim();
    }

    function setInputValue(id, value) {
        document.getElementById(id).value = value || "";
    }

    function isDataChanged(updatedData, originalData) {
        return Object.keys(updatedData).some(key => String(updatedData[key]).trim() !== String(originalData[key]).trim());
    }
});
