import { Router } from "express";
import { createTask, deleteTask, getAllTasks, getTaskById, updateTask } from "./controllers";

const router = Router();

router.post("/", createTask);
router.get("/", getAllTasks);
router.patch("/:id", updateTask);
router.get("/:id", getTaskById);
router.delete("/:id", deleteTask);

export default router;