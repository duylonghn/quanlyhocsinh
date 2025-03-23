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

    function setInputsEditable(editable) {
        inputs.forEach(input => {
            if (input !== msvInfo) {
                input.disabled = !editable;
                input.style.cursor = editable ? "text" : "not-allowed";
            }
        });
    }

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

    // Luôn chặn chỉnh sửa msv-info
    msvInfo.disabled = true;
    msvInfo.style.cursor = "not-allowed";

    setInputsEditable(false);

    // Chuyển hướng khi bấm nút đổi mật khẩu
    changePassButton.addEventListener("click", function () {
        window.location.href = changePassButton.getAttribute("data-href");
    });
});
