document.addEventListener("DOMContentLoaded", async function () {
    console.log("✅ Script loaded!");

    const monthTitle = document.getElementById("month-title");
    const monthBody = document.getElementById("month-body");
    const homeroomClassTable = document.querySelector(".diemdanh table tbody");
    const absentStudentsTable = document.querySelector(".chuadiemdanh tbody");
    let currentDate = new Date();
    let selectedDate = currentDate;  // ✅ Biến mới để lưu ngày được chọn

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
    fetchAttendanceData(currentDate, userId);

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
                cell.dataset.date = formatDateToURL(day);
                cell.classList.add("calendar-day");

                if (day.getMonth() !== date.getMonth()) {
                    cell.classList.add("other-month", "gray-text");
                }
                if (day.toDateString() === new Date().toDateString()) {
                    cell.classList.add("selected-day");
                }

                cell.addEventListener("click", function () {
                    document.querySelectorAll(".selected-day").forEach(el => el.classList.remove("selected-day"));
                    this.classList.add("selected-day");

                    const parsedDate = parseDateFromURL(this.dataset.date);
                    selectedDate = parsedDate;  // ✅ Cập nhật ngày được chọn
                    fetchAttendanceData(parsedDate, userId);
                });

                row.appendChild(cell);
                day.setDate(day.getDate() + 1);
            }
            monthBody.appendChild(row);
        }
    }

    function formatDateToURL(date) {
        let day = String(date.getDate()).padStart(2, '0');
        let month = String(date.getMonth() + 1).padStart(2, '0');
        let year = String(date.getFullYear()).slice(-2);
        return `${day}_${month}_${year}`;
    }

    function parseDateFromURL(dateString) {
        const [day, month, year] = dateString.split('_');
        return new Date(`20${year}-${month}-${day}`);
    }

    function fetchAttendanceData(date, teacherId) {
        const formattedDate = formatDateToURL(date);
        const apiUrl = `/database/rollcall-teacher.php?teacher_id=${teacherId}&date=${formattedDate}`;
        console.log("🔄 Fetching attendance data from:", apiUrl);

        showLoading();

        fetch(apiUrl)
            .then(response => {
                if (!response.ok) throw new Error("Lỗi khi gọi API!");
                return response.json();
            })
            .then(data => {
                hideLoading();
                console.log("📊 Attendance Data Received:", data);
                if (!data || !data.students) {
                    displayNoAttendanceData();
                } else {
                    displayAttendanceData(data);
                }
            })
            .catch(error => {
                hideLoading();
                console.error("❌ Fetch error:", error);
                displayNoAttendanceData();
            });
    }

    function displayNoAttendanceData() {
        homeroomClassTable.innerHTML = `
            <tr>
                <td>-</td>
                <td>-</td>
                <td>0</td>
                <td>0 / 0</td>
            </tr>
        `;
        absentStudentsTable.innerHTML = '<tr><td colspan="5">Không có thông tin điểm danh (Hoặc là ngày nghỉ)</td></tr>';
    }

    function displayAttendanceData(data) {
        absentStudentsTable.innerHTML = '';
        const homeroomClassData = data;

        if (homeroomClassData) {
            const totalStudents = homeroomClassData.students.length;
            const attendedCount = homeroomClassData.students.filter(student => student.status !== 'Vắng').length;

            const row = homeroomClassTable.querySelector('tr') || document.createElement('tr');
            row.innerHTML = `
                <td>${homeroomClassData.class_id}</td>
                <td>${homeroomClassData.class_id}</td>
                <td>${totalStudents}</td>
                <td>${attendedCount} / ${totalStudents}</td>
            `;
            if (!homeroomClassTable.contains(row)) homeroomClassTable.appendChild(row);
        }

        if (data && data.students && data.students.length > 0) {
            const formattedDate = formatDateToURL(selectedDate);  // ✅ Sử dụng ngày đã chọn

            data.students.forEach(student => {
                if (student.status === 'Đúng giờ') return;

                const row = document.createElement("tr");
                const statusOptions = ['Vắng', 'Có phép', 'Đúng giờ', 'Muộn'];
                let optionsHtml = statusOptions.map(option => `
                    <option value="${option}" ${student.status === option ? 'selected' : ''}>${option}</option>
                `).join('');

                const note = (student.notification_status === 'Đã gửi') ? 'Đã gửi' : 'Chưa gửi';

                row.innerHTML = `
                    <td>${student.student_id}</td>
                    <td>${student.fullname}</td>
                    <td>${homeroomClassData.class_id}</td>
                    <td>
                        <select class="status-select" data-student-id="${student.student_id}">
                            ${optionsHtml}
                        </select>
                    </td>
                    <td>${note}</td>
                `;

                absentStudentsTable.appendChild(row);

                row.querySelector(".status-select").addEventListener("change", function () {
                    const newStatus = this.value;
                    const studentId = this.dataset.studentId;
                    updateStudentStatus(studentId, newStatus, formattedDate);
                });
            });
        } else {
            absentStudentsTable.innerHTML = '<tr><td colspan="5">✅ Tất cả sinh viên đã điểm danh</td></tr>';
        }
    }

    function updateStudentStatus(studentId, status, date) {
        const payload = {
            student_id: studentId,
            status: status,
            date: date
        };

        console.log("🛠️ Dữ liệu gửi cập nhật:", payload);

        fetch('/action/update-status.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
        .then(response => {
            if (!response.ok) throw new Error("Cập nhật thất bại!");
            return response.json();
        })
        .then(result => {
            console.log("✅ Trạng thái cập nhật:", result);
            alert("✅ Cập nhật thành công!");
        })
        .catch(error => {
            console.error("❌ Lỗi cập nhật trạng thái:", error);
            alert("❌ Lỗi khi cập nhật trạng thái!");
        });
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
