document.addEventListener("DOMContentLoaded", function () {
    // Lấy teacher_id từ session
    fetch("/action/get-session.php")
        .then(response => response.json())
        .then(sessionData => {
            if (!sessionData.user_id || isNaN(sessionData.user_id)) {
                alert("Không tìm thấy ID giáo viên hoặc ID không hợp lệ!");
                return;
            }
            const teacherId = sessionData.user_id;

            fetch(`/database/get-students-list.php?teacher_id=${teacherId}`)
                .then(response => response.json())
                .then(data => {

                    if (!data.success) {
                        alert(data.message || "Lỗi không xác định từ API!");
                        return;
                    }

                    populateTable(data.data);
                })
                .catch(error => console.error("Lỗi khi lấy danh sách lớp:", error));
        })
        .catch(() => console.error("Lỗi khi lấy teacher_id từ session."));
});

function populateTable(students) {
    const tableBody = document.querySelector(".info-table tbody");
    if (!tableBody) {
        console.error("Không tìm thấy bảng hiển thị!");
        return;
    }

    tableBody.innerHTML = "";

    if (students.length === 0) {
        tableBody.innerHTML = "<tr><td colspan='12'>Không có học sinh nào</td></tr>";
        return;
    }

    students.forEach((student, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${student.id || "N/A"}</td>
            <td>${student.fullname || "N/A"}</td>
            <td>${student.sex || "N/A"}</td>
            <td>${student.class_id || "N/A"}</td>
            <td>${student.course || "N/A"}</td>
            <td>${student.phone || "N/A"}</td>
            <td>${student.email || "N/A"}</td>
            <td>${student.address || "N/A"}</td>
            <td>${student.parent_name || "N/A"}</td>
            <td>${student.phone_number || "N/A"}</td>
            <td>${student.relationship || "N/A"}</td>
        `;
        tableBody.appendChild(row);
    });
}
