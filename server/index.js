// NPM Packages
import express from "express";
import cors from "cors";
import "dotenv/config";

// DB Connection
import { connection } from "./database/connection.js";

// Routing files
import { inventoryRouter } from "./routes/inventory.js";
import { inventoryImportRouter } from "./routes/inventoryImport.js";
import { orderRouter } from "./routes/order.js";
import { supplierRouter } from "./routes/supplier.js";
import { supplierProductRouter } from "./routes/supplierProduct.js";
import { customerRouter } from "./routes/customer.js";
import { jobRouter } from "./routes/job.js";
import { supProdRouter } from "./routes/supProd.js";
import { notFound } from "./middleware/not-found.js";
import { errorHandlerMiddleware } from "./middleware/error-handler.js";
import employeeRouter from "./routes/employee.js";
import leaveRouter from "./routes/leave.js";

// Configs
const app = express();

// Middlware
app.use(express.static("./public"));
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send(
    "<h1>ERP API</h1> <a href='/api/v1/inventory'>Inventory route</a> <br> <a href='/api/v1/order'>Order route</a>"
  );
});

// API Routes
app.use("/api/v1/inventory", inventoryRouter);
app.use("/api/v1/inventory/import", inventoryImportRouter);
app.use("/api/v1/order", orderRouter);
app.use("/api/v1/supplier", supplierRouter);
app.use("/api/v1/supplierProduct", supplierProductRouter);
app.use("/api/v1/customer", customerRouter);
app.use("/api/v1/job", jobRouter);
app.use('/api/v1/employee', employeeRouter);
app.use('/api/v1/leave', leaveRouter);
app.use('/api/v1/supProd', supProdRouter)
app.use('/api/v1/supplier/genRep', supplierRouter)

// Custom error handlers
app.use(notFound);
// app.use(errorHandlerMiddleware);
app.use((err, req, res, next) => {
  console.error(err);
  errorHandlerMiddleware(err, req, res, next);
});

const port = process.env.PORT || 9000;

const start = async () => {
  try {
    await connection(process.env.MONGO_URI);
    app.listen(port, console.log(`Server is listening on port: ${port}...`));
  } catch (error) {
    console.error(error);
  }
};

start();
