document.addEventListener("DOMContentLoaded", function () {
    const fileInput = document.getElementById("upload-results");
    const fileUploadText = document.querySelector(".file-upload-text");
    const downloadBtn = document.querySelector(".download-btn");
    const cancelBtn = document.getElementById("cancel-btn");
    const dateHeader = document.getElementById("date-header");
    const sangContainer = document.getElementById("sang");
    const chieuContainer = document.getElementById("chieu");
    
    if (!fileInput || !fileUploadText || !downloadBtn) {
        console.error("Lỗi: Không tìm thấy phần tử HTML cần thiết.");
        return;
    }

    function createSchedule(data = null) {
        dateHeader.innerHTML = '';
        sangContainer.innerHTML = '';
        chieuContainer.innerHTML = '';

        const headerRow = document.createElement('div');
        headerRow.classList.add('row');
        const periodHeaderCell = document.createElement('div');
        periodHeaderCell.classList.add('cell', 'tiethoc');
        periodHeaderCell.textContent = 'Tiết học';
        headerRow.appendChild(periodHeaderCell);

        const daysOfWeek = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
        daysOfWeek.forEach(day => {
            const dayHeaderCell = document.createElement('div');
            dayHeaderCell.classList.add('cell', 'header');
            dayHeaderCell.textContent = day;
            headerRow.appendChild(dayHeaderCell);
        });
        dateHeader.appendChild(headerRow);

        const periods = ["Tiết 1", "Tiết 2", "Tiết 3", "Tiết 4", "Tiết 5", "Tiết 6", "Tiết 7", "Tiết 8", "Tiết 9", "Tiết 10"];
        periods.forEach((period, index) => {
            const periodRow = document.createElement('div');
            periodRow.classList.add('row');
            const periodCell = document.createElement('div');
            periodCell.classList.add('cell', 'tiet');
            periodCell.textContent = period;
            periodRow.appendChild(periodCell);

            daysOfWeek.forEach((_, dayIndex) => {
                const cell = document.createElement('div');
                cell.classList.add('cell', 'body');

                const subjectInput = document.createElement('input');
                subjectInput.type = 'text';
                subjectInput.classList.add('subject-input');
                subjectInput.placeholder = 'Môn học';

                const teacherInput = document.createElement('input');
                teacherInput.type = 'text';
                teacherInput.classList.add('teacher-input');
                teacherInput.placeholder = 'Giáo viên';

                const teacherIdInput = document.createElement('input');
                teacherIdInput.type = 'text';
                teacherIdInput.classList.add('teacher-id-input');
                teacherIdInput.placeholder = 'MGV';

                if (data && data[index * 3]) {
                    subjectInput.value = data[index * 3][dayIndex + 1] || "";
                    teacherInput.value = data[index * 3 + 1][dayIndex + 1] || "";
                    teacherIdInput.value = data[index * 3 + 2][dayIndex + 1] || "";
                }

                cell.appendChild(subjectInput);
                cell.appendChild(teacherInput);
                cell.appendChild(teacherIdInput);
                periodRow.appendChild(cell);
            });

            (index < 5 ? sangContainer : chieuContainer).appendChild(periodRow);
        });
    }

    createSchedule();

    fileInput.addEventListener("change", function (event) {
        const file = event.target.files[0];
        if (!file) return;

        if (!file.name.endsWith(".xlsx")) {
            alert("Vui lòng chọn file có định dạng .xlsx!");
            fileInput.value = "";
            return;
        }
        fileUploadText.textContent = `📁 ${file.name}`;

        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = function (e) {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: "array" });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];

            const semester = sheet["B1"] ? sheet["B1"].v.trim() : "";
            const school = sheet["D1"] ? sheet["D1"].v.trim() : "";
            const className = sheet["F1"] ? sheet["F1"].v.trim() : "";
            const classId = sheet["H1"] ? sheet["H1"].v.trim() : "";

            if (!semester || !school || !className || !classId) {
                alert("Lỗi: File thiếu thông tin bắt buộc (Học kỳ, Trường, Lớp, ID lớp). Vui lòng kiểm tra lại!");
                fileInput.value = "";
                return;
            }

            document.getElementById("semester").value = semester;
            document.getElementById("school").value = school;
            document.getElementById("class").value = className;
            document.getElementById("class_id").value = classId;

            const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1, range: 3 });
            createSchedule(jsonData);
        };
    });

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
    if (cancelBtn) {
        cancelBtn.addEventListener("click", function () {
            // Xóa nội dung các ô thông tin
            document.getElementById("semester").value = "";
            document.getElementById("school").value = "";
            document.getElementById("class").value = "";
            document.getElementById("class_id").value = "";
    
            // Xóa bảng thời khóa biểu
            createSchedule();
    
            // Xóa tên file đã tải lên
            fileUploadText.textContent = "Chưa có file nào được chọn";
            fileInput.value = "";
    
            alert("Dữ liệu đã được xóa!");
        });
    }
});
