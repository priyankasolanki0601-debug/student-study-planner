// Get HTML elements
const taskForm = document.getElementById("taskForm");
const subjectInput = document.getElementById("subject");
const taskInput = document.getElementById("task");
const deadlineInput = document.getElementById("deadline");

const taskList = document.getElementById("taskList");
const emptyMessage = document.getElementById("emptyMessage");
const filterTasks = document.getElementById("filterTasks");

const totalTasks = document.getElementById("totalTasks");
const pendingTasks = document.getElementById("pendingTasks");
const completedTasks = document.getElementById("completedTasks");

// Load tasks from localStorage
let tasks = JSON.parse(localStorage.getItem("studyTasks")) || [];

// Add new task
taskForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const subject = subjectInput.value.trim();
    const taskName = taskInput.value.trim();
    const deadline = deadlineInput.value;

    if (subject === "" || taskName === "" || deadline === "") {
        alert("Please fill all fields.");
        return;
    }

    const newTask = {
        id: Date.now(),
        subject: subject,
        task: taskName,
        deadline: deadline,
        completed: false
    };

    tasks.push(newTask);

    saveTasks();
    displayTasks();

    taskForm.reset();
});

// Save tasks
function saveTasks() {
    localStorage.setItem("studyTasks", JSON.stringify(tasks));
}

// Display tasks
function displayTasks() {

    taskList.innerHTML = "";

    const filter = filterTasks.value;

    let filteredTasks = tasks;

    if (filter === "pending") {
        filteredTasks = tasks.filter(task => !task.completed);
    }

    if (filter === "completed") {
        filteredTasks = tasks.filter(task => task.completed);
    }

    if (filteredTasks.length === 0) {
        emptyMessage.style.display = "block";
    } else {
        emptyMessage.style.display = "none";
    }

    filteredTasks.forEach(task => {

        const taskElement = document.createElement("div");

        taskElement.className = `task ${
            task.completed ? "completed" : ""
        }`;

        taskElement.innerHTML = `
            <div class="task-info">
                <h3>${escapeHTML(task.task)}</h3>
                <p><strong>Subject:</strong> ${escapeHTML(task.subject)}</p>
                <p><strong>Deadline:</strong> ${formatDate(task.deadline)}</p>
            </div>

            <div class="task-actions">
                <button
                    class="complete-btn"
                    onclick="toggleTask(${task.id})">
                    ${task.completed ? "↩ Undo" : "✓ Complete"}
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteTask(${task.id})">
                    🗑 Delete
                </button>
            </div>
        `;

        taskList.appendChild(taskElement);
    });

    updateStatistics();
}

// Mark task complete/incomplete
function toggleTask(id) {

    tasks = tasks.map(task => {

        if (task.id === id) {
            return {
                ...task,
                completed: !task.completed
            };
        }

        return task;
    });

    saveTasks();
    displayTasks();
}

// Delete task
function deleteTask(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this task?"
    );

    if (!confirmDelete) {
        return;
    }

    tasks = tasks.filter(task => task.id !== id);

    saveTasks();
    displayTasks();
}

// Update statistics
function updateStatistics() {

    const total = tasks.length;

    const completed = tasks.filter(
        task => task.completed
    ).length;

    const pending = total - completed;

    totalTasks.textContent = total;
    completedTasks.textContent = completed;
    pendingTasks.textContent = pending;
}

// Format date
function formatDate(dateString) {

    const date = new Date(dateString + "T00:00:00");

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}

// Prevent HTML injection in user-entered text
function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}

// Filter tasks
filterTasks.addEventListener("change", displayTasks);

// Display tasks when page loads
displayTasks();
