document.addEventListener("DOMContentLoaded", function () {
    const saveButton = document.querySelector(".send-evaluation");
    const cancelButton = document.querySelector(".cancel");

    const subjectName = localStorage.getItem('subject_name') || '';
    const urlParams = new URLSearchParams(window.location.search);
    const classId = urlParams.get('class_id');

    if (!classId) {
        alert("Không tìm thấy class_id trong URL!");
        return;
    }

    // Xác định học kỳ
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    let semester_id = "";

    if (month >= 8 && month <= 12) {
        semester_id = `1_${year.toString().slice(-2)}_${(year + 1).toString().slice(-2)}`;
    } else if (month >= 1 && month <= 6) {
        semester_id = `2_${(year - 1).toString().slice(-2)}_${year.toString().slice(-2)}`;
    }

    // Hiển thị loading khi lấy dữ liệu
    showLoading();

    // Lấy danh sách học sinh
    fetch(`/database/get-students-list.php?class_id=${classId}`)
        .then(response => response.json())
        .then(studentRes => {
            hideLoading(); // Ẩn loading khi lấy dữ liệu thành công

            if (!studentRes.success) {
                alert(studentRes.message || "Lỗi khi lấy danh sách học sinh!");
                return;
            }

            populateEvaluationTable(studentRes.data);
        })
        .catch(error => {
            hideLoading(); // Ẩn loading khi gặp lỗi
            console.error("Lỗi khi gọi API học sinh:", error);
            alert("Không thể lấy danh sách học sinh!");
        });

    if (cancelButton) {
        cancelButton.addEventListener("click", function () {
            const rows = document.querySelectorAll(".table-content tbody tr");
            rows.forEach((row) => {
                row.querySelectorAll('select').forEach(select => select.value = '');
            });
        });
    }

    if (saveButton) {
        saveButton.addEventListener("click", function () {
            const rows = document.querySelectorAll(".table-content tbody tr");
            const payload = [];

            rows.forEach(row => {
                const studentId = row.getAttribute('data-student-id');
                const behavior = row.querySelector(`select[name="behavior_${studentId}"]`).value;
                const academic = row.querySelector(`select[name="academic_${studentId}"]`).value;
                const overall = row.querySelector(`select[name="ranking_${studentId}"]`).value;

                payload.push({
                    student_id: studentId,
                    class_id: classId,
                    semester_id: semester_id,
                    behavior: behavior,
                    academic: academic,
                    ranking: overall
                });
            });

            // Hiển thị loading khi lưu dữ liệu
            showLoading();

            fetch("/../../../action/save-evaluation.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ data: payload })
            })
                .then(res => res.json())
                .then(result => {
                    hideLoading(); // Ẩn loading khi lưu dữ liệu xong

                    if (result.success) {
                        alert("Lưu đánh giá thành công!");
                    } else {
                        alert("Lỗi khi lưu đánh giá: " + (result.message || "Không xác định"));
                    }
                })
                .catch(err => {
                    hideLoading(); // Ẩn loading khi gặp lỗi
                    console.error("Lỗi khi gửi đánh giá:", err);
                    alert("Lỗi khi gửi dữ liệu lên server!");
                });
        });
    }
});

function populateEvaluationTable(students) {
    const tableBody = document.querySelector(".table-content tbody");
    if (!tableBody) return;

    tableBody.innerHTML = "";

    if (students.length === 0) {
        tableBody.innerHTML = "<tr><td colspan='6'>Không có học sinh nào</td></tr>";
        return;
    }

    students.forEach(student => {
        const row = document.createElement("tr");
        row.setAttribute("data-student-id", student.id);

        row.innerHTML = `
            <td>${student.id}</td>
            <td>${student.fullname}</td>
            <td>
                <select name="behavior_${student.id}">
                    <option value="">--Chọn--</option>
                    <option value="Tốt">Tốt</option>
                    <option value="Khá">Khá</option>
                    <option value="Trung bình">Trung bình</option>
                    <option value="Yếu">Yếu</option>
                </select>
            </td>
            <td>
                <select name="academic_${student.id}">
                    <option value="">--Chọn--</option>
                    <option value="Giỏi">Giỏi</option>
                    <option value="Khá">Khá</option>
                    <option value="Trung bình">Trung bình</option>
                    <option value="Yếu">Yếu</option>
                    <option value="Kém">Kém</option>
                </select>
            </td>
            <td>
                <select name="ranking_${student.id}">
                    <option value="">--Chọn--</option>
                    <option value="Hoàn thành tốt">Hoàn thành tốt</option>
                    <option value="Hoàn thành">Hoàn thành</option>
                    <option value="Chưa hoàn thành">Chưa hoàn thành</option>
                </select>
            </td>
        `;

        tableBody.appendChild(row);
    });
}
