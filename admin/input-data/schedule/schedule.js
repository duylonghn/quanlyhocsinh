// Hàm tạo bảng lịch dạy với ô nhập liệu
async function createSchedule() {
    const dateHeader = document.getElementById('date-header');
    const sangContainer = document.getElementById('sang');
    const chieuContainer = document.getElementById('chieu');

    dateHeader.innerHTML = '';
    sangContainer.innerHTML = '';
    chieuContainer.innerHTML = '';

    // Tạo tiêu đề ngày trong tuần
    const headerRow = document.createElement('div');
    headerRow.classList.add('row');

    const periodHeaderCell = document.createElement('div');
    periodHeaderCell.classList.add('cell', 'tiethoc');
    periodHeaderCell.textContent = 'Tiết học';
    headerRow.appendChild(periodHeaderCell);

    const daysOfWeek = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
    daysOfWeek.forEach(day => {
        const dayHeaderCell = document.createElement('div');
        dayHeaderCell.classList.add('cell', 'header');
        dayHeaderCell.textContent = day;
        headerRow.appendChild(dayHeaderCell);
    });

    dateHeader.appendChild(headerRow);

    // Tạo từng hàng cho mỗi tiết học
    const periods = ["Tiết 1", "Tiết 2", "Tiết 3", "Tiết 4", "Tiết 5", "Tiết 6", "Tiết 7", "Tiết 8", "Tiết 9", "Tiết 10"];
    
    periods.forEach((period, index) => {
        const periodRow = document.createElement('div');
        periodRow.classList.add('row');

        const periodCell = document.createElement('div');
        periodCell.classList.add('cell', 'tiet');
        periodCell.textContent = period;
        periodRow.appendChild(periodCell);

        daysOfWeek.forEach((_, dayIndex) => {
            const cell = document.createElement('div');
            cell.classList.add('cell', 'body');

            // Ô nhập môn học
            const subjectInput = document.createElement('input');
            subjectInput.type = 'text';
            subjectInput.classList.add('subject-input');
            subjectInput.placeholder = 'Môn học';

            // Ô nhập tên giáo viên
            const teacherInput = document.createElement('input');
            teacherInput.type = 'text';
            teacherInput.classList.add('teacher-input');
            teacherInput.placeholder = 'Giáo viên';

            cell.appendChild(subjectInput);
            cell.appendChild(teacherInput);

            periodRow.appendChild(cell);
        });

        (index < 5 ? sangContainer : chieuContainer).appendChild(periodRow);
    });
}

// Gọi hàm tạo bảng khi trang tải xong
document.addEventListener("DOMContentLoaded", createSchedule);
