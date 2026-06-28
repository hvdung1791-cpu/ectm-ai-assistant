let tasks = JSON.parse(localStorage.getItem("ectm_tasks")) || [];

function saveTasks() {
    localStorage.setItem("ectm_tasks", JSON.stringify(tasks));
}

function addTask() {
    const input = document.getElementById("taskInput");
    const priority = document.getElementById("priority");
    const deadline = document.getElementById("deadline");
    const reminderTime = document.getElementById("reminderTime");

    if (input.value.trim() === "") {
        alert("Vui lòng nhập công việc.");
        return;
    }

    tasks.push({
        name: input.value.trim(),
        priority: priority.value,
        deadline: deadline.value,
        reminderTime: reminderTime.value,
        done: false,
        reminded: false
    });

    input.value = "";
    deadline.value = "";
    reminderTime.value = "";

    saveTasks();
    renderTasks();
}

function toggleTask(index) {
    tasks[index].done = !tasks[index].done;
    saveTasks();
    renderTasks();
}

function deleteTask(index) {
    if (confirm("Anh có chắc muốn xóa công việc này không?")) {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
    }
}

function editTask(index) {
    const newName = prompt("Sửa tên công việc:", tasks[index].name);

    if (newName && newName.trim() !== "") {
        tasks[index].name = newName.trim();
        saveTasks();
        renderTasks();
    }
}

function todayText() {
    return new Date().toISOString().split("T")[0];
}

function isOverdue(task) {
    if (!task.deadline || task.done) return false;
    return task.deadline < todayText();
}

function shouldRemind(task) {
    if (task.done || !task.deadline || !task.reminderTime) return false;

    const now = new Date();
    const taskTime = new Date(task.deadline + "T" + task.reminderTime);

    return now >= taskTime;
}

function renderTasks() {
    const list = document.getElementById("taskList");
    const search = document.getElementById("searchInput")?.value.toLowerCase() || "";

    list.innerHTML = "";

    let total = tasks.length;
    let done = tasks.filter(task => task.done).length;
    let overdue = tasks.filter(task => isOverdue(task)).length;
    let remind = tasks.filter(task => shouldRemind(task)).length;

    document.getElementById("totalTasks").innerText = total;
    document.getElementById("doneTasks").innerText = done;
    document.getElementById("overdueTasks").innerText = overdue;
    document.getElementById("remindTasks").innerText = remind;

    tasks.forEach((task, index) => {
        if (!task.name.toLowerCase().includes(search)) return;

        const li = document.createElement("li");

        if (task.done) li.classList.add("done");
        if (isOverdue(task)) li.classList.add("overdue");
        if (shouldRemind(task)) li.classList.add("remind");

        li.innerHTML = `
            <strong>${task.priority}</strong> - ${task.name}
            <br>
            📅 Ngày: ${task.deadline || "Chưa có ngày"}
            <br>
            ⏰ Giờ nhắc: ${task.reminderTime || "Chưa đặt"}
            ${isOverdue(task) ? "<br>⚠️ Quá hạn" : ""}
            ${shouldRemind(task) ? "<br>🔔 Đã đến giờ nhắc" : ""}

            <div class="task-actions">
                <button onclick="toggleTask(${index})">
                    ${task.done ? "Làm lại" : "Xong"}
                </button>
                <button class="edit" onclick="editTask(${index})">Sửa</button>
                <button class="delete" onclick="deleteTask(${index})">Xóa</button>
            </div>
        `;

        list.appendChild(li);
    });

    renderAISuggestion();
}

function renderAISuggestion() {
    const aiBox = document.getElementById("aiSuggestion");

    const today = todayText();
    const todayTasks = tasks.filter(task => task.deadline === today && !task.done);
    const overdueTasks = tasks.filter(task => isOverdue(task));

    let text = "";

    if (todayTasks.length === 0 && overdueTasks.length === 0) {
        text = "Hôm nay chưa có việc gấp. Anh có thể thêm việc mới hoặc kiểm tra khách hàng cần chăm sóc.";
    } else {
        text = `Hôm nay anh có ${todayTasks.length} việc cần xử lý.<br>`;
        text += `Có ${overdueTasks.length} việc quá hạn.<br><br>`;

        if (overdueTasks.length > 0) {
            text += "Ưu tiên xử lý việc quá hạn trước.";
        } else {
            text += "Nên xử lý các việc ưu tiên cao trước.";
        }
    }

    aiBox.innerHTML = text;
}

function checkReminderPopup() {
    tasks.forEach((task) => {
        if (shouldRemind(task) && !task.reminded) {
            alert("🔔 Đến giờ nhắc: " + task.name);
            task.reminded = true;
            saveTasks();
        }
    });

    renderTasks();
}

renderTasks();

setInterval(checkReminderPopup, 60000);