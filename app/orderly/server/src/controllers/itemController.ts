import { Request, Response, NextFunction } from "express";
import { itemRepository } from "../repositories";
import { AppError } from "../utils";

export const createItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log(req.files);
    const item = await itemRepository.createItem(
      req.body,
      req.files as Express.Multer.File[]
    );
    res.status(201).json(item);
  } catch (error: any) {
    next(error);
  }
};

export const getItems = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    if (page < 1 || limit < 1) {
      throw new AppError("Page and limit must be positive integers.", 400);
    }

    const items = await itemRepository.getItems(page, limit);

    const totalItems = await itemRepository.getItemCount();
    const totalPages = Math.ceil(totalItems / limit);

    res.status(200).json({ page, limit, totalItems, totalPages, items });
  } catch (error: any) {
    next(error);
  }
};

export const getAllActiveItemNames = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const suppliers = await itemRepository.getAllActiveItemNames();

    res.status(200).json({
      suppliers,
    });
  } catch (error) {
    next(error);
  }
};

export const getItemById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await itemRepository.getItemById(req.params.id);
    res.status(200).json(item);
  } catch (error: any) {
    next(error);
  }
};

export const updateItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const updatedItem = await itemRepository.updateItem(
      req.params.id,
      req.body
    );
    res.status(200).json(updatedItem);
  } catch (error: any) {
    next(error);
  }
};

export const deleteItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await itemRepository.deleteItem(req.params.id);
    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error: any) {
    next(error);
  }
};
