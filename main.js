let todoListData = [];

const todoForm = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");

todoForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const value = todoInput.value.trim();
  if (!value) {
    alert("There's nothing to add");
    todoInput.value = "";
    return;
  }
  for (let list of todoListData) {
    if (list.title.toLowerCase() === value.toLowerCase()) {
      alert(`A plan with this title already exists!`);
      todoInput.value = "";
      return;
    }
  }
  const newValue = {
    title: value,
    todoTask: [],
  };
  todoListData.push(newValue);
  todoInput.value = "";
  render();
});

todoList.addEventListener("click", function (e) {
  const todoItem = e.target.closest(".todo-item");
  if (!todoItem) return;
  const index = +todoItem.getAttribute("data-todo-item-index");
  const tasksUl = document.getElementById(`todo-tasks-${index}`);

  if (e.target.closest(".delete-todo-list")) {
    if (
      confirm(
        `Are you sure you want to delete "${todoListData[index].title}" plan?`
      )
    ) {
      todoListData.splice(index, 1);
      render();
    }
  }
  //   ===================
  else if (e.target.closest(".todo-item-illustration")) {
    const modal = todoItem.querySelector(".modal");
    const todoTasksWrap = todoItem.querySelector(".todo-tasks-wrap");

    modal.classList.toggle("hide");
    todoTasksWrap.classList.toggle("hide");

    if (!todoTasksWrap.classList.contains("hide")) {
      const input = todoItem.querySelector(`#task-input-${index}`);
      if (input) input.focus();
    }

    modal.onclick = function () {
      modal.classList.toggle("hide");
      todoTasksWrap.classList.toggle("hide");
    };
  }
  //   ===================
  else if (e.target.closest(".edit")) {
    const taskItem = e.target.closest(".task-item");
    if (!taskItem) return;
    const taskIndex = +taskItem.getAttribute("task-index");
    const currentTitle = todoListData[index].todoTask[taskIndex].title;
    const newTitle = prompt(
      "Enter new task title:",
      todoListData[index].todoTask[taskIndex].title
    );
    if (newTitle !== currentTitle) {
      for (let task of todoListData[index].todoTask) {
        if (task.title.toLowerCase() === newTitle.toLowerCase()) {
          alert(`A task with this title already exists!`);
          return;
        }
      }
    }
    if (newTitle !== null && newTitle.trim() !== "") {
      todoListData[index].todoTask[taskIndex].title = newTitle.trim();
      renderTask(tasksUl, todoListData[index].todoTask);
    }
  }
  //   ===================
  else if (e.target.closest(".done")) {
    const taskItem = e.target.closest(".task-item");
    if (!taskItem) return;
    const taskIndex = +taskItem.getAttribute("task-index");
    todoListData[index].todoTask[taskIndex].completed =
      !todoListData[index].todoTask[taskIndex].completed;
    renderTask(tasksUl, todoListData[index].todoTask);
  }
  //   ===================
  else if (e.target.closest(".delete")) {
    const taskItem = e.target.closest(".task-item");
    if (!taskItem) return;
    const taskIndex = +taskItem.getAttribute("task-index");
    if (
      confirm(
        `Are you sure to delete "${todoListData[index].todoTask[taskIndex].title}"`
      )
    ) {
      todoListData[index].todoTask.splice(taskIndex, 1);
      renderTask(tasksUl, todoListData[index].todoTask);

      const todoTask = todoItem.querySelector(".todo-tasks");
      if (todoTask.scrollHeight === todoTask.clientHeight) {
        todoTask.style.marginRight = "30px";
      }
    }
  }
});

todoList.addEventListener("submit", function (e) {
  e.preventDefault();
  const todoItem = e.target.closest(".todo-item");
  if (!todoItem) return;
  const index = +todoItem.getAttribute("data-todo-item-index");
  const taskForm = e.target;
  if (!taskForm.id.startsWith("task-form-")) return;
  const taskInput = taskForm.querySelector(`#task-input-${index}`);
  if (!taskInput) return;
  const value = taskInput.value.trim();
  if (!value) {
    alert("There's nothing to add");
    taskInput.value = "";
    return;
  }
  for (let task of todoListData[index].todoTask) {
    if (task.title.toLowerCase() === value.toLowerCase()) {
      alert(`A task with this title already exists!`);
      taskInput.value = "";
      return;
    }
  }
  const newValue = {
    title: value,
    completed: false,
  };
  todoListData[index].todoTask.unshift(newValue);
  taskInput.value = "";
  const tasksUl = document.getElementById(`todo-tasks-${index}`);
  renderTask(tasksUl, todoListData[index].todoTask);

  const todoTask = todoItem.querySelector(".todo-tasks");
  if (todoTask.scrollHeight > todoTask.clientHeight) {
    todoTask.style.marginRight = "15px";
  }
});

function render() {
  const totalPlans = document.getElementById("total-plans");
  if (!todoListData.length) {
    todoList.innerHTML = `
      <li class="empty-task">
        <img src="./panda.png" alt="" class="empty-img">
        <p class="empty-weldone">Well Done!</p>
        <p class="empty-congratulation">You have nothing left to do. Time to recharge.</p>
      </li>
    `;
    totalPlans.innerText = "";
    return;
  }

  const s = todoListData.length === 1 ? "" : "s";
  totalPlans.innerText = `You have total ${todoListData.length} plan${s}`;
  const html = todoListData
    .map((todo, index) => {
      return `<li class="todo-item" data-todo-item-index="${index}">
          <h2 class="todo-item__heading">${todo.title}</h2>
          <img src="./note.png" alt="" class="todo-item-illustration" />

          <div class="modal hide"></div>

          <div class="todo-tasks-wrap hide">
            <form id="task-form-${index}" action="" class="todo-form task-form">
              <input
                type="text"
                id="task-input-${index}"
                class="input"
                placeholder="You have something to do?"
                spellcheck="false"
                autocomplete="off"
              />
              <button
                id="task-submit-${index}"
                class="submit-btn"
                onmousedown="event.preventDefault()"
              >
                Add
              </button>
            </form>
            <ul id="todo-tasks-${index}" class="todo-tasks">
            </ul>
          </div>
          <button class="delete-todo-list">Delete</button>
        </li>`;
    })
    .join("");

  todoList.innerHTML = html;

  todoListData.forEach((list, index) => {
    const taskContainer = document.getElementById(`todo-tasks-${index}`);
    renderTask(taskContainer, list.todoTask);
  });
}
render();

function renderTask(domElement, task) {
  if (!task.length) {
    domElement.innerHTML = `
      <li class="empty-task">
        <img src="./shiba.png" alt="" class="empty-task-img">
        <p class="empty-task-weldone">Good job!</p>
        <p class="empty-task-congratulation">You've been working very hard. Take a break.</p>
      </li>
    `;
    return;
  }

  const html = task
    .map((task, index) => {
      return `<li class="task-item ${
        task.completed ? "completed" : ""
      }" task-index="${index}">
          <span class="task-title">${task.title}</span>
          <div class="task-action">
              <button class="task-btn edit">Edit</button>
              <button class="task-btn done">${
                task.completed ? "Mark as undone" : "Mark as done"
              }</button>
              <button class="task-btn delete">Delete</button>
          </div>
        </li>`;
    })
    .join("");

  domElement.innerHTML = html;
}
