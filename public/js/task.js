// Constants
const ANIMATION_DURATION = 300;
const COMPLETION_ANIMATION_DURATION = 600;
const DELETE_ANIMATION_DURATION = 400;
const STORAGE_KEY = 'todoItems';

// DOM Elements
const elements = {
	todoContainerWrapper: document.querySelector('.todo-container-wrapper'),
	todoContainer: document.querySelector('.todo-container'),
	doneContainer: document.querySelector('.done-container'),
	todoColumn: document.querySelector('.todo-column'),
	doneColumn: document.querySelector('.done-column'),
	newTodoItem: document.querySelector('.new-todo-item'),
	newTodoItemForm: document.querySelector('.new-todo-item-form'),
	newTodoItemWrapper: document.querySelector('.new-todo-item-wrapper'),
	plus: document.querySelector('#plus'),
	checkmark: document.querySelector('#checkmark'),
	deleteModeToggle: document.querySelector('#delete-mode-toggle'),
};

// Global state
let isDeleteMode = false;

// Storage functions
function saveToLocalStorage() {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(todoItems));
}

function getFromLocalStorage() {
	const storedTodoItems = localStorage.getItem(STORAGE_KEY);
	todoItems = storedTodoItems ? JSON.parse(storedTodoItems) : [];
	renderAllItems();
	if (!storedTodoItems) saveToLocalStorage();
}

// Todo item functions
function createTodoObject(title, date, uniqueId) {
	const todoObject = { title, date, uniqueId, done: false };
	todoItems.push(todoObject);
	saveToLocalStorage();
	renderAllItems();
}

function createTodoItemElement(title, date, uniqueId, isDone = false) {
	const item = document.createElement('div');
	const itemClass = isDone ? 'done-item' : 'todo-item';
	const contentClass = isDone ? 'done-item-content' : 'todo-item-content';
	const checkedAttr = isDone ? 'checked' : '';

	item.classList.add(itemClass, 'card');
	item.id = uniqueId;
	item.innerHTML = `
		<div class="${contentClass}">
			<h2>${title}</h2>
			<p>${formatDate(date)}</p>
		</div>
		<label class="container">
			<input type="checkbox" class="todo-item-checkbox" ${checkedAttr}>
			<div class="checkmark"></div>
		</label>
	`;
	return item;
}

// Format date
function formatDate(dateString) {
	return dateString.split('-').reverse().join('-');
}

// Handle checkmark click
function handleCheckmarkClick(e) {
	e.preventDefault();
	e.stopPropagation();

	const title = elements.newTodoItemForm.querySelector('#todo').value;
	const date = elements.newTodoItemForm.querySelector('#date').value;

	if (title && date) {
		createTodoObject(title, date, crypto.randomUUID());
		resetForm();
		resetNewTodoItem();
	} else {
		alert('Please fill in all fields');
	}
}

// Reset form
function resetForm() {
	elements.newTodoItemForm.querySelector('#todo').value = '';
	elements.newTodoItemForm.querySelector('#date').value = '';
}

// Handle new todo item click
function handleNewTodoItemClick(e) {
	e.preventDefault();
	if (
		elements.newTodoItemForm.classList.contains('hidden') &&
		e.target.closest('.new-todo-item')
	) {
		showForm();
	}
}

// Show form
function showForm() {
	elements.plus.classList.add('hidden');
	elements.checkmark.classList.remove('hidden');
	elements.newTodoItemForm.classList.remove('hidden');
	elements.newTodoItemWrapper.classList.add('active');
	animateForm('showing');
}

// Reset new todo item
function resetNewTodoItem() {
	animateForm('hiding', () => {
		elements.plus.classList.remove('hidden');
		elements.checkmark.classList.add('hidden');
		elements.newTodoItemForm.classList.add('hidden');
		elements.newTodoItemWrapper.classList.remove('active');
	});
}

// Animate form
function animateForm(animationClass, callback) {
	elements.newTodoItemForm.classList.add(animationClass);
	setTimeout(() => {
		elements.newTodoItemForm.classList.remove(animationClass);
		if (callback) callback();
	}, ANIMATION_DURATION);
}

// Render all items
function renderAllItems() {
	renderTodoItems();
	renderDoneItems();
}

// Render todo items
function renderTodoItems() {
	const todoHeader = document.querySelector('.todo-header');
	elements.todoContainer.innerHTML = '';
	elements.todoContainer.appendChild(todoHeader);

	todoItems
		.filter((item) => !item.done)
		.forEach((item) => {
			elements.todoContainer.appendChild(
				createTodoItemElement(item.title, item.date, item.uniqueId),
			);
		});
}

// Render done items
function renderDoneItems() {
	elements.doneContainer.innerHTML = '<h1>Done</h1>';
	todoItems
		.filter((item) => item.done)
		.forEach((item) => {
			elements.doneContainer.appendChild(
				createTodoItemElement(item.title, item.date, item.uniqueId, true),
			);
		});
}

// Handle done checkmark click
function handleDoneCheckmarkClick(e) {
	e.preventDefault();
	e.stopPropagation();

	const todoItemElement = e.target.closest('.todo-item, .done-item');
	if (!todoItemElement) return;

	const id = todoItemElement.id;
	const todoItem = todoItems.find((item) => item.uniqueId === id);
	if (!todoItem) return;

	if (isDeleteMode) {
		deleteTodoItemWithAnimation(todoItemElement, id);
	} else {
		toggleTodoStatus(todoItem, todoItemElement);
	}
}

// Toggle todo status
function toggleTodoStatus(todoItem, element) {
	element.classList.add('completing');
	setTimeout(() => {
		todoItem.done = !todoItem.done;
		saveToLocalStorage();
		renderAllItems();
	}, COMPLETION_ANIMATION_DURATION);
}

// Toggle delete mode
function toggleDeleteMode() {
	isDeleteMode = !isDeleteMode;
	const columns = [elements.todoColumn, elements.doneColumn];
	columns.forEach((column) => column.classList.toggle('delete-mode', isDeleteMode));
}

// Delete todo item with animation
function deleteTodoItemWithAnimation(todoItemElement, id) {
	todoItemElement.classList.add('deleting');
	setTimeout(() => {
		const index = todoItems.findIndex((item) => item.uniqueId === id);
		if (index !== -1) {
			todoItems.splice(index, 1);
			saveToLocalStorage();
			renderAllItems();
		}
	}, DELETE_ANIMATION_DURATION);
}

// Event listeners
document.addEventListener('DOMContentLoaded', getFromLocalStorage);

document.addEventListener('click', (e) => {
	// Handle new todo item click
	if (e.target.closest('.new-todo-item-wrapper')) {
		handleNewTodoItemClick(e);
	}

	// Handle checkmark click for new todo form
	if (e.target.matches('#checkmark')) {
		handleCheckmarkClick(e);
	}

	// Handle checkbox clicks (todo/done items)
	if (e.target.closest('.container')) {
		handleDoneCheckmarkClick(e);
	}

	// Click outside to cancel new todo form
	if (
		!elements.newTodoItemForm.classList.contains('hidden') &&
		!elements.newTodoItemWrapper.contains(e.target)
	) {
		resetNewTodoItem();
	}
});

// Handle delete mode toggle
document.addEventListener('change', (e) => {
	if (e.target.matches('#delete-mode-toggle')) {
		toggleDeleteMode();
	}
});
