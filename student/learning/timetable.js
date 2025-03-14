console.log("JS file loaded successfully!");

const periods = ["Tiết 1", "Tiết 2", "Tiết 3", "Tiết 4", "Tiết 5", "Tiết 6", "Tiết 7", "Tiết 8", "Tiết 9", "Tiết 10"];
const daysOfWeek = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];

// Hàm tạo bảng thời khóa biểu
function createSchedule() {
    const dateHeader = document.getElementById("date-header");
    const sangContainer = document.getElementById("sang");
    const chieuContainer = document.getElementById("chieu");

    // Tạo tiêu đề ngày trong tuần
    const headerRow = document.createElement("div");
    headerRow.classList.add("row");

    const periodHeaderCell = document.createElement("div");
    periodHeaderCell.classList.add("cell", "tiethoc");
    periodHeaderCell.textContent = "Tiết học";
    headerRow.appendChild(periodHeaderCell);

    daysOfWeek.forEach((day) => {
        const dayHeaderCell = document.createElement("div");
        dayHeaderCell.classList.add("cell", "header");
        dayHeaderCell.textContent = day;
        headerRow.appendChild(dayHeaderCell);
    });

    dateHeader.appendChild(headerRow);

    // Tạo các ô trống cho thời khóa biểu
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
            cell.id = `period${index + 1}-day${dayIndex + 1}`; // dayIndex + 2 vì thứ 2 bắt đầu từ 2
            periodRow.appendChild(cell);
        });

        if (index < 5) {
            sangContainer.appendChild(periodRow);
        } else {
            chieuContainer.appendChild(periodRow);
        }
    });
}

// Hàm lấy dữ liệu thời khóa biểu từ server
function fetchSchedule() {
    fetch("/database/data-timetable.php")
        .then(response => response.json())
        .then(data => {
            console.log("📌 Dữ liệu API nhận được:", data);

            if (!Array.isArray(data)) {
                console.error("🚨 Lỗi: API không trả về mảng dữ liệu!");
                return;
            }

            // Bản đồ chuyển đổi `start_time` → `period`
            const periodMapping = {
                "07:00:00": 1, "07:55:00": 2, "08:50:00": 3,
                "09:45:00": 4, "10:40:00": 5, "13:00:00": 6,
                "13:55:00": 7, "14:50:00": 8, "15:45:00": 9,
                "16:40:00": 10
            };

            const dayMapping = {
                "Thứ 2": 1, "Thứ 3": 2, "Thứ 4": 3,
                "Thứ 5": 4, "Thứ 6": 5, "Thứ 7": 6, "Chủ nhật": 7
            };

            data.forEach(entry => {
                const period = periodMapping[entry.start_time] ?? "❌";
                const day = dayMapping[entry.day_of_week] ?? "❌";

                console.log(`👉 Chuyển đổi: start_time=${entry.start_time} → period=${period}, day_of_week=${entry.day_of_week} → day=${day}`);

                const cellId = `period${period}-day${day}`;
                console.log(`✅ Đang tìm ô: ${cellId}`);

                const cell = document.getElementById(cellId);
                if (cell) {
                    const teacherName = entry.teacher ?? "Không có GV"; // Nếu không có, hiển thị mặc định
                    cell.innerHTML = `${entry.subject}<br>${entry.teacher_name}`;
                    cell.classList.add("has-data");
                } else {
                    console.warn(`🚨 Không tìm thấy ô: ${cellId}`);
                }
            });
        })
        .catch(error => console.error("Lỗi khi fetch dữ liệu:", error));
}
// Khởi tạo lịch học và lấy dữ liệu
document.addEventListener("DOMContentLoaded", function () {
    createSchedule();
    fetchSchedule();
});
