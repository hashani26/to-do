import { Router } from "express";
import {
  getTasks,
  createTask,
  deleteTask,
  updateTask,
  searchTask,
} from "../controllers/taskController";

const router = Router();

router.get("/tasks", getTasks);
router.post("/tasks", createTask);
router.delete("/tasks/:id", deleteTask);
router.put("/tasks/:id", updateTask);
router.get("/tasks/search", searchTask);

export default router;
