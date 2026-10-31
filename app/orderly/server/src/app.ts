import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import { errorHandler, requestLogger } from "./middlewares";
import { swaggerDocs } from "./swaggerOptions";
import swaggerUi from "swagger-ui-express";
import supplierRoutes from "./routes/supplierRoutes";
import itemRoutes from "./routes/itemRoutes";
import orderRoutes from "./routes/orderRoutes";
import mongoose from "mongoose";
import { ENV, logger } from "./config";

const ORIGIN = ENV.ORIGIN || "http://localhost:3000";

var corsOptions = {
  origin: ORIGIN,
  optionsSuccessStatus: 200
}

dotenv.config();

const app = express();

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(requestLogger);

app.get("/", (req, res) => {
  res.status(200).send("Welcome to Orderly API...");
});

app.get("/health", async (_req, res): Promise<void> => {
  const db = mongoose.connection.db;

  if (mongoose.connection.readyState !== 1 || !db) {
    res.status(503).json({ status: "unavailable" });
    return;
  }

  try {
    const result = await db.admin().ping();

    if (result.ok !== 1) {
      res.status(503).json({ status: "unavailable" });
      return;
    }

    res.status(200).json({ status: "ok" });
  } catch (error) {
    logger.error("Database health check failed", { error });
    res.status(503).json({ status: "unavailable" });
  }
});

app.use("/api/v1/suppliers", supplierRoutes);
app.use("/api/v1/items", itemRoutes);
app.use("/api/v1/orders", orderRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use(errorHandler);

export default app;
