import express from "express";
import { validate } from "../middlewares";
import { createItemSchema, updateItemSchema } from "../validations";
import {
  createItem,
  getItems,
  getItemById,
  updateItem,
  deleteItem,
  getAllActiveItemNames,
} from "../controllers";
import { upload } from "../config";

const router = express.Router();

router.post(
  "/",
  upload.array("itemImages", 5),
  validate(createItemSchema),
  createItem
);
router.get("/", getItems);
router.get("/active", getAllActiveItemNames);
router.get("/:id", getItemById);
router.put("/:id", validate(updateItemSchema), updateItem);
router.delete("/:id", deleteItem);

export default router;
