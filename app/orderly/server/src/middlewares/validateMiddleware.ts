import { Request, Response, NextFunction, RequestHandler } from "express";
import { ObjectSchema } from "joi";
import { AppError } from "../utils";

const validate = (schema: ObjectSchema): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    if (error) {
      res.status(400).json({ error: error.details[0].message });
      throw new AppError(error.details[0].message, 400);
    }
    next();
  };
};

export default validate;
