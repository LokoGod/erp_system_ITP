import Supplier from "../models/supplier.js";
import { asyncWrapper } from "../middleware/async.js";
import { createCustomError } from "../errors/custom-error.js";

const getAllSupplier = asyncWrapper(async (req, res) => {
  const supplier = await Supplier.find({});
  res.status(200).json({ supplier });
});

const createSupplier = asyncWrapper(async (req, res) => {
  const supplier = await Supplier.create(req.body);
  res.status(201).json({ supplier });
});

const getSupplier = asyncWrapper(async (req, res, next) => {
  const { id: supplierID } = req.params;
  const supplier = await Supplier.findOne({ _id: supplierID });
  if (!supplier) {
    return next(
      createCustomError(`No supplier with number: ${supplierID}`, 404)
    );
  }
  res.status(200).json({ supplier });
});

const updateSupplier = asyncWrapper(async (req, res, next) => {
  const { id: supplierID } = req.params;
  const supplier = await Supplier.findOneAndUpdate(
    { _id: supplierID },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!supplier) {
    return next(
      createCustomError(`No Supplier with Number : ${supplierID}`, 404)
    );
  }

  res.status(200).json({ supplier });
});

const deleteSupplier = asyncWrapper(async (req, res) => {
  const { id: supplierID } = req.params;
  const supplier = await Supplier.findOneAndDelete({ sup_phone: supplierID });
  if (!supplier) {
    return next(
      createCustomError(`No Supplier with Number : ${supplierID}`, 404)
    );
  }
  res.status(200).json({ supplier });
});

const generateReport = asyncWrapper(async (req, res, next) => {
  try {
    const suppliers = await Supplier.find({}).populate('offeredProductTypes');
    const puppeteer = require('puppeteer');

    const generatePDFReport = async (data) => {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      
      const htmlContent = `
        <html>
          <body>
            <h1>Supplier Report</h1>
            <table>
              <tr>
                <th>Supplier Name</th>
                <th>Offered Product Types</th>
              </tr>
              ${data.map(supplier => `
                <tr>
                  <td>${supplier.sup_name}</td>
                  <td>${supplier.offeredProductTypes.map(productType => productType.name).join(', ')}</td>
                </tr>
              `).join('')}
            </table>
          </body>
        </html>
      `;

      await page.setContent(htmlContent);
      await page.pdf({ path: 'supplier_report.pdf', format: 'A4' });

      await browser.close();
    };

    await generatePDFReport(suppliers);

    res.status(200).send('Report generated successfully');
  } catch (error) {
    return next(createCustomError("Error generating report", 500));
  }
});



export {
  getAllSupplier,
  createSupplier,
  getSupplier,
  updateSupplier,
  deleteSupplier,
  generateReport,
};
