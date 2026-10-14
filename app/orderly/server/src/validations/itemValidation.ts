import Joi from "joi";

export const createItemSchema = Joi.object({
  itemName: Joi.string().required(),
  inventoryLocation: Joi.string().optional(),
  brand: Joi.string().optional(),
  category: Joi.string().optional(),
  supplier: Joi.string().required(),
  stockUnit: Joi.string().valid("kg", "g", "liters", "pcs").required(),
  unitPrice: Joi.number().positive().required(),
  status: Joi.string().valid("Enabled", "Disabled").default("Enabled"),
});

export const updateItemSchema = Joi.object({
  itemName: Joi.string().optional(),
  inventoryLocation: Joi.string().optional(),
  brand: Joi.string().optional(),
  category: Joi.string().optional(),
  supplier: Joi.string().optional(),
  stockUnit: Joi.string().valid("kg", "g", "liters", "pcs").optional(),
  unitPrice: Joi.number().positive().optional(),
  status: Joi.string().valid("Enabled", "Disabled").optional(),
});
