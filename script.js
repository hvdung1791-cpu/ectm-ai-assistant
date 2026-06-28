let tasks = [];

function addTask() {

    const input = document.getElementById("taskInput");
    const priority = document.getElementById("priority");

    if (input.value.trim() === "") {
        alert("Vui lòng nhập công việc.");
        return;
    }

    tasks.push({
        name: input.value,
        priority: priority.value
    });

    input.value = "";

    renderTasks();
}

function renderTasks() {

    const list = document.getElementById("taskList");

    list.innerHTML = "";

    tasks.forEach((task) => {

        const li = document.createElement("li");

        li.innerHTML =
            "<b>" + task.priority + "</b> - " + task.name;

        list.appendChild(li);

    });

}