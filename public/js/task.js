// DOM Elements
const todoContainerWrapper = document.querySelector('.todo-container-wrapper');
const todoContainer = document.querySelector('.todo-container');
const doneContainer = document.querySelector('.done-container');
const newTodoItem = document.querySelector('.new-todo-item');
const newTodoItemForm = document.querySelector('.new-todo-item-form');
const newTodoItemWrapper = document.querySelector('.new-todo-item-wrapper');
const plus = document.querySelector('#plus');
const checkmark = document.querySelector('#checkmark');
const deleteModeToggle = document.querySelector('#delete-mode-toggle');

// Global state
let isDeleteMode = false;

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
		renderDoneItems();
	} else {
		todoItems = [];
		renderTodoItems();
		renderDoneItems();
		saveToLocalStorage();
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
		<div class="todo-item-content">
		<h2>${title}</h2>
		<p>${date.split('-').reverse().join('-')}</p>
		</div>
		<label class="container">
    		<input type="checkbox" class="todo-item-checkbox">
    		<div class="checkmark"></div>
		</label>
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

		// Trigger show animation
		newTodoItemForm.classList.add('showing');
		setTimeout(() => {
			newTodoItemForm.classList.remove('showing');
		}, 300);

		// Remove any existing checkmark listener first, then add new one
		checkmark.removeEventListener('click', handleCheckmarkClick);
		checkmark.addEventListener('click', handleCheckmarkClick);
	}
}

function resetNewTodoItem() {
	// Trigger hide animation
	newTodoItemForm.classList.add('hiding');
	setTimeout(() => {
		plus.classList.remove('hidden');
		checkmark.classList.add('hidden');
		newTodoItemForm.classList.add('hidden');
		newTodoItemWrapper.classList.remove('active');
		newTodoItemForm.classList.remove('hiding');
	}, 300);

	// Remove the checkmark event listener when resetting
	checkmark.removeEventListener('click', handleCheckmarkClick);
}

function renderTodoItems() {
	const todoHeader = document.querySelector('.todo-header');
	todoContainer.innerHTML = '';
	todoContainer.appendChild(todoHeader);

	todoItems.forEach((todoItem) => {
		if (!todoItem.done) {
			createTodoItem(todoItem.title, todoItem.date, todoItem.uniqueId);
		}
	});
}

function handleDoneCheckmarkClick(e) {
	e.preventDefault();
	e.stopPropagation();
	console.log('clicked');

	// Find the todo item container
	const todoItemElement = e.target.closest('.todo-item, .done-item');
	if (!todoItemElement) return;

	let id = todoItemElement.id;
	let todoItem = todoItems.find((item) => item.uniqueId === id);

	if (todoItem) {
		if (isDeleteMode) {
			// Delete the todo item with animation
			deleteTodoItemWithAnimation(todoItemElement, id);
		} else {
			// Toggle done status with animation
			if (!todoItem.done) {
				// Marking as done - show completion animation
				todoItemElement.classList.add('completing');
				setTimeout(() => {
					todoItem.done = true;
					saveToLocalStorage();
					renderTodoItems();
					renderDoneItems();
				}, 600);
			} else {
				// Unmarking as done - show reverse completion animation
				todoItemElement.classList.add('completing');
				setTimeout(() => {
					todoItem.done = false;
					saveToLocalStorage();
					renderTodoItems();
					renderDoneItems();
				}, 600);
			}
		}
	}
}

function renderDoneItems() {
	doneContainer.innerHTML = '<h1>Done</h1>';
	todoItems.forEach((todoItem) => {
		if (todoItem.done) {
			createDoneItem(todoItem.title, todoItem.date, todoItem.uniqueId);
		}
	});
}

function createDoneItem(title, date, uniqueId) {
	const doneItem = document.createElement('div');
	doneItem.classList.add('done-item', 'card');
	doneItem.id = uniqueId;
	doneItem.innerHTML = `
		<div class="done-item-content">
			<h2>${title}</h2>
			<p>${date.split('-').reverse().join('-')}</p>
		</div>
		<label class="container">
    		<input type="checkbox" checked class="todo-item-checkbox">
    		<div class="checkmark"></div>
		</label>
	`;
	doneContainer.appendChild(doneItem);
}

// Delete Mode Functions
function toggleDeleteMode() {
	isDeleteMode = !isDeleteMode;

	if (isDeleteMode) {
		todoContainerWrapper.classList.add('delete-mode');
		doneContainer.classList.add('delete-mode');
	} else {
		todoContainerWrapper.classList.remove('delete-mode');
		doneContainer.classList.remove('delete-mode');
	}
}

function deleteTodoItem(id) {
	const index = todoItems.findIndex((item) => item.uniqueId === id);
	if (index !== -1) {
		todoItems.splice(index, 1);
		saveToLocalStorage();
		renderTodoItems();
		renderDoneItems();
	}
}

function deleteTodoItemWithAnimation(todoItemElement, id) {
	// Add deletion animation class
	todoItemElement.classList.add('deleting');

	// Wait for animation to complete, then delete
	setTimeout(() => {
		const index = todoItems.findIndex((item) => item.uniqueId === id);
		if (index !== -1) {
			todoItems.splice(index, 1);
			saveToLocalStorage();
			renderTodoItems();
			renderDoneItems();
		}
	}, 400);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
	getFromLocalStorage();
	//localStorage.clear();
	newTodoItemWrapper.addEventListener('click', handleNewTodoItemClick);

	// Delete mode toggle
	if (deleteModeToggle) {
		deleteModeToggle.addEventListener('change', toggleDeleteMode);
	}

	// Use event delegation for dynamically created checkboxes
	document.addEventListener('click', (e) => {
		if (e.target.closest('.container')) {
			handleDoneCheckmarkClick(e);
		}
	});

	// Click outside to cancel new todo form
	document.addEventListener('click', (e) => {
		// Check if the form is visible (not hidden)
		if (!newTodoItemForm.classList.contains('hidden')) {
			// Check if the click is outside the new todo item wrapper
			if (!newTodoItemWrapper.contains(e.target)) {
				resetNewTodoItem();
			}
		}
	});
});
