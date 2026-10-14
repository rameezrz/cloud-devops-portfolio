import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils";

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error(err.stack);

  if (err instanceof AppError) {
    res.status(err.status).json({
      message: err.message,
      status: err.status ?? 400,
    });
    return;
  }

  res.status(500).json({
    message: "Internal Server Error",
    status: 500,
  });
};
