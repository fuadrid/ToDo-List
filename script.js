// Todo App Module
const TodoApp = (function () {
  // DOM Elements
  const taskForm = document.getElementById("task_form");
  const taskInput = document.getElementById("task_input");
  const taskList = document.getElementById("task_list");

  // Initialize the app
  function init() {
    loadTasks();
    setupEventListeners();
  }

  // Set up event listeners
  function setupEventListeners() {
    taskForm.addEventListener("submit", addTask);
    taskList.addEventListener("click", handleTaskActions);
  }

  // Load tasks from localStorage
  function loadTasks() {
    const tasks = getTasksFromStorage();

    if (tasks.length === 0) {
      showEmptyState();
      return;
    }

    hideEmptyState();
    tasks.forEach((task) => renderTask(task));
  }

  // Add a new task
  function addTask(e) {
    e.preventDefault();

    const taskText = taskInput.value.trim();

    if (taskText === "") {
      alert("Please enter a task");
      return;
    }

    const task = {
      id: Date.now(),
      text: taskText,
      completed: false,
    };

    renderTask(task);
    saveTaskToStorage(task);
    taskInput.value = "";
    hideEmptyState();
  }

  // Render a task to the DOM
  function renderTask(task) {
    const taskItem = document.createElement("li");
    taskItem.className = "task-item";
    taskItem.dataset.id = task.id;

    taskItem.innerHTML = `
            <div class="task-content">
                <input 
                    type="checkbox" 
                    class="task-checkbox" 
                    ${task.completed ? "checked" : ""}>
                <span class="task-text ${task.completed ? "completed" : ""}">
                    ${task.text}
                </span>
            </div>
            <div class="task-actions">
                <button class="delete-btn">Delete</button>
            </div>
        `;

    taskList.appendChild(taskItem);
  }

  // Handle task actions (delete, toggle complete)
  function handleTaskActions(e) {
    const taskItem = e.target.closest(".task-item");
    if (!taskItem) return;

    const taskId = parseInt(taskItem.dataset.id);

    if (e.target.classList.contains("delete-btn")) {
      deleteTask(taskId, taskItem);
    } else if (e.target.classList.contains("task-checkbox")) {
      toggleTaskComplete(taskId, taskItem, e.target.checked);
    }
  }

  // Delete a task
  function deleteTask(taskId, taskItem) {
    taskItem.remove();
    removeTaskFromStorage(taskId);

    if (taskList.children.length === 0) {
      showEmptyState();
    }
  }

  // Toggle task completion status
  function toggleTaskComplete(taskId, taskItem, isCompleted) {
    const taskText = taskItem.querySelector(".task-text");
    taskText.classList.toggle("completed", isCompleted);

    updateTaskInStorage(taskId, isCompleted);
  }

  // Show empty state
  function showEmptyState() {
    let emptyState = document.querySelector(".empty-state");

    if (!emptyState) {
      emptyState = document.createElement("div");
      emptyState.className = "empty-state";
      emptyState.innerHTML = "<p>No tasks yet. Add a task to get started!</p>";
      taskList.appendChild(emptyState);
    } else {
      emptyState.classList.remove("hidden");
    }
  }

  // Hide empty state
  function hideEmptyState() {
    const emptyState = document.querySelector(".empty-state");
    if (emptyState) {
      emptyState.classList.add("hidden");
    }
  }

  // LocalStorage functions
  function getTasksFromStorage() {
    const tasksJSON = localStorage.getItem("tasks");
    return tasksJSON ? JSON.parse(tasksJSON) : [];
  }

  function saveTaskToStorage(task) {
    const tasks = getTasksFromStorage();
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function removeTaskFromStorage(taskId) {
    let tasks = getTasksFromStorage();
    tasks = tasks.filter((task) => task.id !== taskId);
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function updateTaskInStorage(taskId, isCompleted) {
    const tasks = getTasksFromStorage();
    const task = tasks.find((task) => task.id === taskId);

    if (task) {
      task.completed = isCompleted;
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }

  // Public API
  return {
    init: init,
  };
})();

// Initialize the app when DOM is loaded
document.addEventListener("DOMContentLoaded", TodoApp.init);
