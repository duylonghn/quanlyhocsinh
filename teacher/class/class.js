// Hàm lấy ID giáo viên từ URL
function getTeacherIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const teacherId = urlParams.get('id'); // Sử dụng 'id' từ URL
    console.log('Lấy teacher_id từ URL:', teacherId); // Log để kiểm tra teacher_id từ URL
    return teacherId;
}

async function fetchClasses(teacherId) {
    try {
        console.log('Đang gọi API với teacher_id:', teacherId); // Log để kiểm tra khi gọi API
        const response = await fetch(`/database/get-class.php?teacher_id=${teacherId}`);
        
        // Kiểm tra nếu API trả về không phải là JSON hợp lệ
        if (!response.ok) {
            throw new Error('Không thể lấy dữ liệu lớp học');
        }

        const data = await response.json();
        console.log('Dữ liệu nhận được từ API:', data); // Log dữ liệu trả về từ API

        if (data.error) {
            console.error(data.error);
            return { homeroom_class: null, subject_classes: [] };
        }
        return data;
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu lớp học:', error);
        return { homeroom_class: null, subject_classes: [] };
    }
}

async function displayClasses() {
    const teacherId = getTeacherIdFromURL(); // Lấy ID giáo viên từ URL
    if (!teacherId) {
        console.error('Không tìm thấy teacher_id trong URL');
        return; // Nếu không có teacher_id, dừng việc gọi API
    }

    const data = await fetchClasses(teacherId);
    const { homeroom_class, subject_classes } = data;

    // Kiểm tra dữ liệu lớp chủ nhiệm
    console.log('Lớp chủ nhiệm:', homeroom_class);
    const homeroomSection = document.querySelector('.chunhiem');
    const homeroomHTML = homeroom_class
        ? `<tr>
            <td>${homeroom_class.id}</td> <!-- Sử dụng 'id' thay vì 'class_id' -->
            <td>${homeroom_class.class_name}</td>
            <td>${homeroom_class.student_count}</td>
            <td><a href="/teacher/students-list/students-list.php?class_id=${homeroom_class.id}">Xem chi tiết</a></td>
            <td><a href="/teacher/input-score/input-score.php?class_id=${homeroom_class.id}">Nhập điểm</a></td>
        </tr>`
        : `<tr><td colspan="5">Không có lớp chủ nhiệm</td></tr>`;
    
    // Thay đổi chỉ phần thân bảng (tbody) mà không thay thế toàn bộ bảng
    const homeroomTableBody = homeroomSection.querySelector('tbody');
    if (homeroomTableBody) {
        homeroomTableBody.innerHTML = homeroomHTML;
    }

    // Kiểm tra dữ liệu lớp dạy môn
    console.log('Lớp dạy môn:', subject_classes);
    const subjectSection = document.querySelector('.bomon');
    const subjectHTML = subject_classes.length > 0
        ? subject_classes.map(classInfo => {
            return `<tr>
                <td>${classInfo.class_id}</td> <!-- Vẫn giữ 'class_id' ở đây -->
                <td>${classInfo.class_name}</td>
                <td>${classInfo.student_count || '-'}</td> <!-- Hiển thị số học sinh trong lớp dạy môn -->
                <td>${classInfo.subject_name || '-'}</td> <!-- Hiển thị môn nếu có -->
                <td><a href="/teacher/input-score/student-list.php?class_id=${classInfo.class_id}">Xem chi tiết</a></td> <!-- Chỉnh lại 'class_id' -->
                <td><a href="/teacher/input-score/input-score.php?class_id=${classInfo.class_id}">Nhập điểm</a></td> <!-- Chỉnh lại 'class_id' -->
            </tr>`;
        }).join('')
        : `<tr><td colspan="6">Không có lớp dạy môn</td></tr>`;
    
    // Thay đổi chỉ phần thân bảng (tbody) mà không thay thế toàn bộ bảng
    const subjectTableBody = subjectSection.querySelector('tbody');
    if (subjectTableBody) {
        subjectTableBody.innerHTML = subjectHTML;
    }
}

// Gọi hàm hiển thị lớp khi trang tải
document.addEventListener("DOMContentLoaded", displayClasses);