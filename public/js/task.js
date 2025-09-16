// DOM Elements
const todoContainerWrapper = document.querySelector('.todo-container-wrapper');
const todoContainer = document.querySelector('.todo-container');
const doneContainer = document.querySelector('.done-container');
const newTodoItem = document.querySelector('.new-todo-item');
const newTodoItemForm = document.querySelector('.new-todo-item-form');
const newTodoItemWrapper = document.querySelector('.new-todo-item-wrapper');
const plus = document.querySelector('#plus');
const checkmark = document.querySelector('#checkmark');

// Save toLocal Storage
function saveToLocalStorage() {
	localStorage.setItem('todoItems', JSON.stringify(todoItems));
}

// Get from Local Storage
function getFromLocalStorage() {
	const storedTodoItems = localStorage.getItem('todoItems');
	if (storedTodoItems) {
		todoItems = JSON.parse(storedTodoItems);
		renderTodoItems();
	} else {
		todoItems = [];
		renderTodoItems();
	}
}

// Functions
function createTodoObject(title, date, uniqueId) {
	const todoObject = {
		title: title,
		date: date,
		uniqueId: uniqueId,
		done: false,
	};
	console.log(todoObject);
	todoItems.push(todoObject);
	console.log(todoItems);
	saveToLocalStorage();
	renderTodoItems();
}

function createTodoItem(title, date, uniqueId) {
	const todoItem = document.createElement('div');
	todoItem.classList.add('todo-item', 'card');
	todoItem.id = uniqueId;
	todoItem.innerHTML = `
		<h2>${title}</h2>
		<p>${date}</p>
	`;
	todoContainer.appendChild(todoItem);
	saveToLocalStorage();
}

function handleCheckmarkClick(e) {
	e.preventDefault();
	e.stopPropagation(); // Prevent event bubbling to the wrapper
	let title = newTodoItemForm.querySelector('#todo').value;
	let date = String(newTodoItemForm.querySelector('#date').value);
	if (title && date) {
		let uniqueId = crypto.randomUUID();
		createTodoObject(title, date, uniqueId);
		// Reset the form and UI state
		newTodoItemForm.querySelector('#todo').value = '';
		newTodoItemForm.querySelector('#date').value = '';
		resetNewTodoItem();
	} else {
		alert('Please fill in all fields');
	}
}

function handleNewTodoItemClick(e) {
	e.preventDefault();

	// Only open the form if it's not already open
	if (newTodoItemForm.classList.contains('hidden')) {
		plus.classList.add('hidden');
		checkmark.classList.remove('hidden');
		newTodoItemForm.classList.remove('hidden');
		newTodoItemWrapper.classList.add('active');
		// Remove any existing checkmark listener first, then add new one
		checkmark.removeEventListener('click', handleCheckmarkClick);
		checkmark.addEventListener('click', handleCheckmarkClick);
	}
}

function resetNewTodoItem() {
	plus.classList.remove('hidden');
	checkmark.classList.add('hidden');
	newTodoItemForm.classList.add('hidden');
	newTodoItemWrapper.classList.remove('active');
	// Remove the checkmark event listener when resetting
	checkmark.removeEventListener('click', handleCheckmarkClick);
}

function renderTodoItems() {
	todoContainer.innerHTML = '<h1>Todo</h1>';
	todoItems.forEach((todoItem) => {
		if (!todoItem.done) {
			createTodoItem(todoItem.title, todoItem.date, todoItem.uniqueId);
		}
	});
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
	getFromLocalStorage();
	//localStorage.clear();
	newTodoItemWrapper.addEventListener('click', handleNewTodoItemClick);
});
