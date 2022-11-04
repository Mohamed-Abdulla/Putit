import express from "express";
const router = express.Router();
import { verifyToken } from "../handlers/verifyToken.js";
import { create, deleteTask, update, updatePosition } from "../controllers/task.js";

router.post("/:boardId/tasks/", verifyToken, create);

router.put("/:boardId/tasks/update-position", verifyToken, updatePosition);

router.delete("/:boardId/tasks/:taskId", verifyToken, deleteTask);

router.put("/:boardId/tasks/:taskId", verifyToken, update);

export default router;
