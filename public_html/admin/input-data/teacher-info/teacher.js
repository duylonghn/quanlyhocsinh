document.addEventListener("DOMContentLoaded", function () {
    const fileInput = document.getElementById("upload-results");
    const fileUploadText = document.querySelector(".file-upload-text");
    const tableBody = document.querySelector(".info-table tbody");
    const cancelButton = document.getElementById("cancel-info");
    const downloadBtn = document.querySelector(".download-btn"); // Nút tải file mẫu

    const semesterInput = document.getElementById("semester");
    const schoolInput = document.getElementById("school");
    const classInput = document.getElementById("class");
    const classIdInput = document.getElementById("class_id");

    if (!fileInput || !fileUploadText || !tableBody || !cancelButton || !downloadBtn) {
        console.error("Lỗi: Không tìm thấy một trong các phần tử HTML.");
        return;
    }

    // 📂 Xử lý khi tải file Excel lên
    fileInput.addEventListener("change", function (event) {
        const file = event.target.files[0];
        if (!file) return;

        // Kiểm tra định dạng file
        if (!file.name.endsWith(".xlsx")) {
            alert("Vui lòng chọn file có định dạng .xlsx!");
            fileInput.value = "";
            return;
        }

        fileUploadText.textContent = `📁 ${file.name}`;

        // Đọc file Excel
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);

        reader.onload = function (e) {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: "array" });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];

            // Lấy thông tin từ các ô quan trọng
            semesterInput.value = sheet["B1"] ? sheet["B1"].v : "";
            schoolInput.value = sheet["D1"] ? sheet["D1"].v : "";
            classInput.value = sheet["F1"] ? sheet["F1"].v : "";
            classIdInput.value = sheet["H1"] ? sheet["H1"].v : "";

            // Chuyển dữ liệu từ sheet thành JSON
            const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

            // Xóa dữ liệu cũ trên bảng
            tableBody.innerHTML = "";

            // Duyệt từ hàng thứ 3 để lấy dữ liệu thời khóa biểu
            for (let i = 2; i < jsonData.length; i += 3) {  // Mỗi tiết gồm 3 hàng ngang
                const subjectRow = jsonData[i] || [];   // Hàng chứa Môn học
                const teacherRow = jsonData[i + 1] || []; // Hàng chứa Tên giáo viên
                const teacherIdRow = jsonData[i + 2] || []; // Hàng chứa ID giáo viên

                for (let j = 1; j < subjectRow.length; j++) { // Duyệt theo cột (thứ)
                    const subject = subjectRow[j] || "";
                    const teacher = teacherRow[j] || "";
                    const teacherID = teacherIdRow[j] ? teacherIdRow[j].toString().trim() : "";

                    // Kiểm tra ID giáo viên phải có đúng 9 ký tự số
                    if (teacherID && !/^\d{9}$/.test(teacherID)) {
                        console.warn(`Bỏ qua ô (${i + 2}, ${j}): ID giáo viên không hợp lệ (${teacherID})`);
                        continue;
                    }

                    // 📝 Tạo dòng mới trong bảng
                    if (subject) {
                        const tr = document.createElement("tr");
                        tr.innerHTML = `
                            <td>${subject}</td>   <!-- Môn học -->
                            <td>${teacher}</td>   <!-- Tên giáo viên -->
                            <td>${teacherID}</td> <!-- ID giáo viên -->
                            <td><button class="delete-btn">🗑 Xóa</button></td>
                        `;
                        tableBody.appendChild(tr);
                    }
                }
            }
        };
    });

    // 🗑 Xóa dòng trong bảng
    tableBody.addEventListener("click", function (event) {
        if (event.target.classList.contains("delete-btn")) {
            event.target.closest("tr").remove();
        }
    });

    // ❌ Xóa toàn bộ dữ liệu bảng khi bấm nút "Hủy"
    cancelButton.addEventListener("click", function () {
        if (confirm("Bạn có chắc chắn muốn xóa tất cả dữ liệu?")) {
            tableBody.innerHTML = "";
            fileInput.value = "";
            fileUploadText.textContent = "Chọn tệp";

            // Xóa nội dung của các ô thông tin
            semesterInput.value = "";
            schoolInput.value = "";
            classInput.value = "";
            classIdInput.value = "";
        }
    });

    // 📥 Tải file mẫu
    if (downloadBtn) {
        downloadBtn.addEventListener("click", function () {
            const fileName = downloadBtn.getAttribute("data-file");
            if (fileName) {
                window.location.href = `/../../../action/download-file.php?file=${encodeURIComponent(fileName)}`;
            } else {
                alert("Lỗi: Không tìm thấy file mẫu!");
            }
        });
    }
});
