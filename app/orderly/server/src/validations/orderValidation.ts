import Joi from "joi";

const orderItemSchema = Joi.object({
  item: Joi.string().required(),
  orderQty: Joi.number().positive().required(),
  discount: Joi.number().min(0).optional(),
});

export const createOrderSchema = Joi.object({
  orderDate: Joi.date(),
  supplier: Joi.string().required(),
  items: Joi.array().items(orderItemSchema).min(1).required(),
});
