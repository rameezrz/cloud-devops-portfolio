import { Request, Response, NextFunction } from "express";
import { orderRepository, supplierRepository } from "../repositories";
import { validateObjectIdOrThrow } from "../validations";
import { AppError } from "../utils";
import ExcelJS from "exceljs";
import { ISupplier } from "../models";

export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const order = await orderRepository.createOrder(req.body);
    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    validateObjectIdOrThrow(req.params.id);
    const order = await orderRepository.getOrderById(req.params.id);
    if (!order) {
      throw new AppError("Order not found", 404);
    }
    res.json(order);
  } catch (error) {
    next(error);
  }
};

export const getOrders = async (
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

    const orders = await orderRepository.getOrders(page, limit);

    const totalOrders = await orderRepository.getOrderCount();
    const totalPages = Math.ceil(totalOrders / limit);

    res.status(200).json({ page, limit, totalOrders, totalPages, orders });
  } catch (error) {
    next(error);
  }
};

export const updateOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    validateObjectIdOrThrow(req.params.id);
    const order = await orderRepository.updateOrder(req.params.id, req.body);
    if (!order) {
      throw new AppError("Order not found", 404);
    }
    res.json(order);
  } catch (error) {
    next(error);
  }
};

export const deleteOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    validateObjectIdOrThrow(req.params.id);
    const order = await orderRepository.deleteOrder(req.params.id);
    if (!order) {
      throw new AppError("Order not found", 404);
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const exportOrdersToExcel = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const orders = await orderRepository.getAllOrders();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Purchase Orders");

    worksheet.columns = [
      { header: "Order No", key: "orderNo", width: 20 },
      { header: "Order Date", key: "orderDate", width: 20 },
      { header: "Supplier", key: "supplier", width: 30 },
      { header: "Item Total", key: "itemTotal", width: 15 },
      { header: "Discount Total", key: "discountTotal", width: 15 },
      { header: "Net Amount", key: "netAmount", width: 15 },
      { header: "Created At", key: "createdAt", width: 20 },
    ];

    orders.forEach(async (order) => {
      const supplierName = (order.supplier as ISupplier)?.supplierName || "N/A";
      worksheet.addRow({
        orderNo: order.orderNo,
        orderDate: order.orderDate.toISOString().slice(0, 10),
        supplier: supplierName,
        itemTotal: order.itemTotal,
        discountTotal: order.discountTotal,
        netAmount: order.netAmount,
        createdAt: order.createdAt
          ? order.createdAt.toISOString().slice(0, 10)
          : null,
      });
    });

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=Orderly_Purchase_Orders.xlsx"
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    next(new AppError("Failed to export orders", 500));
  }
};
