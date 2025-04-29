document.addEventListener("DOMContentLoaded", async function () {
    console.log("✅ Script loaded!");

    const monthTitle = document.getElementById("month-title");
    const monthBody = document.getElementById("month-body");
    const homeroomClassTable = document.querySelector(".diemdanh table tbody");
    const absentStudentsTable = document.querySelector(".chuadiemdanh tbody");
    let currentDate = new Date();

    // ✅ Hàm lấy user_id từ session
    async function getUserIdFromSession() {
        try {
            const response = await fetch("/action/get-session.php");
            if (!response.ok) throw new Error(`Lỗi HTTP! Mã: ${response.status}`);

            const sessionData = await response.json();
            if (!sessionData.user_id || isNaN(sessionData.user_id)) {
                throw new Error("Không tìm thấy user_id trong session hoặc ID không hợp lệ!");
            }

            console.log("📌 User ID từ session:", sessionData.user_id);
            return sessionData.user_id;
        } catch (error) {
            console.error("❌ Lỗi khi lấy user_id từ session:", error);
            return null;
        }
    }

    const userId = await getUserIdFromSession();
    if (!userId) {
        console.error("❌ Không tìm thấy user_id, dừng xử lý!");
        return;
    }

    generateCalendar(currentDate);
    fetchAttendanceData(currentDate, userId); // Truyền ngày đã được chỉnh sửa

    // Hàm generateCalendar để truyền ngày theo định dạng dd_mm_yy
    function generateCalendar(date) {
        console.log("📆 Generating calendar for:", date.toISOString().split('T')[0]);
        monthBody.innerHTML = "";
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        monthTitle.textContent = `Tháng ${date.getMonth() + 1} - ${date.getFullYear()}`;

        let day = new Date(firstDay);
        day.setDate(day.getDate() - (firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1));

        while (day <= lastDay || day.getDay() !== 1) {
            let row = document.createElement("tr");
            for (let i = 0; i < 7; i++) {
                let cell = document.createElement("td");
                cell.textContent = day.getDate();
                cell.dataset.date = formatDateToURL(day);  // Chuyển ngày thành định dạng dd_mm_yy
                cell.classList.add("calendar-day");

                if (day.getMonth() !== date.getMonth()) {
                    cell.classList.add("other-month", "gray-text");
                }
                if (day.toDateString() === new Date().toDateString()) {
                    cell.classList.add("selected-day");
                }

                cell.addEventListener("click", function () {
                    console.log("📅 Clicked date:", this.dataset.date);
                    document.querySelectorAll(".selected-day").forEach(el => el.classList.remove("selected-day"));
                    this.classList.add("selected-day");

                    // Debugging the selected date
                    console.log("Selected Date (Dataset):", this.dataset.date);

                    const parsedDate = parseDateFromURL(this.dataset.date);
                    fetchAttendanceData(parsedDate, userId); // Gửi ngày đã chọn
                });

                row.appendChild(cell);
                day.setDate(day.getDate() + 1);
            }
            monthBody.appendChild(row);
        }
    }

    // Chuyển đổi ngày sang định dạng dd_mm_yy
    function formatDateToURL(date) {
        let day = String(date.getDate()).padStart(2, '0');  // Đảm bảo ngày có 2 chữ số
        let month = String(date.getMonth() + 1).padStart(2, '0');  // Đảm bảo tháng có 2 chữ số
        let year = String(date.getFullYear()).slice(-2);  // Lấy 2 số cuối của năm
        return `${day}_${month}_${year}`;
    }

    // Chuyển đổi định dạng dd_mm_yy thành yyyy-mm-dd cho đối tượng Date
    function parseDateFromURL(dateString) {
        const [day, month, year] = dateString.split('_');
        return new Date(`20${year}-${month}-${day}`);
    }

    function fetchAttendanceData(date, teacherId) {
        const formattedDate = formatDateToURL(date);  // Định dạng ngày
        const apiUrl = `/database/rollcall-teacher.php?teacher_id=${teacherId}&date=${formattedDate}`;
        console.log("🔄 Fetching attendance data from:", apiUrl);
    
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) throw new Error("Lỗi khi gọi API!");  // Nếu có lỗi khi gọi API
                return response.json();
            })
            .then(data => {
                console.log("📊 Attendance Data Received:", data);
                if (data.length === 0 || !data[0].students) {  // Nếu không có sinh viên hoặc dữ liệu trống
                    displayNoAttendanceData();  // Hiển thị dữ liệu "Không có điểm danh"
                } else {
                    displayAttendanceData(data);  // Hiển thị dữ liệu điểm danh nếu có
                }
            })
            .catch(error => {
                console.error("❌ Fetch error:", error);
                displayNoAttendanceData();  // Hiển thị dữ liệu mặc định khi có lỗi
            });
    }
    
    function displayNoAttendanceData() {
        // Hiển thị bảng lớp chủ nhiệm với các giá trị mặc định (0)
        homeroomClassTable.innerHTML = ` 
            <tr>
                <td>-</td>
                <td>-</td>
                <td>0</td>
                <td>0 / 0</td>
            </tr>
        `;
        
        // Làm sạch bảng sinh viên vắng mặt
        absentStudentsTable.innerHTML = '<tr><td colspan="5">Chưa đến ngày điểm danh</td></tr>';
    }

    function displayAttendanceData(data) {
        absentStudentsTable.innerHTML = ''; // Làm sạch bảng trước khi hiển thị dữ liệu mới
    
        // Hiển thị bảng Lớp chủ nhiệm
        const homeroomClassData = data[0]; // Giả sử dữ liệu lớp chủ nhiệm nằm ở phần tử đầu tiên của mảng
        if (homeroomClassData) {
            const totalStudents = homeroomClassData.students.length; // Đếm tổng số sinh viên
            const attendedCount = homeroomClassData.students.filter(student => student.status !== 'Vắng').length; // Đếm sinh viên đã điểm danh (không phải 'Vắng')
    
            const row = homeroomClassTable.querySelector('tr'); // Lấy dòng đầu tiên để cập nhật
            row.innerHTML = `
                <td>${homeroomClassData.class_id}</td>
                <td>${homeroomClassData.class_name}</td>
                <td>${totalStudents}</td>
                <td>${attendedCount} / ${totalStudents}</td>
            `;
        }
    
        if (data[0] && data[0].students && data[0].students.length > 0) {
            data[0].students.forEach(student => {
                const row = document.createElement("tr");
    
                // Kiểm tra notification_status có giá trị 'Đã gửi' hoặc 'Chưa gửi'
                const note = (student.notification_status === 'Đã gửi') ? 'Đã gửi' : 'Chưa gửi';
    
                row.innerHTML = `
                    <td>${student.student_id}</td>
                    <td>${student.fullname}</td>
                    <td>${data[0].class_name}</td>
                    <td>${student.status}</td>
                    <td>${note}</td>
                `;
                absentStudentsTable.appendChild(row);
            });
        } else {
            absentStudentsTable.innerHTML = '<tr><td colspan="5">✅ Tất cả sinh viên đã điểm danh</td></tr>';
        }
    }    

    window.prevMonth = function () {
        console.log("⏪ Previous month clicked");
        currentDate.setMonth(currentDate.getMonth() - 1);
        generateCalendar(currentDate);
    };

    window.nextMonth = function () {
        console.log("⏩ Next month clicked");
        currentDate.setMonth(currentDate.getMonth() + 1);
        generateCalendar(currentDate);
    };
});
