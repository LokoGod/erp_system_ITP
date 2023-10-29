import express from "express";
const supplierRouter = express.Router();

import {
  getAllSupplier,
  createSupplier,
  getSupplier,
  updateSupplier,
  deleteSupplier,
  generateReport,
} from "../controllers/supplier.js";

supplierRouter.route("/").get(getAllSupplier).post(createSupplier);
supplierRouter
  .route("/:id")
  .get(getSupplier)
  .patch(updateSupplier)
  .delete(deleteSupplier);
supplierRouter.route("/genRep").post(generateReport)

export { supplierRouter };
