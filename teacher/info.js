document.addEventListener("DOMContentLoaded", function () {
    // Lấy `teacher_id` từ URL
    const urlParams = new URLSearchParams(window.location.search);
    const teacherId = urlParams.get("id");

    if (!teacherId || isNaN(teacherId)) {
        alert("Không tìm thấy hoặc ID giáo viên không hợp lệ!");
        return;
    }

    // Gọi API lấy thông tin giáo viên
    fetch(`/database/info-teacher.php?teacher_id=${teacherId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Lỗi HTTP: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                alert(data.error);
            } else {
                document.getElementById("fullname").textContent = data.fullname || "N/A";
                document.getElementById("msv").textContent = data.id || "N/A";
                document.getElementById("sex").textContent = data.sex || "N/A";
                document.getElementById("class").textContent = data.class_id || "N/A";
                document.getElementById("course").textContent = data.course || "N/A";
                document.getElementById("phone").value = data.phone || "";
                document.getElementById("email").value = data.email || "";
                document.getElementById("CCCD").value = data.cccd || "";
                document.getElementById("nation").value = data.nation || "";
                document.getElementById("religion").value = data.religion || "";
                document.getElementById("birthplace").value = data.birthplace || "";
                document.getElementById("address").value = data.address || "";
            }
        })
        .catch(error => console.error("Lỗi khi lấy dữ liệu giáo viên:", error));
});
