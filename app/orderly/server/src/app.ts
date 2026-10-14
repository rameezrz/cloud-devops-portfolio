import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { errorHandler, requestLogger } from "./middlewares";
import { swaggerDocs } from "./swaggerOptions";
import swaggerUi from "swagger-ui-express";
import supplierRoutes from "./routes/supplierRoutes";
import itemRoutes from "./routes/itemRoutes";
import orderRoutes from "./routes/orderRoutes";

dotenv.config();

const app = express();

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.get("/", (req, res) => {
  res.status(200).send("Welcome to Orderly API...");
});

app.use("/api/v1/suppliers", supplierRoutes);
app.use("/api/v1/items", itemRoutes);
app.use("/api/v1/orders", orderRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use(errorHandler);

export default app;
