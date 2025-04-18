const modalCloseButton = document.querySelector(".modal-close-btn");
const createButton = document.querySelector(".create-todo-btn");
const modalWindow = document.querySelector(".modal");
const modalWindowOverflow = document.querySelector(".modal-overflow");

const modalTitleInput = document.querySelector(".modal-title-input");
const modalDescriptionInput = document.querySelector(
  ".modal-description-input"
);

if (createButton) {
  createButton.addEventListener("click", () => {
    modalWindowOverflow.style.display = "block";
  });
}

if (modalCloseButton) {
  modalCloseButton.addEventListener("click", () => {
    modalWindowOverflow.style.display = "none";
    modalTitleInput.value = "";
    modalDescriptionInput.value = "";
  });
  modalWindowOverflow.addEventListener("click", () => {
    modalWindowOverflow.style.display = "none";
  });
}

if (modalWindow) {
  modalWindow.addEventListener("click", (event) => {
    event.stopPropagation();
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key == "Escape") {
    modalWindowOverflow.style.display = "none";
  }
});

const headerDescriptionText = document.querySelector(
  ".header-description-text"
);
const headerDescriptionButton = document.querySelector(
  ".header-description-btn"
);

headerDescriptions = [
  "Create a new To-Do now!",
  "Think it. Type it. Do it.",
  "Your next goal starts here!",
  "Add a task and conquer your list!",
  "New task? Let’s write it down.",
];

let headerDescriptionCount = 0;
headerDescriptionText.textContent = headerDescriptions[headerDescriptionCount];

headerDescriptionButton.addEventListener("click", () => {
  headerDescriptionCount++;
  if (headerDescriptionCount >= headerDescriptions.length) {
    headerDescriptionCount = 0;
    headerDescriptionText.textContent =
      headerDescriptions[headerDescriptionCount];
  } else {
    headerDescriptionText.textContent =
      headerDescriptions[headerDescriptionCount];
  }
});

const userNameButton = document.querySelector(".header-change-name");
const userName = document.querySelector(".header-name");

const setUserName = () => {
  const name = prompt("Please enter your name");
  localStorage.setItem("name", name);
  userName.textContent = "Your name is " + name;
};

if (!localStorage.getItem("name")) {
  setUserName();
} else {
  const storedName = localStorage.getItem("name");
  userName.textContent = "Your name is " + storedName;
}

userNameButton.onclick = () => setUserName();

/* createButton.textContent = 'Creaaattteee';
createButton.onclick = () => alert("modalWindow.style.display is block!"); */

const modalConfirmButton = document.querySelector(".modal-confirm-todo-btn");
const mainDown = document.querySelector(".main-down");
const todos = [];
const modalCreateButton = document.querySelector(".modal-create-todo-btn");

let currentTodoIndex = null;

const renderTodos = () => {
  mainDown.innerHTML = "";

  for (const todo of todos) {
    const todoItem = document.createElement("div");
    todoItem.classList.add("todo");
    todoItem.innerHTML = `
		<div class="todo-header">
			<h4 class="todo__title">${todo.title}</h4>
			<p class="todo__description">${todo.description}</p>
		</div>
		<div class="todo-btns">
			<button class="todo-status-btn">Done</button>
			<button class="todo-change-btn">Change</button>
			<button class="todo-delete-btn">Delete</button>
		</div>
	`;
    todoItem.setAttribute("data-id", todo.id);
    const deleteButton = todoItem.querySelector(".todo-delete-btn");
    deleteButton.addEventListener("click", () => {
      const todoId = parseInt(todoItem.getAttribute("data-id"));
      const index = todos.findIndex((t) => t.id === todoId);
      if (index !== -1) {
        todos.splice(index, 1);
        renderTodos();
      }
    });

    const changeButton = todoItem.querySelector(".todo-change-btn");
    changeButton.addEventListener("click", () => {
      modalWindowOverflow.style.display = "block";
      modalCreateButton.style.display = "none";
      modalConfirmButton.style.display = "block";

      const todoId = parseInt(todoItem.getAttribute("data-id"));
      currentTodoIndex = todos.findIndex((t) => t.id === todoId);
      modalTitleInput.value = todos[currentTodoIndex].title;
      modalDescriptionInput.value = todos[currentTodoIndex].description;
    });

    const todoStatusBatton = todoItem.querySelector(".todo-status-btn");

    todoStatusBatton.addEventListener("click", () => {
      todo.completed = !todo.completed;
      renderTodos();
    });

    if (todo.completed) {
      todoStatusBatton.classList.add("todo-status-btn-completed");
    }

    mainDown.appendChild(todoItem);
  }
};

modalConfirmButton.addEventListener("click", (event) => {
  event.preventDefault();

  if (currentTodoIndex !== null) {
    todos[currentTodoIndex].title = modalTitleInput.value;
    todos[currentTodoIndex].description = modalDescriptionInput.value;

    renderTodos();
    modalTitleInput.value = "";
    modalDescriptionInput.value = "";
    modalWindowOverflow.style.display = "none";
    modalCreateButton.style.display = "block";
    modalConfirmButton.style.display = "none";
    currentTodoIndex = null;
  }
});

fetch("https://jsonplaceholder.typicode.com/todos?_limit=12")
  .then((response) => response.json())
  .then((json) => {
    json.forEach((element) => {
      todos.push({
        id: element.id,
        title: element.title,
        description: "No description",
        completed: element.completed,
        isCustom: false,
      });
    });

    renderTodos();
  })
  .catch((error) => console.log(error));

const modalForm = document.querySelector(".modal__container");
modalCreateButton.addEventListener("click", (event) => {
  event.preventDefault();

  const newTodo = {
    id: todos.length + 1,
    title: modalTitleInput.value,
    description: modalDescriptionInput.value,
    completed: false,
    isCustom: true,
  };

  todos.push(newTodo);
  renderTodos();

  modalTitleInput.value = "";
  modalDescriptionInput.value = "";
  modalWindowOverflow.style.display = "none";
});
