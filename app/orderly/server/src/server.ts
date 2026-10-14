import mongoose from "mongoose";
import app from "./app";
import { ENV } from "./config";

const PORT = ENV.PORT || 5000;
const DATABASE_URL = ENV.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("Error: DATABASE_URL is not defined.");
  process.exit(1);
}

const startServer = async () => {
  try {
    await mongoose.connect(DATABASE_URL);
    console.log("Database connected successfully");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};

process.on("SIGINT", async () => {
  console.log("Received SIGINT. Closing server...");
  await mongoose.disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("Received SIGTERM. Closing server...");
  await mongoose.disconnect();
  process.exit(0);
});

startServer();
