document.addEventListener("DOMContentLoaded", function () {
    const fileInput = document.getElementById("upload-results");
    const fileUploadText = document.querySelector(".file-upload-text");
    const tableBody = document.querySelector(".info-table tbody");
    const cancelButton = document.getElementById("cancel-info");
    const downloadBtn = document.querySelector(".download-btn"); // Nút tải file mẫu
    const saveButton = document.getElementById("save-info");

    if (!fileInput || !fileUploadText || !tableBody) {
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

            // Chuyển dữ liệu từ sheet thành JSON
            const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

            // Xóa dữ liệu cũ trên bảng
            tableBody.innerHTML = "";

            // Lấy dữ liệu từ hàng thứ 3 trở đi (hàng 1 là tiêu đề, hàng 2 là mô tả)
            for (let i = 2; i < jsonData.length; i++) {
                const row = jsonData[i];
                if (row.length === 0) continue; // Bỏ qua dòng trống

                // 📝 Tạo dòng mới trong bảng
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${row[0] || ""}</td>   <!-- Mã học sinh -->
                    <td>${row[1] || ""}</td>   <!-- Họ tên -->
                    <td>${row[2] || ""}</td>   <!-- Giới tính -->
                    <td>${row[3] || ""}</td>   <!-- Lớp -->
                    <td>${row[4] || ""}</td>   <!-- Khóa -->
                    <td>${row[5] || ""}</td>   <!-- Trường -->
                    <td>${row[6] || ""}</td>   <!-- Số điện thoại -->
                    <td>${row[7] || ""}</td>   <!-- Email -->
                    <td>${row[8] || ""}</td>   <!-- CCCD -->
                    <td>${row[9] || ""}</td>   <!-- Dân tộc -->
                    <td>${row[10] || ""}</td>  <!-- Tôn giáo -->
                    <td>${row[11] || ""}</td>  <!-- Quê quán -->
                    <td>${row[12] || ""}</td>  <!-- Địa chỉ -->
                    <td>${row[13] || ""}</td>  <!-- Họ tên phụ huynh -->
                    <td>${row[14] || ""}</td>  <!-- Số điện thoại phụ huynh -->
                    <td>${row[15] || ""}</td>  <!-- Quan hệ -->
                    <td><button class="delete-btn">🗑 Xóa</button></td>
                `;

                tableBody.appendChild(tr);
            }
        };
    });

    // 🗑 Xóa dòng trong bảng
    tableBody.addEventListener("click", function (event) {
        if (event.target.classList.contains("delete-btn")) {
            event.target.closest("tr").remove();
        }
    });

    // 🔥 Xóa toàn bộ dữ liệu khi bấm nút "Hủy"
    cancelButton.addEventListener("click", function () {
        if (confirm("Bạn có chắc chắn muốn xóa tất cả dữ liệu?")) {
            tableBody.innerHTML = "";  // Xóa toàn bộ nội dung trong bảng
            fileUploadText.textContent = "Chọn tệp"; // Reset lại chữ chọn file
            fileInput.value = ""; // Xóa file đã chọn
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

    // 📝 Lưu dữ liệu lên server
    saveButton.addEventListener("click", function () {
        const rows = tableBody.querySelectorAll("tr");
        if (rows.length === 0) {
            alert("Không có dữ liệu để lưu!");
            return;
        }

        const studentData = [];

        rows.forEach(row => {
            const cells = row.querySelectorAll("td");
            const data = {
                msv: cells[0]?.textContent.trim() || "",
                fullname: cells[1]?.textContent.trim() || "",
                sex: cells[2]?.textContent.trim() || "",
                class_id: cells[3]?.textContent.trim() || "",
                course: cells[4]?.textContent.trim() || "",
                school: cells[5]?.textContent.trim() || "",
                phone: cells[6]?.textContent.trim() || "",
                email: cells[7]?.textContent.trim() || "",
                cccd: cells[8]?.textContent.trim() || "",
                nation: cells[9]?.textContent.trim() || "",
                religion: cells[10]?.textContent.trim() || "",
                birthplace: cells[11]?.textContent.trim() || "",
                address: cells[12]?.textContent.trim() || "",
                parent_name: cells[13]?.textContent.trim() || "",
                parent_phone: cells[14]?.textContent.trim() || "",
                relationship: cells[15]?.textContent.trim() || ""
            };

            studentData.push(data);
        });

        // Gửi dữ liệu lên server
        fetch("/../../action/inputdata/students.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(studentData)
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                alert("✅ Đã lưu thành công!");
                // Có thể làm trống bảng hoặc reset nếu cần
            } else {
                alert("❌ Lỗi: " + (result.message || "Không xác định"));
            }
        })
        .catch(error => {
            console.error("Lỗi khi gửi dữ liệu:", error);
            alert("❌ Gửi dữ liệu thất bại.");
        });
    });
});
