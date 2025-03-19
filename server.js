const express = require('express');
const app = express();
const port = 3001;

// Middleware to parse JSON requests
app.use(express.json());

let tasks = [];
let idCounter = 1;

// Get all tasks, sorted by status and priority
app.get('/tasks', (req, res) => {
    const priorityOrder = { 'Low': 1, 'Medium': 2, 'High': 3 };
    const sortedTasks = tasks.sort((a, b) => {
        if (a.status === b.status) {
            return priorityOrder[b.priority] - priorityOrder[a.priority]; // Higher priority first
        }
        return a.status === 'not done' ? -1 : 1; // 'not done' first
    });
    res.json(sortedTasks);
});

// Get a single task by ID
app.get('/tasks/:id', (req, res) => {
    const task = tasks.find(t => t.id === parseInt(req.params.id));
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
});

// Search task by title
app.get('/tasks/search/:title', (req, res) => {
    const filteredTasks = tasks.filter(t => t.title.toLowerCase().includes(req.params.title.toLowerCase()));
    res.json(filteredTasks);
});

// Create a new task
app.post('/tasks', (req, res) => {
    const { title, status = 'not done', priority = 'Medium' } = req.body;
    const newTask = { id: idCounter++, title, status, priority };
    tasks.push(newTask);
    res.status(201).json(newTask);
});

// Update a task by ID
app.put('/tasks/:id', (req, res) => {
    const task = tasks.find(t => t.id === parseInt(req.params.id));
    if (!task) return res.status(404).json({ message: 'Task not found' });
    
    const { title, status, priority } = req.body;
    if (title !== undefined) task.title = title;
    if (status !== undefined && (status === 'done' || status === 'not done')) task.status = status;
    if (priority !== undefined) task.priority = priority;
    
    res.json(task);
});

// Delete a task by ID
app.delete('/tasks/:id', (req, res) => {
    const index = tasks.findIndex(t => t.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ message: 'Task not found' });
    
    tasks.splice(index, 1);
    res.json({ message: 'Task deleted successfully' });
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});