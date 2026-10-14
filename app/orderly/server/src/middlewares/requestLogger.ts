import { Request, Response, NextFunction } from "express";
import { logger } from "../config";

function formatTimestamp(date: Date): string {
  const pad = (num: number) => (num < 10 ? `0${num}` : num);
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { method, url } = req;
  const start = Date.now();

  const timestamp = formatTimestamp(new Date());
  logger.info(`Incoming Request: ${method} ${url} - ${timestamp}`);

  res.on("finish", () => {
    const duration = Date.now() - start;
    const responseTimestamp = formatTimestamp(new Date());
    logger.info(
      `Response: ${res.statusCode} ${url} - ${duration}ms - ${responseTimestamp}`
    );
  });

  next();
};
