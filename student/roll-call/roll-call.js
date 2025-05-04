document.addEventListener("DOMContentLoaded", function () {
    document.body.style.userSelect = "none"; // Ngăn chặn trỏ nháy trên toàn bộ trang

    const attendanceDates = document.querySelectorAll("#attendance-dates th:nth-child(n+2)");
    const statusCells = document.querySelectorAll("tbody tr:nth-child(1) td:nth-child(n+2)");
    const timeCells = document.querySelectorAll("tbody tr:nth-child(2) td:nth-child(n+2)");

    const monthTitle = document.getElementById("month-title");
    const monthBody = document.getElementById("month-body");

    let currentDate = new Date();
    let studentId = null;

    console.log("📦 Đang tải session...");
    fetch('/action/get-session.php')
        .then(response => response.json())
        .then(sessionData => {
            console.log("✅ Session nhận được:", sessionData);
            if (!sessionData.user_id) {
                console.error("❌ Lỗi: Không tìm thấy user_id trong session.");
                return;
            }

            studentId = sessionData.user_id;
            console.log("🎯 Đang lấy điểm danh cho user_id:", studentId);
            updateAttendanceTable(currentDate);
            generateCalendar(currentDate);
            fetchAndRenderAttendance(studentId, currentDate);
        })
        .catch(err => console.error("❌ Lỗi khi lấy session:", err));

    function updateAttendanceTable(date) {
        let weekStart = getStartOfWeek(date);
        console.log("🗓️ Ngày bắt đầu tuần:", weekStart);

        attendanceDates.forEach((td, index) => {
            let day = new Date(weekStart);
            day.setDate(weekStart.getDate() + index);
            td.textContent = day.getDate() + "/" + (day.getMonth() + 1);
        });

        console.log("📅 Đã cập nhật hàng ngày trong bảng tuần.");
    }

    function getStartOfWeek(date) {
        const d = new Date(date);
        const day = d.getDay();
        const diff = day === 0 ? -6 : 1 - day;
        d.setDate(d.getDate() + diff);
        d.setHours(0, 0, 0, 0);
        return d;
    }

    function fetchAndRenderAttendance(studentId, date) {
        let weekStart = getStartOfWeek(date);
        weekStart.setDate(weekStart.getDate() + 1); // Đảm bảo tuần bắt đầu từ thứ Hai
        let startDate = weekStart.toISOString().split('T')[0];
    
        console.log("📡 Gọi API:", `/../../database/rollcall-student.php?student_id=${studentId}&start_date=${startDate}`);
    
        fetch(`/../../database/rollcall-student.php?student_id=${studentId}&start_date=${startDate}`)
            .then(res => res.json())
            .then(data => {
                console.log("📥 Dữ liệu điểm danh nhận được:", data);
    
                const statusMap = {
                    "fail": "Vắng",
                    "done": "Đúng giờ",
                    "late": "Muộn",
                    "licensed": "Có phép"
                };
    
                for (let i = 0; i < 7; i++) {
                    let current = new Date(weekStart);
                    current.setDate(weekStart.getDate() + i);
                    let key = current.toISOString().split('T')[0];
                    let records = data[key] || [];
                
                    if (statusCells[i]) {
                        statusCells[i].textContent = "";
                        statusCells[i].classList.remove("late-status", "on-time-status", "absent-status", "licensed-status");
                    }
                
                    if (timeCells[i]) {
                        timeCells[i].textContent = "";
                    }
                
                    if (records.length === 0) {
                        console.log(`📭 Không có dữ liệu cho ngày ${key}`);
                    }
                
                    records.forEach(record => {
                        const status = statusMap[record.status] || record.status;
                        const time = record.time ? record.time : "";
                
                        if (statusCells[i]) {
                            statusCells[i].textContent = status;
                
                            if (status === "Muộn") {
                                statusCells[i].classList.add("late-status");
                            } else if (status === "Đúng giờ") {
                                statusCells[i].classList.add("on-time-status");
                            } else if (status === "Vắng") {
                                statusCells[i].classList.add("absent-status");
                            } else if (status === "Có phép") {
                                statusCells[i].classList.add("licensed-status");
                            }
                        }
                
                        if (timeCells[i]) {
                            timeCells[i].textContent = time;
                        }
                
                        console.log(`✅ ${key}: ${status} - ${time}`);
                    });
                }                
            })
            .catch(err => {
                console.error("❌ Lỗi khi lấy dữ liệu điểm danh:", err);
            });
    }

    function generateCalendar(date) {
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
                    cell.classList.add("other-month");
                    cell.style.color = "gray";
                }
                if (day.toDateString() === currentDate.toDateString()) {
                    cell.classList.add("selected-day");
                }

                cell.addEventListener("click", function () {
                    document.querySelectorAll(".selected-day").forEach(el => el.classList.remove("selected-day"));
                    this.classList.add("selected-day");
                
                    let selectedDateStr = this.dataset.date;
                    let [year, month, day] = selectedDateStr.split("-").map(Number);
                    let selectedDate = new Date(year, month - 1, day + 1);
                    selectedDate.setHours(0, 0, 0, 0);
                    currentDate = new Date(selectedDate);
                    generateCalendar(currentDate);
                    updateAttendanceTable(selectedDate);
                    if (studentId) {
                        fetchAndRenderAttendance(studentId, selectedDate);
                    }
                });                 

                row.appendChild(cell);
                day.setDate(day.getDate() + 1);
            }
            monthBody.appendChild(row);
        }

        console.log("📆 Đã vẽ lại lịch tháng.");
    }

    window.prevMonth = function () {
        currentDate.setMonth(currentDate.getMonth() - 1);
        generateCalendar(currentDate);
    };

    window.nextMonth = function () {
        currentDate.setMonth(currentDate.getMonth() + 1);
        generateCalendar(currentDate);
    };
});
