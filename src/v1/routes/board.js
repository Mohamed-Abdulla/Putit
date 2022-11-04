import express from "express";
const router = express.Router();
import { verifyToken } from "../handlers/verifyToken.js";
import {
  create,
  deleteBoard,
  getAll,
  getFavourites,
  getOne,
  update,
  updateFavouritePosition,
  updatePosition,
} from "../controllers/board.js";

router.post("/", verifyToken, create);

router.get("/", verifyToken, getAll);

router.put("/", verifyToken, updatePosition);

router.get("/favourites", verifyToken, getFavourites);

router.put("/favourites", verifyToken, updateFavouritePosition);

router.get("/:boardId", verifyToken, getOne);

router.put("/:boardId", verifyToken, update);

router.delete("/:boardId", verifyToken, deleteBoard);

export default router;
