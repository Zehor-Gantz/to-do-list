const modalWindow = document.querySelector(".modal");
const modalWindowOverflow = document.querySelector(".modal-overflow");
const modalForm = document.querySelector(".modal__container");
const modalTitleInput = document.querySelector(".modal-title-input");
const modalDescriptionInput = document.querySelector(
  ".modal-description-input"
);
const modalCreateButton = document.querySelector(".modal-create-todo-btn");
const modalConfirmButton = document.querySelector(".modal-confirm-todo-btn");
const modalCloseButton = document.querySelector(".modal-close-btn");

const createButton = document.querySelector(".create-todo-btn");
const mainDown = document.querySelector(".main-down");

const headerDescriptionText = document.querySelector(
  ".header-description-text"
);
const headerDescriptionButton = document.querySelector(
  ".header-description-btn"
);
const userNameButton = document.querySelector(".header-change-name");
const userName = document.querySelector(".header-name");
const filterArrows = document.querySelectorAll(".filter-img");
const searchInput = document.querySelector(".main-search-input");
const searchIcon = document.querySelector(".search-img");

// Data
const todos = [];
const headerDescriptions = [
  "Create a new To-Do now!",
  "Think it. Type it. Do it.",
  "Your next goal starts here!",
  "Add a task and conquer your list!",
  "New task? Let's write it down.",
];
const currentFilters = {
  status: "all",
  description: "all",
  date: "all",
};
let currentTodoIndex = null;
let headerDescriptionCount = 0;
let currentSearchInput = "";

// Todos render
function renderTodos() {
  mainDown.innerHTML = "";

  const filteredTodos = todos.filter((todo) => {
    return (
      checkStatus(todo) &&
      checkDescription(todo) &&
      checkDate(todo) &&
      handleSearch(todo)
    );
  });

  filteredTodos.forEach((todo) => {
    const element = createTodoElement(todo);
    mainDown.appendChild(element);
  });
}

// Todo create
function createTodoElement(todo) {
  const todoItem = document.createElement("div");
  todoItem.classList.add("todo");

  todoItem.innerHTML = `
    <div class="todo-header">
      <h4 class="todo__title">${todo.title}</h4>
      <p class="todo__description">${todo.description}</p>
      <span class="todo__date">${todo.date}</span>
    </div>
    <div class="todo-btns">
      <button class="todo-status-btn">Done</button>
      <button class="todo-change-btn">Change</button>
      <button class="todo-delete-btn">Delete</button>
    </div>
  `;
  todoItem.setAttribute("data-id", todo.id);

  const deleteButton = todoItem.querySelector(".todo-delete-btn");
  deleteButton.addEventListener("click", () => handleDelete(todo.id));

  const changeButton = todoItem.querySelector(".todo-change-btn");
  changeButton.addEventListener("click", () => handleChange(todo));

  const statusButton = todoItem.querySelector(".todo-status-btn");
  statusButton.addEventListener("click", () => handleToggleCompleted(todo));

  if (todo.completed) {
    statusButton.classList.add("todo-status-btn-completed");
  }

  return todoItem;
}

// Todo delete
function handleDelete(todoId) {
  const index = todos.findIndex((t) => t.id === todoId);
  if (index !== -1) {
    todos.splice(index, 1);
    renderTodos();
  }
}

// Todo change
function handleChange(todo) {
  modalWindowOverflow.style.display = "block";
  modalCreateButton.style.display = "none";
  modalConfirmButton.style.display = "block";

  currentTodoIndex = todos.findIndex((t) => t.id === todo.id);
  modalTitleInput.value = todo.title;
  modalDescriptionInput.value = todo.description;
}

// Todo status
function handleToggleCompleted(todo) {
  todo.completed = !todo.completed;
  renderTodos();
}

// Modal funcs
function openModal() {
  modalWindowOverflow.style.display = "block";
}

function closeModal() {
  modalWindowOverflow.style.display = "none";
  modalTitleInput.value = "";
  modalDescriptionInput.value = "";
}

// Change HeaderDescription
function changeHeaderDescription() {
  headerDescriptionCount++;
  if (headerDescriptionCount >= headerDescriptions.length) {
    headerDescriptionCount = 0;
  }
  headerDescriptionText.textContent =
    headerDescriptions[headerDescriptionCount];
}

// Filter funcs
function checkStatus(todo) {
  if (currentFilters.status === "completed") return todo.completed;
  if (currentFilters.status === "uncompleted") return !todo.completed;
  return true;
}

