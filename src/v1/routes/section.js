import express from "express";
const router = express.Router();

import { verifyToken } from "../handlers/verifyToken.js";
import { create, deleteSection, update } from "../controllers/section.js";

router.post("/:boardId/sections/", verifyToken, create);

router.put("/:boardId/sections/:sectionId", verifyToken, update);

router.delete("/:boardId/sections/:sectionId", verifyToken, deleteSection);

export default router;
