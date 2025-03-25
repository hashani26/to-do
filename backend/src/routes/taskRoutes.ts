import { Router } from 'express';
import { getTasks, createTask, deleteTask, updateTask } from '../controllers/taskController';

const router = Router();

router.get('/tasks', getTasks);
router.post('/tasks', createTask);
router.delete('/tasks/:id', deleteTask);
router.put('/tasks/:id', updateTask);

export default router;
