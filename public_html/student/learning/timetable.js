document.addEventListener("DOMContentLoaded", function () {
    // 🔄 Lấy userId từ session
    fetch("/action/get-session.php")
        .then(response => response.json())
        .then(sessionData => {
            if (!sessionData.user_id) {
                console.error("❌ Lỗi: Không tìm thấy ID trong session.");
                return;
            }

            const userId = sessionData.user_id; // Lấy user_id từ session

            // Hàm để lấy thông tin thời khóa biểu
            function fetchSchedule(semesterId) {
                return fetch(`/database/timetable-students.php?id=${userId}&semesters_id=${semesterId}`)
                    .then(response => response.json())
                    .then(data => {
                        if (!data || typeof data !== "object" || !data.schedule || !Array.isArray(data.schedule)) {
                            console.error('⚠️ Dữ liệu thời khóa biểu không hợp lệ hoặc rỗng.');
                            return null;
                        }
                        return data;
                    })
                    .catch(error => {
                        console.error('❌ Lỗi khi tải thời khóa biểu:', error);
                        return null;
                    });
            }

            // Hàm tạo giao diện lịch trống
            function createSchedule() {
                const dateHeader = document.getElementById("date-header");
                const sangContainer = document.getElementById("sang");
                const chieuContainer = document.getElementById("chieu");

                if (!dateHeader || !sangContainer || !chieuContainer) {
                    console.error("❌ Không tìm thấy phần tử lịch học.");
                    return;
                }

                dateHeader.innerHTML = "";
                sangContainer.innerHTML = "";
                chieuContainer.innerHTML = "";

                const headerRow = document.createElement("div");
                headerRow.classList.add("row");

                const periodHeaderCell = document.createElement("div");
                periodHeaderCell.classList.add("cell", "tiethoc");
                periodHeaderCell.textContent = "Tiết học";
                headerRow.appendChild(periodHeaderCell);

                const daysOfWeek = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
                daysOfWeek.forEach(day => {
                    const dayHeaderCell = document.createElement("div");
                    dayHeaderCell.classList.add("cell", "header");
                    dayHeaderCell.textContent = day;
                    headerRow.appendChild(dayHeaderCell);
                });

                dateHeader.appendChild(headerRow);

                const periods = ["Tiết 1", "Tiết 2", "Tiết 3", "Tiết 4", "Tiết 5", "Tiết 6", "Tiết 7", "Tiết 8", "Tiết 9", "Tiết 10"];
                periods.forEach((period, index) => {
                    const periodRow = document.createElement("div");
                    periodRow.classList.add("row");

                    const periodCell = document.createElement("div");
                    periodCell.classList.add("cell", "tiet");
                    periodCell.textContent = period;
                    periodRow.appendChild(periodCell);

                    daysOfWeek.forEach((_, dayIndex) => {
                        const cell = document.createElement("div");
                        cell.classList.add("cell", "body");
                        cell.id = `period${index + 1}-day${dayIndex + 1}`;
                        cell.style.pointerEvents = "none";
                        periodRow.appendChild(cell);
                    });

                    if (index < 5) {
                        sangContainer.appendChild(periodRow);
                    } else {
                        chieuContainer.appendChild(periodRow);
                    }
                });
            }

            // Hàm hiển thị thời khóa biểu
            function displaySchedule(schedule) {
                // Xóa dữ liệu cũ trước khi hiển thị lịch mới
                document.querySelectorAll(".body").forEach(cell => {
                    cell.innerHTML = "";
                    cell.classList.remove("has-data");
                    cell.style.pointerEvents = "none";
                });

                const dayMapping = { "Thứ 2": 1, "Thứ 3": 2, "Thứ 4": 3, "Thứ 5": 4, "Thứ 6": 5, "Thứ 7": 6 };

                schedule.forEach(entry => {
                    if (!entry.subject || !entry.day_of_week || !entry.period) return;

                    const period = entry.period;
                    const day = dayMapping[entry.day_of_week];

                    if (day && period) {
                        const cellId = `period${period}-day${day}`;
                        const cell = document.getElementById(cellId);
                        if (cell) {
                            cell.innerHTML = `${entry.subject}<br>${entry.teacher_name ?? "Không có GV"}`;
                            cell.classList.add("has-data");
                            cell.style.pointerEvents = "auto";
                        }
                    }
                });
            }

            // Tạo lịch trống ban đầu
            createSchedule();

            // Hàm lấy `semester_id` hiện tại
            function getSemesterId() {
                const currentDate = new Date();
                const currentMonth = currentDate.getMonth() + 1;
                const currentYear = currentDate.getFullYear();
                const lastTwoDigitsCurrentYear = currentYear.toString().slice(-2);
                const lastTwoDigitsNextYear = (currentYear + 1).toString().slice(-2);

                if (currentMonth >= 8 && currentMonth <= 12) {
                    return `1_${lastTwoDigitsCurrentYear}_${lastTwoDigitsNextYear}`;
                } else {
                    const lastTwoDigitsPreviousYear = (currentYear - 1).toString().slice(-2);
                    return `2_${lastTwoDigitsPreviousYear}_${lastTwoDigitsCurrentYear}`;
                }
            }

            // Lấy `semester_id` mặc định
            const defaultSemesterId = getSemesterId();

            // Lấy danh sách kỳ học
            const semesterSelect = document.getElementById("semester");
            fetch(`/database/get-semester.php`)
                .then(response => response.json())
                .then(data => {
                    if (data && Array.isArray(data) && data.length > 0) {
                        data.forEach(semester => {
                            const option = document.createElement("option");
                            option.value = semester.id;
                            option.textContent = semester.name;
                            semesterSelect.appendChild(option);
                        });

                        // Chọn kỳ học mặc định
                        semesterSelect.value = defaultSemesterId;

                        // Tải thời khóa biểu cho kỳ học mặc định
                        fetchSchedule(defaultSemesterId).then(data => {
                            if (data) {
                                displaySchedule(data.schedule);
                            } else {
                                console.log("⚠️ Không có dữ liệu thời khóa biểu.");
                            }
                        });
                    } else {
                        console.log("⚠️ Không tìm thấy danh sách kỳ học.");
                    }
                })
                .catch(() => console.error("❌ Lỗi khi tải danh sách kỳ học."));

            // Xử lý sự kiện thay đổi kỳ học
            semesterSelect.addEventListener("change", function () {
                const semesterId = semesterSelect.value;
                if (semesterId) {
                    displaySchedule([]); // Xóa lịch cũ
                    fetchSchedule(semesterId).then(data => {
                        if (data) {
                            displaySchedule(data.schedule);
                        }
                    });
                }
            });

        })
        .catch(() => console.error("❌ Lỗi khi lấy user_id từ session."));
});
