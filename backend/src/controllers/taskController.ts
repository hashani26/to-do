import { Request, Response } from 'express';
import { Task, tasks } from '../models/taskModel';

export let idCounter = 1;

const findTaskById = (id: number): Task | undefined =>
  tasks.find((t) => t.id === id);

export const getTasks = (_req: Request, res: Response) => {
  const priorityOrder = { Low: 1, Medium: 2, High: 3 };
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.status === b.status) {
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    return a.status === 'not done' ? -1 : 1;
  });
  res.json(sortedTasks);
};

export const createTask = (req: Request, res: Response) => {
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
};

export const deleteTask = (req: Request, res: Response) => {
  const index = tasks.findIndex((t) => t.id === parseInt(req.params.id));
  if (index === -1) {
    res.status(404).json({ message: 'Task not found' });
    return;
  }
  tasks.splice(index, 1);
  res.status(204).send()
};

export const updateTask = (req: Request, res: Response) => {
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
        res
          .status(400)
          .json({ message: `${dependentTask.title} must be completed first.` });
        return;
      }
    }
    task.status = status;
  }

  res.json(task);
};
