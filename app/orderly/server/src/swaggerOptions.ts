import swaggerJsdoc from "swagger-jsdoc";
import YAML from "yamljs";
import path from "path";
import { deepMerge } from "./utils";

const suppliersDoc = YAML.load(path.join(__dirname, "docs/suppliers.yaml"));
const itemsDoc = YAML.load(path.join(__dirname, "docs/items.yaml"));
const ordersDoc = YAML.load(path.join(__dirname, "docs/orders.yaml"));

if (!suppliersDoc || !itemsDoc || !ordersDoc) {
  throw new Error("Failed to load the Swagger document");
}

const mergedPaths = {
  ...suppliersDoc.paths,
  ...itemsDoc.paths,
  ...ordersDoc.paths,
};

const mergedComponents = deepMerge(
  {},
  suppliersDoc.components,
  itemsDoc.components,
  ordersDoc.components
);

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Orderly API",
      version: "1.0.0",
      description: "API documentation for Orderly application.",
    },
    servers: [
      {
        url: process.env.BASE_URL ?? "http://localhost:5000",
      },
    ],
    paths: mergedPaths,
    components: mergedComponents,
  },
  apis: [],
};

export const swaggerDocs = swaggerJsdoc(swaggerOptions);
