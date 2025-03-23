document.addEventListener("DOMContentLoaded", function () {
    document.body.style.userSelect = "none"; // Ngăn chặn trỏ nháy trên toàn bộ trang
    
    const attendanceDates = document.querySelectorAll("#attendance-dates th:nth-child(n+2)");
    const monthTitle = document.getElementById("month-title");
    const monthBody = document.getElementById("month-body");
    
    let currentDate = new Date();
    updateAttendanceTable(currentDate);
    generateCalendar(currentDate);

    function updateAttendanceTable(date) {
        let weekStart = new Date(date);
        weekStart.setDate(date.getDate() - (date.getDay() === 0 ? 6 : date.getDay() - 1));
        
        attendanceDates.forEach((td, index) => {
            let day = new Date(weekStart);
            day.setDate(weekStart.getDate() + index);
            td.textContent = day.getDate() + "/" + (day.getMonth() + 1);
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
                    let selectedDate = new Date(this.dataset.date);
                    if (selectedDate.getMonth() !== date.getMonth()) {
                        currentDate = selectedDate;
                        generateCalendar(currentDate);
                    }
                    updateAttendanceTable(selectedDate);
                });

                row.appendChild(cell);
                day.setDate(day.getDate() + 1);
            }
            monthBody.appendChild(row);
        }
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
