import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const port = 3001;

app.use(
  cors({
    origin: true, //remove for production
    optionsSuccessStatus: 200,
    methods: ['GET', 'PUT', 'POST', 'DELETE']
  })
);

// Middleware to parse JSON requests
app.use(express.json());

type Task = {
  id: number;
  title: string;
  status: 'done' | 'not done';
  priority: 'Low' | 'Medium' | 'High';
  recurrence?: 'daily' | 'weekly' | 'monthly';
  dependency?: number;
};

let tasks: Task[] = [];
let idCounter = 1;

//function to find task by ID
const findTaskById = (id: number): Task | undefined =>
  tasks.find((t) => t.id === id);

// Get all tasks, sorted by status and priority
app.get('/tasks', (_req: Request, res: Response) => {
  const priorityOrder = { Low: 1, Medium: 2, High: 3 };
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.status === b.status) {
      return priorityOrder[b.priority] - priorityOrder[a.priority]; // Higher priority first
    }
    return a.status === 'not done' ? -1 : 1; // 'not done' first
  });
  res.json(sortedTasks);
});

// Create a new task
app.post('/tasks', (req: Request, res: Response) => {
  const {
    title,
    status = 'not done',
    priority = 'Medium',
    recurrence,
    dependency,
  } = req.body;
  const newTask: Task = {
    id: idCounter++,
    title,
    status,
    priority,
    recurrence,
    dependency,
  };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// Delete a task by ID
app.delete('/tasks/:id', (req: Request, res: Response) => {
  const index = tasks.findIndex((t) => t.id === parseInt(req.params.id));
  if (index === -1) {
    res.status(404).json({ message: 'Task not found' });
    return;
  }

  tasks.splice(index, 1);
  res.json({ message: 'Task deleted successfully' });
});

// Update a task by ID
app.put('/tasks/:id', (req: Request, res: Response) => {
  const task = findTaskById(parseInt(req.params.id));
  if (!task) {
    res.status(404).json({ message: 'Task not found' });
    return;
  }

  const { title, status, priority, recurrence, dependency } = req.body;

  if (title) task.title = title;
  if (priority) task.priority = priority;
  if (recurrence) task.recurrence = recurrence;
  if (dependency) task.dependency = dependency;

  if (status) {
    if (task.dependency) {
      const dependentTask = findTaskById(task.dependency);
      if (dependentTask && dependentTask.status !== 'done') {
        res.status(400).json({
          message: `${dependentTask.title} must be completed first.`,
        });
        return;
      }
    }
    task.status = status;
  }

  res.json(task);
});

// // Get a single task by ID
// app.get('/tasks/:id', (req: Request, res: Response) => {
//   const task = findTaskById(parseInt(req.params.id));
//   task ? res.json(task) : res.status(404).json({ message: 'Task not found' });
// });

// Search task by title
app.get('/tasks/search/:title', (req: Request, res: Response) => {
  const filteredTasks = tasks.filter((t) =>
    t.title.toLowerCase().includes(req.params.title.toLowerCase())
  );
  res.json(filteredTasks);
});

// // Filter tasks by status and priority using query parameters
// app.get('/tasks', (req: Request, res: Response) => {
//     const { status, priority } = req.query;
//     console.log("🚀 ~ app.get ~ status:", status)
//     let filteredTasks = tasks;

//     if (status && ['done', 'not done'].includes(status as string)) {
//         filteredTasks = filteredTasks.filter(task => task.status === status);
//     }

//     if (priority && ['Low', 'Medium', 'High'].includes(priority as string)) {
//         filteredTasks = filteredTasks.filter(task => task.priority === priority);
//     }

//     res.json(filteredTasks);
// });

// Function to handle recurring tasks
const handleRecurringTasks = (): void => {
  const now = new Date();
  const recurrenceRules: Record<string, boolean> = {
    daily: true,
    weekly: now.getDay() === 0, // Recur every Sunday
    monthly: now.getDate() === 1, // Recur on the 1st of every month
  };

  tasks.forEach((task) => {
    if (task.recurrence && recurrenceRules[task.recurrence]) {
      tasks.push({
        id: idCounter++,
        title: task.title,
        status: 'not done',
        priority: task.priority,
        recurrence: task.recurrence,
        dependency: task.dependency,
      });
    }
  });
};

// Run recurring task handler every day at midnight
setInterval(handleRecurringTasks, 24 * 60 * 60 * 1000);

// Start server
app.listen(port, () => {
  console.log(`cors Server running at http://localhost:${port}`);
});

export default app