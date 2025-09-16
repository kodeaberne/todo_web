// DOM Elements
const todoContainerWrapper = document.querySelector('.todo-container-wrapper');
const todoContainer = document.querySelector('.todo-container');
const doneContainer = document.querySelector('.done-container');
const newTodoItem = document.querySelector('.new-todo-item');

// Functions
function createTodoItem() {
	const todoItem = document.createElement('div');
	todoItem.classList.add('todo-item', 'card');
	todoItem.innerHTML = `
		<h2>Todo ${todoContainer.children.length + 1}</h2>
		<p>Description ${todoContainer.children.length + 1}</p>
	`;
	todoContainer.appendChild(todoItem);
}

// Event Listeners
newTodoItem.addEventListener('click', () => {
	createTodoItem();
	console.log('New Todo Item');
});
