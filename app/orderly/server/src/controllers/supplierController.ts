import { NextFunction, Request, Response } from "express";
import { supplierRepository } from "../repositories";
import { AppError } from "../utils";

export const createSupplier = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const supplier = await supplierRepository.createSupplier(req.body);
    res.status(201).json(supplier);
  } catch (error: any) {
    next(error);
  }
};

export const getSuppliers = async (
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

    const suppliers = await supplierRepository.getAllSuppliers(page, limit);

    const totalSuppliers = await supplierRepository.getSupplierCount();
    const totalPages = Math.ceil(totalSuppliers / limit);

    res.status(200).json({
      page,
      limit,
      totalSuppliers,
      totalPages,
      suppliers,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllActiveSuppliersNames = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const suppliers = await supplierRepository.getAllActiveSuppliersNames();

    res.status(200).json({
      suppliers,
    });
  } catch (error) {
    next(error);
  }
};

export const getSupplierById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const supplierId = req.params.id;
    const supplier = await supplierRepository.getSupplierById(supplierId);
    res.status(200).json(supplier);
  } catch (error) {
    next(error);
  }
};

export const updateSupplier = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const supplierId = req.params.id;
    const supplier = await supplierRepository.updateSupplier(
      supplierId,
      req.body
    );
    res.status(201).json(supplier);
  } catch (error: any) {
    next(error);
  }
};

export const deleteSupplier = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const supplierId = req.params.id;
    await supplierRepository.deleteSupplier(supplierId);
    res.status(200).json({ message: "Supplier deleted successfully" });
  } catch (error: any) {
    next(error);
  }
};
