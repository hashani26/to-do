const express = require('express');
const app = express();
const port = 3001;

// Middleware to parse JSON requests
app.use(express.json());

let tasks = [
    {
        "title": "task 1",
        "status": "To do",
        "priority": "high"
    },
    {
        "title": "task 2",
        "status": "In progress",
        "priority": "medium"
    },
    {
        "title": "task 3",
        "status": "done",
        "priority": "low"
    }
];
let idCounter = 1;

// Get all tasks, sorted by status and priority
app.get('/tasks', (req, res) => {
    const sortedTasks = tasks.sort((a, b) => {
        if (a.completed === b.completed) {
            return b.priority - a.priority; // Higher priority first
        }
        return a.completed - b.completed; // Incomplete tasks first
    });
    res.json(sortedTasks);
});

// Create a new task
app.post('/tasks', (req, res) => {
    const { title, completed = false, priority = 1 } = req.body;
    const newTask = { id: idCounter++, title, completed, priority };
    tasks.push(newTask);
    res.status(201).json(newTask);
});

// Update a task by ID
app.put('/tasks/:id', (req, res) => {
    const task = tasks.find(t => t.id === parseInt(req.params.id));
    if (!task) return res.status(404).json({ message: 'Task not found' });
    
    const { title, completed, priority } = req.body;
    if (title !== undefined) task.title = title;
    if (completed !== undefined) task.completed = completed;
    if (priority !== undefined) task.priority = priority;
    
    res.json(task);
});

// Get a single task by ID
// app.get('/tasks/:id', (req, res) => {
//     const task = tasks.find(t => t.id === parseInt(req.params.id));
//     if (!task) return res.status(404).json({ message: 'Task not found' });
//     res.json(task);
// });

// Search task by title
//not found??
app.get('/tasks/search/:title', (req, res) => {
    const filteredTasks = tasks.filter(t => t.title.toLowerCase().includes(req.params.title.toLowerCase()));
    res.json(filteredTasks);
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
