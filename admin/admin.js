document.addEventListener("DOMContentLoaded", function () {
    const inputDate = document.getElementById("input-date");
    const addDateBtn = document.getElementById("add-date");
    const dateTable = document.querySelector("#date-table tbody");

    addDateBtn.addEventListener("click", function () {
        const selectedDate = inputDate.value;
        if (!selectedDate) {
            alert("Vui lòng chọn ngày!");
            return;
        }

        // Kiểm tra ngày đã tồn tại chưa
        const existingRows = dateTable.querySelectorAll("tr");
        let exists = false;
        existingRows.forEach(row => {
            if (row.querySelector("td")?.textContent === selectedDate) {
                exists = true;
            }
        });

        if (!exists) {
            // Tạo hàng mới trong bảng
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${selectedDate}</td>
                <td><input type="checkbox"></td>
                <td><button class="delete-btn">Xóa</button></td>
            `;
            dateTable.appendChild(row);

            // Thêm sự kiện xóa
            row.querySelector(".delete-btn").addEventListener("click", function () {
                row.remove();
            });
        } else {
            alert("Ngày này đã được thêm!");
        }
    });
});
