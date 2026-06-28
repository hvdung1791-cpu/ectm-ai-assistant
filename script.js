let tasks = JSON.parse(localStorage.getItem("ectm_tasks")) || [];

function addTask() {
    const input = document.getElementById("taskInput");
    const priority = document.getElementById("priority");

    if (input.value.trim() === "") {
        alert("Vui lòng nhập công việc.");
        return;
    }

    tasks.push({
        name: input.value,
        priority: priority.value,
        done: false
    });

    input.value = "";
    saveTasks();
    renderTasks();
}

function toggleTask(index) {
    tasks[index].done = !tasks[index].done;
    saveTasks();
    renderTasks();
}

function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
}

function saveTasks() {
    localStorage.setItem("ectm_tasks", JSON.stringify(tasks));
}

function renderTasks() {
    const list = document.getElementById("taskList");
    list.innerHTML = "";

    tasks.forEach((task, index) => {
        const li = document.createElement("li");

        li.innerHTML = `
            <span style="${task.done ? 'text-decoration: line-through; color: gray;' : ''}">
                <b>${task.priority}</b> - ${task.name}
            </span>
            <button onclick="toggleTask(${index})">Xong</button>
            <button onclick="deleteTask(${index})">Xóa</button>
        `;

        list.appendChild(li);
    });
}

renderTasks();