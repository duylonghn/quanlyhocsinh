// Hàm lấy teacher_id từ session
async function getTeacherIdFromSession() {
    try {
        const response = await fetch("/action/get-session.php");
        if (!response.ok) throw new Error(`Lỗi HTTP! Mã: ${response.status}`);

        const sessionData = await response.json();
        if (!sessionData.user_id || isNaN(sessionData.user_id)) {
            throw new Error("Không tìm thấy ID giáo viên trong session hoặc ID không hợp lệ!");
        }
        return sessionData.user_id;
    } catch (error) {
        console.error("❌ Lỗi khi lấy teacher_id từ session:", error);
        return null;
    }
}

// Hàm lấy dữ liệu kỳ học từ API
async function fetchSemesters() {
    try {
        const response = await fetch('/database/get-semester.php');
        if (!response.ok) throw new Error(`Lỗi HTTP! Mã: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Không thể lấy dữ liệu kỳ học:', error);
        return [];
    }
}

// Hàm lấy dữ liệu lịch dạy từ API
async function fetchSchedule(teacherId, semesterId) {
    try {
        const response = await fetch(`/database/timetable-teacher.php?teacher_id=${teacherId}&semester_id=${semesterId}`);
        if (!response.ok) throw new Error(`Lỗi HTTP! Mã: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Không thể lấy dữ liệu lịch dạy:', error);
        return {};
    }
}

// Hàm tạo bảng lịch dạy
async function createSchedule(teacherId, semesterId) {
    const scheduleData = await fetchSchedule(teacherId, semesterId);

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

    // Tạo từng hàng cho mỗi tiết
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
            cell.id = `period${index + 1}-day${dayIndex + 1}`;

            const subjectSpan = document.createElement('div');
            subjectSpan.classList.add('subject');

            const classSpan = document.createElement('div');
            classSpan.classList.add('class-id');

            cell.appendChild(subjectSpan);
            cell.appendChild(classSpan);

            periodRow.appendChild(cell);
        });

        (index < 5 ? sangContainer : chieuContainer).appendChild(periodRow);
    });

    // Đổ dữ liệu vào bảng từ API
    Object.entries(scheduleData).forEach(([key, entry]) => {
        const cell = document.getElementById(key);
        if (cell) {
            cell.querySelector('.subject').textContent = entry.subject;
            cell.querySelector('.class-id').textContent = entry.class;
        }
    });
}

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

// Hàm hiển thị danh sách kỳ học lên select
async function displaySemesters() {
    const semesterSelect = document.getElementById('semester');
    const semesters = await fetchSemesters();

    if (semesters.length > 0) {
        semesters.forEach(semester => {
            const option = document.createElement('option');
            option.value = semester.id;
            option.textContent = semester.name;
            semesterSelect.appendChild(option);
        });

        // Tự động chọn kỳ học mặc định
        const defaultSemesterId = getSemesterId();
        semesterSelect.value = defaultSemesterId;
        console.log('Default semester ID:', defaultSemesterId);

        // Lấy teacher_id từ session rồi tải thời khóa biểu
        const teacherId = await getTeacherIdFromSession();
        if (teacherId) {
            await createSchedule(teacherId, defaultSemesterId);
        }
    } else {
        console.error('Không có dữ liệu kỳ học');
    }
}

// Lắng nghe sự kiện thay đổi kỳ học
document.getElementById('semester').addEventListener('change', async function () {
    const semesterId = this.value;
    console.log('Chọn kỳ học:', semesterId);

    const teacherId = await getTeacherIdFromSession();
    if (teacherId) {
        await createSchedule(teacherId, semesterId);
    }
});

// Gọi hàm hiển thị kỳ học và tạo lịch khi trang tải xong
document.addEventListener("DOMContentLoaded", displaySemesters);
