// Hàm lấy ID giáo viên từ URL
function getTeacherIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const teacherId = urlParams.get('id'); // Sử dụng 'id' từ URL
    console.log('Lấy teacher_id từ URL:', teacherId); // Log để kiểm tra teacher_id từ URL
    return teacherId;
}

// Hàm lấy lớp học từ API
async function fetchClasses(teacherId) {
    try {
        showLoading(); // Hiển thị loading khi gọi API
        console.log('Đang gọi API với teacher_id:', teacherId); // Log để kiểm tra khi gọi API
        const response = await fetch(`/database/get-class.php?teacher_id=${teacherId}`);

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
    } finally {
        hideLoading(); // Ẩn loading sau khi hoàn tất
    }
}

// Hàm hiển thị lớp học
async function displayClasses() {
    const teacherId = getTeacherIdFromURL();
    if (!teacherId) {
        console.error('Không tìm thấy teacher_id trong URL');
        return;
    }

    const data = await fetchClasses(teacherId);
    const { homeroom_class, subject_classes } = data;

    // Lớp chủ nhiệm
    const homeroomSection = document.querySelector('.chunhiem');
    const homeroomTableBody = homeroomSection.querySelector('tbody');
    const homeroomHTML = homeroom_class
        ? `<tr>
            <td>${homeroom_class.id}</td>
            <td>${homeroom_class.class_name}</td>
            <td>${homeroom_class.student_count}</td>
            <td><a href="/teacher/class/students-list/students-list.php?class_id=${homeroom_class.id}">Xem chi tiết</a></td>
            <td><a href="/teacher/class/evaluation/evaluation.php?class_id=${homeroom_class.id}">Nhập thông tin</a></td>
        </tr>`
        : `<tr><td colspan="5">Không có lớp chủ nhiệm</td></tr>`;
    if (homeroomTableBody) {
        homeroomTableBody.innerHTML = homeroomHTML;
    }

    // Lớp bộ môn
    const subjectSection = document.querySelector('.bomon');
    const subjectTableBody = subjectSection.querySelector('tbody');
    const subjectHTML = subject_classes.length > 0
        ? subject_classes.map(classInfo => {
            return `<tr>
                <td>${classInfo.class_id}</td>
                <td>${classInfo.class_name}</td>
                <td>${classInfo.student_count || '-'}</td>
                <td>${classInfo.subject_name || '-'}</td>
                <td><a href="/teacher/class/students-list/students-list.php?class_id=${classInfo.class_id}">Xem chi tiết</a></td>
                <td>
                    <a href="#" 
                       class="input-score-link" 
                       data-class-id="${classInfo.class_id}" 
                       data-subject-name="${encodeURIComponent(classInfo.subject_name || '')}">Nhập điểm</a>
                </td>
            </tr>`;
        }).join('')
        : `<tr><td colspan="6">Không có lớp dạy môn</td></tr>`;
    if (subjectTableBody) {
        subjectTableBody.innerHTML = subjectHTML;
    }
}

// Hàm lưu môn học và chuyển trang
function saveSubjectAndRedirect(classId, subjectName) {
    localStorage.setItem('subject_name', subjectName);
    window.location.href = `/teacher/class/input-score/input-score.php?class_id=${classId}`;
}

// Lắng nghe click vào các nút "Nhập điểm"
document.addEventListener("click", function (e) {
    if (e.target.classList.contains("input-score-link")) {
        e.preventDefault();
        const classId = e.target.getAttribute("data-class-id");
        const subjectName = decodeURIComponent(e.target.getAttribute("data-subject-name") || '');
        saveSubjectAndRedirect(classId, subjectName);
    }
});

// Gọi hàm khi trang tải
document.addEventListener("DOMContentLoaded", displayClasses);
