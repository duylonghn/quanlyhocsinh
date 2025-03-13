const periods = ["Tiết 1", "Tiết 2", "Tiết 3", "Tiết 4", "Tiết 5", "Tiết 6", "Tiết 7", "Tiết 8", "Tiết 9", "Tiết 10"];
const daysOfWeek = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"];

// Tạo nội dung cho header và lịch học
function createSchedule() {
    const dateHeader = document.getElementById('date-header');
    const sangContainer = document.getElementById('sang');
    const chieuContainer = document.getElementById('chieu');

    // Tạo tiêu đề ngày trong tuần
    const headerRow = document.createElement('div');
    headerRow.classList.add('row');

    // Tạo ô tiêu đề cho tiết học
    const periodHeaderCell = document.createElement('div');
    periodHeaderCell.classList.add('cell', 'tiethoc');
    periodHeaderCell.textContent = 'Tiết học';
    headerRow.appendChild(periodHeaderCell);

    // Tạo các ô tiêu đề ngày trong tuần
    daysOfWeek.forEach(day => {
        const dayHeaderCell = document.createElement('div');
        dayHeaderCell.classList.add('cell', 'header');
        dayHeaderCell.textContent = day;
        headerRow.appendChild(dayHeaderCell);
    });

    // Thêm hàng tiêu đề vào date-header
    dateHeader.appendChild(headerRow);

    // Tạo các hàng cho tiết học
    periods.forEach((period, index) => {
        // Tạo hàng cho tiết học
        const periodRow = document.createElement('div');
        periodRow.classList.add('row');

        // Thêm ô cho tiết học
        const periodCell = document.createElement('div');
        periodCell.classList.add('cell', 'tiet');
        periodCell.textContent = period;
        periodRow.appendChild(periodCell);

        // Thêm các ô cho từng ngày trong tuần cho Buổi sáng và Buổi chiều
        daysOfWeek.forEach((day, dayIndex) => {
            const cell = document.createElement('div');
            cell.classList.add('cell', 'body');
            
            // Tạo ID cho từng ô theo định dạng period-day
            const periodNumber = index + 1; // Tiết từ 1 đến 10
            const sessionNumber = dayIndex + 1; // Ngày trong tuần từ 1 đến 7
            cell.id = `period${periodNumber}-day${sessionNumber}`;

            periodRow.appendChild(cell);
        });

        // Thêm hàng vào các container
        // Lưu ý: chia tiết học thành buổi sáng và chiều
        if (index < 5) { // Tiết 1-5 cho buổi sáng
            sangContainer.appendChild(periodRow.cloneNode(true));
        } else { // Tiết 6-10 cho buổi chiều
            chieuContainer.appendChild(periodRow.cloneNode(true));
        }
    });
}

// Gọi hàm để tạo lịch học
createSchedule();
