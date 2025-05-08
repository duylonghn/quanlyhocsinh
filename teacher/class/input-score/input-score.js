document.addEventListener("DOMContentLoaded", function () {
    const fileInput = document.getElementById("upload-results");
    const fileUploadText = document.querySelector(".file-upload-text");
    const downloadBtn = document.querySelector(".download-btn");
    const saveButton = document.querySelector(".send-score");
    const cancelButton = document.querySelector(".cancel");

    const subjectName = sessionStorage.getItem('subject_name') || '';
    const urlParams = new URLSearchParams(window.location.search);
    const classId = urlParams.get('class_id');

    if (!classId) {
        alert("Không tìm thấy class_id trong URL!");
        return;
    }

    const subjectMap = {
        "Âm Nhạc": "AN", "Công Nghệ": "CN", "Địa Lý": "DL", "Giáo Dục Công Dân": "GD",
        "Hóa Học": "HH", "Lịch Sử": "LS", "Mỹ Thuật": "MT", "Ngữ Văn": "NV",
        "Quốc Phòng": "QP", "Sinh Học": "SH", "Thể Dục": "TD", "Tiếng Anh": "TA",
        "Tin Học": "TH", "Toán": "TO", "Vật Lý": "VL"
    };

    const subjectId = subjectMap[subjectName];
    if (!subjectId) {
        alert("Không tìm thấy mã môn học tương ứng với: " + subjectName);
        return;
    }

    showLoading(); // Hiển thị loading khi bắt đầu gọi API

    fetch(`/database/get-students-list.php?class_id=${classId}`)
        .then(response => response.json())
        .then(studentRes => {
            hideLoading(); // Ẩn loading sau khi nhận được dữ liệu học sinh

            if (!studentRes.success) {
                alert(studentRes.message || "Lỗi không xác định từ API học sinh!");
                return;
            }

            showLoading(); // Hiển thị loading khi bắt đầu gọi API điểm

            fetch(`/database/get-score.php?class_id=${classId}&subject_id=${subjectId}`)
                .then(response => response.json())
                .then(scoreRes => {
                    hideLoading(); // Ẩn loading sau khi nhận được dữ liệu điểm

                    if (!scoreRes.success) {
                        console.warn("Không lấy được điểm:", scoreRes.message);
                    }

                    populateTable(studentRes.data, subjectName);

                    setTimeout(() => {
                        if (scoreRes.success) {
                            fillScores(scoreRes.data);
                        }
                    }, 100);
                })
                .catch(error => {
                    hideLoading(); // Ẩn loading trong trường hợp có lỗi khi gọi API điểm
                    console.error("Lỗi khi gọi API điểm:", error);
                });
        })
        .catch(error => {
            hideLoading(); // Ẩn loading trong trường hợp có lỗi khi gọi API danh sách học sinh
            console.error("Lỗi khi lấy danh sách học sinh:", error);
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

    if (fileInput) {
        fileInput.addEventListener("change", handleFileUpload);
    }

    if (cancelButton) {
        cancelButton.addEventListener("click", function () {
            const rows = document.querySelectorAll(".table-content tbody tr");
            rows.forEach((row) => {
                row.querySelectorAll('input[type="number"]').forEach(input => input.value = '');
            });
        });
    }

    if (saveButton) {
        saveButton.addEventListener("click", function () {
            const rows = document.querySelectorAll(".table-content tbody tr");
            const payload = [];

            const now = new Date();
            const month = now.getMonth() + 1;
            const year = now.getFullYear();
            let semester_id = "";

            if (month >= 8 && month <= 12) {
                semester_id = `1_${year.toString().slice(-2)}_${(year + 1).toString().slice(-2)}`;
            } else if (month >= 1 && month <= 6) {
                semester_id = `2_${(year - 1).toString().slice(-2)}_${year.toString().slice(-2)}`;
            }

            rows.forEach(row => {
                const studentId = row.getAttribute('data-student-id');

                const getInputValue = (prefix) => {
                    const input = row.querySelector(`input[name="${prefix}_${studentId}"]`);
                    return input ? parseFloat(input.value) || null : null;
                };

                payload.push({
                    student_id: studentId,
                    class_id: classId,
                    subject_id: subjectId,
                    semester_id: semester_id,

                    oral_test_1: getInputValue('m1'),
                    oral_test_2: getInputValue('m2'),
                    oral_test_3: getInputValue('m3'),
                    quiz_1: getInputValue('p1'),
                    quiz_2: getInputValue('p2'),
                    test_1: getInputValue('t1'),
                    test_2: getInputValue('t2'),
                    final_exam: getInputValue('ck'),
                    total_score: getInputValue('tk')
                });
            });

            showLoading(); // Hiển thị loading khi gửi dữ liệu

            fetch("/../../../action/save-score.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ data: payload })
            })
                .then(res => res.json())
                .then(result => {
                    hideLoading(); // Ẩn loading sau khi hoàn thành gửi dữ liệu

                    if (result.success) {
                        alert("Lưu điểm thành công!");
                    } else {
                        alert("Lỗi khi lưu điểm: " + (result.message || "Không xác định"));
                    }
                })
                .catch(err => {
                    hideLoading(); // Ẩn loading trong trường hợp có lỗi khi gửi dữ liệu
                    console.error("Lỗi khi gửi dữ liệu:", err);
                    alert("Lỗi khi gửi dữ liệu lên server!");
                });
        });
    }
});

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        const studentsData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        processStudentData(studentsData);
    };

    reader.readAsBinaryString(file);
}

