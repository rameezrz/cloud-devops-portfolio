import mongoose from "mongoose";
import { AppError } from "../utils";

export const validateObjectIdOrThrow = (id: string): void => {
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid ID format", 400);
  }
};