function checkDescription(todo) {
  if (currentFilters.description === "with")
    return todo.description !== "No description";
  if (currentFilters.description === "without")
    return todo.description === "No description";
  return true;
}

function checkDate(todo) {
  const todoDate = new Date(todo.date);
  if (currentFilters.date === "today") {
    const today = new Date();
    return (
      todoDate.getFullYear() === today.getFullYear() &&
      todoDate.getMonth() === today.getMonth() &&
      todoDate.getDate() === today.getDate()
    );
  }
  if (currentFilters.date === "yesterday") {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return (
      todoDate.getFullYear() === yesterday.getFullYear() &&
      todoDate.getMonth() === yesterday.getMonth() &&
      todoDate.getDate() === yesterday.getDate()
    );
  }
  if (currentFilters.date === "thisMonth") {
    const thisMonth = new Date();
    return (
      todoDate.getFullYear() === thisMonth.getFullYear() &&
      todoDate.getMonth() === thisMonth.getMonth()
    );
  }
  return true;
}

// Search func
function handleSearch(todo) {
  currentSearchInput = searchInput.value;
	console.log(currentSearchInput)
  if (currentSearchInput !== "")
    return todo.title
      .toLowerCase()
      .startsWith(currentSearchInput.toLowerCase());
  return true;
}

// UserName
function setUserName() {
  const name = prompt("Please enter your name");
  localStorage.setItem("name", name);
  userName.textContent = "Your name is " + name;
}

if (!localStorage.getItem("name")) {
  setUserName();
} else {
  const storedName = localStorage.getItem("name");
  userName.textContent = "Your name is " + storedName;
}

headerDescriptionText.textContent = headerDescriptions[headerDescriptionCount];

// Modal
if (createButton) {
  createButton.addEventListener("click", openModal);
}

if (modalCloseButton) {
  modalCloseButton.addEventListener("click", closeModal);
  modalWindowOverflow.addEventListener("click", closeModal);
}

if (modalWindow) {
  modalWindow.addEventListener("click", (event) => {
    event.stopPropagation();
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal();
  }
});

// Todo create
modalCreateButton.addEventListener("click", (event) => {
  event.preventDefault();

  const newTodo = {
    id: todos.length + 1,
    title: modalTitleInput.value,
    description: modalDescriptionInput.value,
    completed: false,
    isCustom: true,
    date: new Date().toLocaleDateString("en-CA"),
  };

  todos.push(newTodo);
  renderTodos();
  closeModal();
});

// Confirm changes
modalConfirmButton.addEventListener("click", (event) => {
  event.preventDefault();

  if (currentTodoIndex !== null) {
    todos[currentTodoIndex].title = modalTitleInput.value;
    todos[currentTodoIndex].description = modalDescriptionInput.value;

    renderTodos();
    closeModal();
    modalCreateButton.style.display = "block";
    modalConfirmButton.style.display = "none";
    currentTodoIndex = null;
  }
});

// headerDescription
headerDescriptionButton.addEventListener("click", changeHeaderDescription);
userNameButton.onclick = setUserName;

// Search
searchIcon.addEventListener("click", renderTodos);

// filterArrows
filterArrows.forEach((arrow) => {
  const filterMenu = arrow
    .closest(".filter")
    .querySelector(".filter-dropdown-menu");
  arrow.addEventListener("click", () => {
    arrow.classList.toggle("rotated");
    filterMenu.classList.toggle("hidden");
  });

  filterMenu.addEventListener("click", (element) => {
    if (element.target.tagName === "LI") {
      const type = filterMenu.closest(".filter").dataset.type;
      currentFilters[type] = element.target.dataset.filter;
      renderTodos();
      filterMenu.classList.add("hidden");
    }
  });
});

// fetch
fetch("https://jsonplaceholder.typicode.com/todos?_limit=12")
  .then((response) => response.json())
  .then((json) => {
    json.forEach((element) => {
      const randomPastDate = new Date();
      const maxDays = new Date(
        randomPastDate.getFullYear(),
        randomPastDate.getMonth() + 1,
        0
      ).getDate();
      const randomDay = Math.floor(Math.random() * maxDays) + 1;
      randomPastDate.setDate(randomDay);

      todos.push({
        id: element.id,
        title: element.title,
        description: "No description",
        completed: element.completed,
        isCustom: false,
        date: randomPastDate.toLocaleDateString("en-CA"),
      });
    });

    renderTodos();
  })
  .catch((error) => console.log(error));
