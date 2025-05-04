document.addEventListener("DOMContentLoaded", function () {
    const semesterSelect = document.getElementById("semester");

    showLoading(); // 👉 Hiện loading ngay từ đầu

    fetch('/action/get-session.php')
        .then(response => response.json())
        .then(sessionData => {
            if (!sessionData.user_id) {
                console.error("Lỗi: Không tìm thấy ID trong session.");
                hideLoading(); // ❌ Ẩn loading nếu lỗi
                return;
            }

            const studentId = sessionData.user_id;

            showLoading(); // 👉 Bắt đầu fetch điểm

            fetch(`/database/score-students.php?id=${studentId}`)
                .then(response => response.json())
                .then(data => {
                    if (data.error) {
                        console.error("Lỗi:", data.error);
                        hideLoading();
                        return;
                    }

                    // Hiển thị thông tin sinh viên
                    if (data.student_info) {
                        document.getElementById("fullname").innerText = data.student_info.fullname || "N/A";
                        document.getElementById("msv").innerText = data.student_info.student_id || "N/A";
                        document.getElementById("course").innerText = data.student_info.course || "N/A";
                        document.getElementById("class").innerText = data.student_info.class || "N/A";
                        document.getElementById("school").innerText = data.student_info.school || "N/A";
                    }

                    // Đổ danh sách học kỳ
                    semesterSelect.innerHTML = "";
                    let selectedSemesterId = null;
                    const currentMonth = new Date().getMonth() + 1;

                    data.semesters.forEach((sem) => {
                        let option = document.createElement("option");
                        option.value = sem.semester_id;

                        const semesterNameParts = sem.semester_name.split(',');
                        const semesterTitle = semesterNameParts[0].trim();
                        const academicYear = semesterNameParts[1].trim();

                        option.innerText = `${semesterTitle} - ${academicYear}`;
                        semesterSelect.appendChild(option);

                        if (!selectedSemesterId) {
                            if (currentMonth >= 8 && currentMonth <= 12 && semesterTitle.includes("Học kỳ 1")) {
                                selectedSemesterId = sem.semester_id;
                            } else if (currentMonth >= 1 && currentMonth <= 5 && semesterTitle.includes("Học kỳ 2")) {
                                selectedSemesterId = sem.semester_id;
                            }
                        }
                    });

                    if (!selectedSemesterId && data.semesters.length > 0) {
                        selectedSemesterId = data.semesters[0].semester_id;
                    }

                    semesterSelect.value = selectedSemesterId;

                    // 👉 Gọi fetchScores lần đầu
                    fetchScores(studentId, selectedSemesterId);

                    // Thay đổi học kỳ
                    semesterSelect.addEventListener("change", function () {
                        fetchScores(studentId, this.value);
                    });

                    // Hiển thị bảng tổng hạnh kiểm
                    const tongTableBody = document.getElementById("diemtongTableBody");
                    tongTableBody.innerHTML = "";

                    data.semesters.forEach(sem => {
                        const ev = data.evaluations?.[sem.semester_id] || {};
                        const semesterNameParts = sem.semester_name.split(',');
                        const semesterTitle = semesterNameParts[0].trim();
                        const academicYear = semesterNameParts[1].trim();

                        const row = `<tr>
                            <td>${academicYear || "-"}</td>
                            <td>${semesterTitle || "-"}</td>
                            <td>-</td>
                            <td>${ev.academic_performance || "-"}</td>
                            <td>${ev.behavior || "-"}</td>
                            <td>${ev.rating || "-"}</td>
                        </tr>`;
                        tongTableBody.insertAdjacentHTML("beforeend", row);
                    });

                    hideLoading(); // ✅ Ẩn sau khi render dữ liệu đầu tiên
                })
                .catch(error => {
                    console.error("Lỗi khi lấy điểm:", error);
                    hideLoading();
                });
        })
        .catch(error => {
            console.error("Lỗi khi lấy session:", error);
            hideLoading();
        });

    function fetchScores(studentId, semesterId) {
        showLoading(); // 👉 Mỗi lần đổi học kỳ thì hiện loading

        let url = `/database/score-students.php?id=${studentId}&semester=${semesterId}`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                const tbTableBody = document.getElementById("tbTableBody");
                tbTableBody.innerHTML = "";
                let index = 1;

                data.scores.forEach(score => {
                    let rowHTML = `<tr>
                        <td>${index++}</td>
                        <td>${score.subject}</td>
                        <td>${score.oral_test_1 ?? "-"}</td>
                        <td>${score.oral_test_2 ?? "-"}</td>
                        <td>${score.oral_test_3 ?? "-"}</td>
                        <td>${score.quiz_1 ?? "-"}</td>
                        <td>${score.quiz_2 ?? "-"}</td>
                        <td>${score.test_1 ?? "-"}</td>
                        <td>${score.test_2 ?? "-"}</td>
                        <td>${score.final_exam ?? "-"}</td>
                        <td>${score.total_score !== null ? parseFloat(score.total_score).toFixed(2) : "-"}</td>
                    </tr>`;
                    tbTableBody.insertAdjacentHTML("beforeend", rowHTML);
                });

                hideLoading(); // ✅ Ẩn khi đã render điểm
            })
            .catch(error => {
                console.error("Lỗi khi lấy điểm theo học kỳ:", error);
                hideLoading();
            });
    }
});
