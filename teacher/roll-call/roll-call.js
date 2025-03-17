document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ Script loaded!");

    const monthTitle = document.getElementById("month-title");
    const monthBody = document.getElementById("month-body");
    let currentDate = new Date();
    const urlParams = new URLSearchParams(window.location.search);
    const teacher_id = urlParams.get("id");

    if (!teacher_id) {
        console.error("❌ Lỗi: Không tìm thấy teacher_id trong URL!");
        return;
    }

    console.log("📌 Teacher ID:", teacher_id);

    generateCalendar(currentDate);
    fetchAttendanceData(currentDate.toISOString().split('T')[0]);

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
                cell.dataset.date = day.toISOString().split('T')[0];
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
                    fetchAttendanceData(this.dataset.date);
                });

                row.appendChild(cell);
                day.setDate(day.getDate() + 1);
            }
            monthBody.appendChild(row);
        }
    }

    function fetchAttendanceData(date) {
        const apiUrl = `/database/rollcall-teacher.php?id=${teacher_id}&date=${date}`;
        console.log("🔄 Fetching attendance data from:", apiUrl);
    
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) throw new Error("Lỗi khi gọi API!");
                return response.json();
            })
            .then(data => {
                console.log("📊 Attendance Data Received:", data);
    
                // ✅ Xử lý bảng lớp chủ nhiệm
                const homeroomTable = document.querySelector(".diemdanh table");
                if (!homeroomTable) {
                    console.error("❌ Lỗi: Không tìm thấy bảng lớp chủ nhiệm!");
                    return;
                }
    
                let homeroomTableBody = homeroomTable.querySelector("tbody");
                if (!homeroomTableBody) {
                    homeroomTableBody = document.createElement("tbody");
                    homeroomTable.appendChild(homeroomTableBody);
                }
                homeroomTableBody.innerHTML = "";
    
                // ✅ Chọn lớp đầu tiên làm lớp chủ nhiệm
                let homeroomClass = data.length > 0 ? data[0] : null;
    
                if (homeroomClass) {
                    let row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${homeroomClass.class_id || '-'}</td>
                        <td>${homeroomClass.class_name || '-'}</td>
                        <td>${homeroomClass.student_count || '0'}</td>
                        <td>${homeroomClass.attended_count || '0'} / ${homeroomClass.student_count || '0'}</td>
                    `;
                    homeroomTableBody.appendChild(row);
                } else {
                    homeroomTableBody.innerHTML = `<tr><td colspan="4">Không có dữ liệu lớp chủ nhiệm</td></tr>`;
                }
    
                // ✅ Xử lý bảng sinh viên chưa điểm danh
                const absentTable = document.querySelector(".chuadiemdanh table tbody");
                if (!absentTable) {
                    console.error("❌ Lỗi: Không tìm thấy bảng sinh viên chưa điểm danh!");
                    return;
                }
                absentTable.innerHTML = "";
    
                let hasAbsentStudents = false;
    
                data.forEach(classData => {
                    if (Array.isArray(classData.absent_students) && classData.absent_students.length > 0) {
                        hasAbsentStudents = true;
                        classData.absent_students.forEach(student => {
                            let row = `<tr>
                                <td>${student.student_id}</td>
                                <td>${student.fullname}</td>
                                <td>${classData.class_name}</td>
                                <td>Vắng</td>
                                <td>${student.status ?? "Chưa có dữ liệu"}</td>
                            </tr>`;
                            absentTable.innerHTML += row;
                        });
                    }
                });
    
                if (!hasAbsentStudents) {
                    absentTable.innerHTML = `<tr><td colspan="5">✅ Tất cả sinh viên đã điểm danh</td></tr>`;
                }
            })
            .catch(error => console.error("❌ Fetch error:", error));
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
