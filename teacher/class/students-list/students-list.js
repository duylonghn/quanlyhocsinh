document.addEventListener("DOMContentLoaded", function () {
    // Lấy class_id từ URL
    const urlParams = new URLSearchParams(window.location.search);
    const classId = urlParams.get('class_id'); // Lấy class_id từ URL

    if (!classId) {
        alert("Không tìm thấy class_id trong URL!");
        return;
    }

    showLoading(); // Hiển thị loading khi bắt đầu gọi API

    fetch(`/database/get-students-list.php?class_id=${classId}`)
        .then(response => response.json())
        .then(data => {
            hideLoading(); // Ẩn loading sau khi nhận được dữ liệu

            if (!data.success) {
                alert(data.message || "Lỗi không xác định từ API!");
                return;
            }

            populateTable(data.data);
        })
        .catch(error => {
            hideLoading(); // Ẩn loading trong trường hợp có lỗi
            console.error("Lỗi khi lấy danh sách học sinh:", error);
        });
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

