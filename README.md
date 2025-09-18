# Todo Web App

A modern, responsive todo application built with vanilla HTML, CSS, and JavaScript.

## Features

- **Task Management**: Create new tasks with title and due date
- **Status Toggle**: Mark tasks as complete or incomplete
- **Persistent Storage**: All tasks are saved to localStorage and persist between sessions
- **Delete Mode**: Toggle delete mode to remove tasks with visual feedback
- **Responsive Design**: Clean, neumorphic inspired UI designed for mobile first.
- **Smooth Animations**: Transitions and feedback for user interactions

## Project Structure

```
public/
├── index.html          # Main HTML structure
├── css/
│   └── style.css       # Main stylesheet
└── js/
    └── task.js         # Core application logic
```

## Self host

1. Clone the repository
2. Open `public/index.html` in a web browser
3. Start creating and managing your tasks!

## Live demo

Visit <https://kodeaberne.github.io/todo_web/> for a live demo!

## Technical Details

- **Frontend**: Pure HTML5, CSS3, and JavaScript (ES6+)
- **Storage**: Browser localStorage for data persistence
- **Styling**: Custom CSS with modern design principles
- **Icons**: SVG icons for consistent visual elements

## Usage

1. **Adding Tasks**: Click the plus button to reveal the form, enter a task title and due date, then click the checkmark to save
2. **Completing Tasks**: Click the checkbox next to any task to mark it as complete
3. **Deleting Tasks**: Toggle delete mode using the trash icon, then click any task to delete it
4. **Viewing Tasks**: Completed tasks appear in the "Done" column

## Browser Support

This application works in all modern browsers that support:

- ES6+ JavaScript features
- CSS Grid and Flexbox
- localStorage API
