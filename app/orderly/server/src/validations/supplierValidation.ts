import Joi from "joi";

export const createSupplierSchema = Joi.object({
  supplierName: Joi.string().required(),
  address: Joi.string().optional(),
  taxNo: Joi.string().optional(),
  country: Joi.string().required(),
  mobileNo: Joi.string()
    .pattern(/^[0-9]{10,15}$/)
    .required(),
  email: Joi.string().email().required(),
  status: Joi.string().valid("Active", "Inactive", "Blocked").default("Active"),
});

export const updateSupplierSchema = Joi.object({
  supplierName: Joi.string().optional(),
  address: Joi.string().optional(),
  taxNo: Joi.string().optional(),
  country: Joi.string().optional(),
  mobileNo: Joi.string()
    .pattern(/^[0-9]{10,15}$/)
    .optional(),
  email: Joi.string().email().optional(),
  status: Joi.string().valid("Active", "Inactive", "Blocked").optional(),
});
