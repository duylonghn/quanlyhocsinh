document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get("id");

    if (!userId) return; // Chỉ chạy nếu có user_id

    // Hàm để lấy thông tin thời khóa biểu
    function fetchSchedule(semesterId) {
        return fetch(`/database/timetable-students.php?id=${userId}&semester_id=${semesterId}`)
            .then(response => {
                return response.json();
            })
            .then(data => {
                if (!data || typeof data !== "object" || !data.schedule || !Array.isArray(data.schedule)) {
                    console.error('Invalid data format or empty schedule.');
                    return null;
                }
                return data;
            })
            .catch(error => {
                console.error('Error fetching schedule:', error);
                return null;
            });
    }

    // Hàm để tạo giao diện lịch trống
    function createSchedule() {
        const dateHeader = document.getElementById("date-header");
        const sangContainer = document.getElementById("sang");
        const chieuContainer = document.getElementById("chieu");

        if (!dateHeader || !sangContainer || !chieuContainer) return;

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
        daysOfWeek.forEach((day) => {
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

    // Hàm để hiển thị thời khóa biểu
    function displaySchedule(schedule) {
        // Reset (xóa) tất cả các ô lịch học trước khi hiển thị lịch mới
        const allCells = document.querySelectorAll(".body");
        allCells.forEach(cell => {
            cell.innerHTML = ""; // Xóa nội dung ô
            cell.classList.remove("has-data"); // Xóa class "has-data"
            cell.style.pointerEvents = "none"; // Vô hiệu hóa các sự kiện của ô
        });

        const dayMapping = {
            "Thứ 2": 1, "Thứ 3": 2, "Thứ 4": 3,
            "Thứ 5": 4, "Thứ 6": 5, "Thứ 7": 6
        };

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
                    cell.style.pointerEvents = "auto"; // Kích hoạt sự kiện chuột
                }
            }
        });
    }

    // Tạo lịch trống ban đầu
    createSchedule();

    // Hàm tính toán và trả về semester_id
    function getSemesterId() {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1; // Tháng hiện tại (1-12)
        const currentYear = currentDate.getFullYear(); // Năm hiện tại
        const lastTwoDigitsCurrentYear = currentYear.toString().slice(-2); // 2 chữ số cuối của năm hiện tại
        const lastTwoDigitsNextYear = (currentYear + 1).toString().slice(-2); // 2 chữ số cuối của năm tiếp theo

        if (currentMonth >= 8 && currentMonth <= 12) {
            // Kỳ 1, năm hiện tại và năm tiếp theo
            return `1_${lastTwoDigitsCurrentYear}_${lastTwoDigitsNextYear}`;
        } else {
            // Kỳ 2, năm trước và năm hiện tại
            const lastTwoDigitsPreviousYear = (currentYear - 1).toString().slice(-2); // 2 chữ số cuối của năm trước
            return `2_${lastTwoDigitsPreviousYear}_${lastTwoDigitsCurrentYear}`;
        }
    }

    // Lấy semester_id mặc định
    const defaultSemesterId = getSemesterId();

    // Lấy danh sách kỳ học từ server và chọn kỳ học mặc định
    const semesterSelect = document.getElementById("semester");
    fetch(`/database/get-semester.php`)
        .then(response => {
            return response.json();
        })
        .then(data => {

            if (data && Array.isArray(data) && data.length > 0) {  // Kiểm tra dữ liệu có mảng không rỗng
                data.forEach(semester => {
                    const option = document.createElement("option");
                    option.value = semester.id;  // Sử dụng id của kỳ học (ví dụ: 1_24_25)
                    option.textContent = semester.name;  // Sử dụng name của kỳ học
                    semesterSelect.appendChild(option);
                });

                // Chọn kỳ học mặc định
                semesterSelect.value = defaultSemesterId; // Chọn kỳ học mặc định

                // Tải thời khóa biểu cho kỳ học mặc định
                fetchSchedule(defaultSemesterId).then(data => {
                    if (data) {
                        displaySchedule(data.schedule);
                    } else {
                        console.log('No data returned for the selected semester.');
                    }
                });
            } else {
                console.log('No semesters found in response or invalid data format.');
            }
        })
        .catch(() => console.error("Không thể tải danh sách kỳ học"));

    // Lắng nghe sự kiện thay đổi kỳ học
    semesterSelect.addEventListener("change", function () {
        const semesterId = semesterSelect.value;
        if (semesterId) {
            // Xóa tất cả các ô trước khi tải dữ liệu mới
            displaySchedule([]); // Gọi lại để xóa hết dữ liệu cũ

            fetchSchedule(semesterId).then(data => {
                if (data) {
                    displaySchedule(data.schedule);
                }
            });
        }
    });
});
