document.addEventListener("DOMContentLoaded", function () {
    const editButton = document.getElementById("edit-info");
    const saveButton = document.getElementById("save-info");
    const cancelButton = document.getElementById("cancel-info");
    const changePassButton = document.getElementById("change-pass");
    const confirmModal = document.getElementById("confirmation-modal");
    const confirmSaveButton = document.getElementById("confirm-save");
    const cancelSaveButton = document.getElementById("cancel-save");
    const inputs = document.querySelectorAll("input:not(#msv)");
    const msvInfo = document.getElementById("msv-info");
    const msvInput = document.getElementById("msv");

    function setInputsEditable(editable) {
        inputs.forEach(input => {
            if (input !== msvInfo) {
                input.disabled = !editable;
                input.style.cursor = editable ? "text" : "not-allowed";
            }
        });
    }

    function fillData(data) {
        // Thông tin chung
        document.getElementById("fullname").value = data.fullname || "";
        document.getElementById("msv-info").value = data.id || "";
        document.getElementById("sex").value = data.sex || "";
        document.getElementById("address").value = data.address || "";
        document.getElementById("phone").value = data.phone || "";
        document.getElementById("email").value = data.email || "";
        document.getElementById("CCCD").value = data.cccd || "";
        document.getElementById("nation").value = data.nation || "";
        document.getElementById("religion").value = data.religion || "";
        document.getElementById("birthplace").value = data.birthplace || "";

        // Nếu là sinh viên
        if (data.class_name) {
            document.getElementById("class").value = data.class_name || "";
            document.getElementById("course").value = data.course || "";
            document.getElementById("parents").value = data.parent_name || "";
            document.getElementById("relationship").value = data.relationship || "";
            document.getElementById("phone-parents").value = data.parent_phone || "";
        } 
        // Nếu là giáo viên
        else {
            document.getElementById("class").value = data.class_id || "";
            document.getElementById("course").value = data.course || "";
            document.getElementById("parents").value = "";
            document.getElementById("relationship").value = "";
            document.getElementById("phone-parents").value = "";
        }
    }

    msvInput.addEventListener("change", function () {
        const msv = msvInput.value.trim();
        if (!msv || (msv[0] !== '2' && msv[0] !== '3')) {
            alert("Vui lòng nhập ID hợp lệ bắt đầu bằng 2 (sinh viên) hoặc 3 (giảng viên)");
            return;
        }

        let endpoint = "";
        let param = "";

        if (msv[0] === '2') {
            endpoint = "/../../database/info-students.php";
            param = `id=${encodeURIComponent(msv)}`;
        } else if (msv[0] === '3') {
            endpoint = "/../../database/info-teacher.php";
            param = `teacher_id=${encodeURIComponent(msv)}`;
        }

        fetch(`${endpoint}?${param}`)
            .then(response => {
                if (!response.ok) throw new Error("Không thể lấy dữ liệu");
                return response.json();
            })
            .then(data => {
                fillData(data);
            })
            .catch(error => {
                console.error(error);
                alert("Không tìm thấy thông tin người dùng.");
            });
    });

    editButton.addEventListener("click", function () {
        setInputsEditable(true);
        editButton.style.display = "none";
        changePassButton.style.display = "none";
        saveButton.style.display = "inline-block";
        cancelButton.style.display = "inline-block";
    });

    cancelButton.addEventListener("click", function () {
        setInputsEditable(false);
        editButton.style.display = "inline-block";
        changePassButton.style.display = "inline-block";
        saveButton.style.display = "none";
        cancelButton.style.display = "none";
    });

    saveButton.addEventListener("click", function () {
        confirmModal.style.display = "block";
    });

    confirmSaveButton.addEventListener("click", function () {
        confirmModal.style.display = "none";
        setInputsEditable(false);
        editButton.style.display = "inline-block";
        changePassButton.style.display = "inline-block";
        saveButton.style.display = "none";
        cancelButton.style.display = "none";
    });

    cancelSaveButton.addEventListener("click", function () {
        confirmModal.style.display = "none";
    });

    msvInfo.disabled = true;
    msvInfo.style.cursor = "not-allowed";
    setInputsEditable(false);

    changePassButton.addEventListener("click", function () {
        window.location.href = changePassButton.getAttribute("data-href");
    });
});