function processStudentData(studentsData) {
    studentsData.slice(1).forEach((row) => {
        const studentId = row[0];
        if (!studentId) return;

        const studentRow = document.querySelector(`tr[data-student-id="${studentId}"]`);
        if (studentRow) {
            const scores = row.slice(3, 11);
            scores.forEach((score, index) => {
                const input = studentRow.querySelector(`input[name^='m${index + 1}_${studentId}']`);
                if (input && score !== "") {
                    input.value = score;
                }
            });
        }
    });
}

function populateTable(students, subjectName) {
    const tableBody = document.querySelector(".table-content tbody");
    if (!tableBody) return;

    tableBody.innerHTML = "";

    if (students.length === 0) {
        tableBody.innerHTML = "<tr><td colspan='15'>Không có học sinh nào</td></tr>";
        return;
    }

    students.forEach((student) => {
        const row = document.createElement("tr");
        row.setAttribute('data-student-id', student.id);

        row.innerHTML = `
            <td>${student.id || "N/A"}</td>
            <td>${student.fullname || "N/A"}</td>
            <td class="subject-name-cell">${subjectName}</td>
            <td><input type="number" name="m1_${student.id}" min="0" max="10" /></td>
            <td><input type="number" name="m2_${student.id}" min="0" max="10" /></td>
            <td><input type="number" name="m3_${student.id}" min="0" max="10" /></td>
            <td><input type="number" name="p1_${student.id}" min="0" max="10" /></td>
            <td><input type="number" name="p2_${student.id}" min="0" max="10" /></td>
            <td><input type="number" name="t1_${student.id}" min="0" max="10" /></td>
            <td><input type="number" name="t2_${student.id}" min="0" max="10" /></td>
            <td><input type="number" name="ck_${student.id}" min="0" max="10" /></td>
            <td><input type="number" name="tk_${student.id}" min="0" max="10" /></td>
        `;
        tableBody.appendChild(row);
    });
}

function fillScores(scoreList) {
    if (!Array.isArray(scoreList)) return;

    scoreList.forEach(score => {
        const studentId = score.student_id;
        const row = document.querySelector(`tr[data-student-id="${studentId}"]`);
        if (!row) return;

        const fieldMap = {
            oral_test_1: 'm1',
            oral_test_2: 'm2',
            oral_test_3: 'm3',
            quiz_1: 'p1',
            quiz_2: 'p2',
            test_1: 't1',
            test_2: 't2',
            final_exam: 'ck',
            total_score: 'tk'
        };

        for (const key in fieldMap) {
            const input = row.querySelector(`input[name="${fieldMap[key]}_${studentId}"]`);
            if (input && score[key] !== null) {
                input.value = score[key];
            }
        }
    });
}
