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

    showLoading();

    fetch(`/database/get-students-list.php?class_id=${classId}`)
        .then(response => response.json())
        .then(studentRes => {
            hideLoading();

            if (!studentRes.success) {
                alert(studentRes.message || "Lỗi khi lấy danh sách học sinh!");
                return;
            }

            fetch(`/action/get-evaluation.php?class_id=${classId}&semester_id=${semester_id}`)
                .then(evaluationResponse => evaluationResponse.json())
                .then(evaluationRes => {
                    if (!evaluationRes.success) {
                        alert(evaluationRes.message || "Lỗi khi lấy dữ liệu đánh giá!");
                        return;
                    }

                    populateEvaluationTable(studentRes.data, evaluationRes.data);
                })
                .catch(error => {
                    hideLoading();
                    console.error("Lỗi khi gọi API đánh giá:", error);
                    alert("Không thể lấy dữ liệu đánh giá!");
                });
        })
        .catch(error => {
            hideLoading();
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
                const behavior = row.querySelector(`select[name="behavior_${studentId}"]`)?.value || "";
                const academic = row.querySelector(`select[name="academic_performance_${studentId}"]`)?.value || "";
                const overall = row.querySelector(`select[name="rating_${studentId}"]`)?.value || "";

                payload.push({
                    student_id: studentId,
                    class_id: classId,
                    semester_id: semester_id,
                    behavior: behavior,
                    academic_performance: academic,
                    rating: overall
                });
            });

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
                    hideLoading();

                    if (result.success) {
                        alert("Lưu đánh giá thành công!");
                    } else {
                        alert("Lỗi khi lưu đánh giá: " + (result.message || "Không xác định"));
                    }
                })
                .catch(err => {
                    hideLoading();
                    console.error("Lỗi khi gửi đánh giá:", err);
                    alert("Lỗi khi gửi dữ liệu lên server!");
                });
        });
    }
});

function populateEvaluationTable(students, evaluations) {
    const tableBody = document.querySelector(".table-content tbody");
    if (!tableBody) return;

    tableBody.innerHTML = "";

    if (students.length === 0) {
        tableBody.innerHTML = "<tr><td colspan='6'>Không có học sinh nào</td></tr>";
        return;
    }

    students.forEach(student => {
        const evaluation = evaluations.find(e => e.student_id === student.id) || {};

        const row = document.createElement("tr");
        row.setAttribute("data-student-id", student.id);

        row.innerHTML = `
            <td>${student.id}</td>
            <td>${student.fullname}</td>
            <td>
                <select name="behavior_${student.id}">
                    <option value="">--Chọn--</option>
                    <option value="Tốt" ${evaluation.behavior?.trim() === "Tốt" ? "selected" : ""}>Tốt</option>
                    <option value="Khá" ${evaluation.behavior?.trim() === "Khá" ? "selected" : ""}>Khá</option>
                    <option value="Trung bình" ${evaluation.behavior?.trim() === "Trung bình" ? "selected" : ""}>Trung bình</option>
                    <option value="Yếu" ${evaluation.behavior?.trim() === "Yếu" ? "selected" : ""}>Yếu</option>
                </select>
            </td>
            <td>
                <select name="academic_performance_${student.id}">
                    <option value="">--Chọn--</option>
                    <option value="Giỏi" ${evaluation.academic_performance?.trim() === "Giỏi" ? "selected" : ""}>Giỏi</option>
                    <option value="Khá" ${evaluation.academic_performance?.trim() === "Khá" ? "selected" : ""}>Khá</option>
                    <option value="Trung bình" ${evaluation.academic_performance?.trim() === "Trung bình" ? "selected" : ""}>Trung bình</option>
                    <option value="Yếu" ${evaluation.academic_performance?.trim() === "Yếu" ? "selected" : ""}>Yếu</option>
                    <option value="Kém" ${evaluation.academic_performance?.trim() === "Kém" ? "selected" : ""}>Kém</option>
                </select>
            </td>
            <td>
                <select name="rating_${student.id}">
                    <option value="">--Chọn--</option>
                    <option value="Giỏi" ${evaluation.rating?.trim() === "Giỏi" ? "selected" : ""}>Giỏi</option>
                    <option value="Khá" ${evaluation.rating?.trim() === "Khá" ? "selected" : ""}>Khá</option>
                    <option value="Yếu" ${evaluation.rating?.trim() === "Yếu" ? "selected" : ""}>Yếu</option>
                </select>
            </td>
        `;

        tableBody.appendChild(row);
    });
}
