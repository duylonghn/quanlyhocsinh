document.addEventListener("DOMContentLoaded", function () {
    const semesterSelect = document.getElementById("semester");

    // Lấy studentId từ session
    fetch('/action/get-session.php')
        .then(response => response.json())
        .then(sessionData => {
            if (!sessionData.user_id) {
                console.error("Lỗi: Không tìm thấy ID trong session.");
                return;
            }

            const studentId = sessionData.user_id; // Lấy ID từ session
            fetchData(studentId); // Gọi dữ liệu lần đầu

            // Lắng nghe sự kiện thay đổi học kỳ
            semesterSelect.addEventListener("change", function () {
                fetchData(studentId, this.value);
            });
        })
        .catch(error => console.error("Lỗi khi lấy session:", error));

    function fetchData(studentId, semesterId = null) {
        let url = `/database/score-students.php?id=${studentId}`;
        if (semesterId) {
            url += `&semester=${semesterId}`;
        }

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    console.error("Lỗi:", data.error);
                    return;
                }

                // Hiển thị thông tin học sinh
                if (data.student_info) {
                    document.getElementById("fullname").innerText = data.student_info.fullname || "N/A";
                    document.getElementById("msv").innerText = data.student_info.student_id || "N/A";
                    document.getElementById("course").innerText = data.student_info.course || "N/A";
                    document.getElementById("class").innerText = data.student_info.class || "N/A";
                    document.getElementById("school").innerText = data.student_info.school || "N/A";
                }

                // Hiển thị danh sách học kỳ (chỉ khi chưa có học kỳ nào)
                if (!semesterId) {
                    semesterSelect.innerHTML = ""; // Xóa options cũ
                    data.semesters.forEach((sem, index) => {
                        let option = document.createElement("option");
                        option.value = sem.semester_id;
                        option.innerText = sem.semester_name;
                        semesterSelect.appendChild(option);

                        // Chọn học kỳ đầu tiên mặc định
                        if (index === 0) {
                            semesterId = sem.semester_id;
                        }
                    });
                }

                // Hiển thị điểm số
                const tbTableBody = document.getElementById("tbTableBody");
                tbTableBody.innerHTML = ""; // Xóa dữ liệu cũ
                let index = 1;
                let rowHTML = "";

                data.scores.forEach(score => {
                    rowHTML += `<tr>
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
                });

                tbTableBody.insertAdjacentHTML("beforeend", rowHTML);
            })
            .catch(error => console.error("Lỗi khi fetch dữ liệu:", error));
    }
});
