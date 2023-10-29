import React, { useEffect } from "react";
import { useState } from "react";
import { api } from "@/utils/api";
import { fetchSuppliers } from "@/pages/api/supApi";

const InventoryForm = () => {
  const [formData, setFormData] = useState({
    inv_pro_name: "",
    sku: "",
    inv_pro_description: "",
    inv_pro_cost: "",
    inv_pro_selling: "",
    inv_pro_warranty: "",
    inv_pro_quantity: "",
    inv_pro_reorder_level: "",
    supplier: "",
  });

  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    async function fetchSupplierData() {
      try {
        const supplierData = await fetchSuppliers();
        setSuppliers(supplierData);
      } catch (error) {
        console.error("Error fetching suppliers:", error);
      }
    }
    fetchSupplierData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let errorMessage = "";

    if (name === "inv_pro_name" && !/^[A-Za-z\s]+$/.test(value)) {
      errorMessage = "Product name can only contain letters and spaces.";
    } else if (name === "sku" && !/^[A-Za-z0-9-]+$/.test(value)) {
      errorMessage = "Invalid SKU format. Only letters, numbers, and hyphens are allowed.";
    } else if (["inv_pro_cost", "inv_pro_selling", "inv_pro_warranty", "inv_pro_quantity", "inv_pro_reorder_level"].includes(name) && !/^\d+$/.test(value)) {
      errorMessage = `${name.split("_").pop()} must be a valid number.`;
    }

    if ((name.includes("inv_pro_cost") || name.includes("inv_pro_selling") || name.includes("inv_pro_warranty") || name.includes("inv_pro_quantity") || name.includes("inv_pro_reorder_level")) && isNaN(value)) {
      errorMessage = "Please enter a valid number.";
    }

    setFormData({
      ...formData,
      [name]: value,
    });
    setValidationErrors((prevState) => ({
      ...prevState,
      [name]: errorMessage,
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const selectedSupplierId = formData.supplierId;
      const response = await api.post("/inventory", {
        ...formData,
        supplierId: selectedSupplierId,
      });

      if (response.status === 201) {
        // Data successfully posted to mongo
        setSubmissionStatus("success");
        console.log("Data saved:", response.data.inventory);
      } else {
        setSubmissionStatus("error");
        console.error("Error:", response.data.error);
      }
    } catch (error) {
      setSubmissionStatus("error");
      console.error("Error: ", error);
    }
  };

  return (
    <div>
      {submissionStatus === "success" ? (
        <div className="success-message">Data saved successfully!</div>
      ) : submissionStatus === "error" ? (
        <div className="error-message">Error: Data could not be saved.</div>
      ) : (
        <form className="space-y-4" onSubmit={handleSubmit} action="#">
          <h5 className="text-xl font-medium text-black-500">Product Information</h5>
          <div>
            <label htmlFor="name" className="block mb-1 text-sm font-medium text-black-500">
              Product name
            </label>
            <input
              type="text"
              name="inv_pro_name"
              id="inv_pro_name"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              value={formData.inv_pro_name}
              onChange={handleInputChange}
              required
            />
            <p className="text-red-500">{validationErrors.inv_pro_name}</p>
          </div>
          <div>
            <label htmlFor="sku" className="block mb-1 text-sm font-medium text-black-500">
              SKU
            </label>
            <input
              type="text"
              name="sku"
              id="sku"
              placeholder="SSD-007"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              value={formData.sku}
              onChange={handleInputChange}
              required
            />
            <p className="text-red-500">{validationErrors.sku}</p>
          </div>
          <div>
            <label htmlFor="supplier" className="block mb-1 text-sm font-medium text-black-500">
              Supplier
            </label>
            <select
              id="supplier"
              name="supplier"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
              onChange={handleInputChange}
              required
            >
              <option value="">Select Supplier</option>
              {suppliers.map((supplier) => (
                <option key={supplier._id} value={supplier._id}>
                  {supplier.sup_name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="description" className="block mb-1 text-sm font-medium text-black-500">
              Description
            </label>
            <textarea
              name="inv_pro_description"
              id="inv_pro_description"
              rows="4"
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Product description..."
              value={formData.inv_pro_description}
              onChange={handleInputChange}
            ></textarea>
          </div>
          <div>
            <label htmlFor="cost" className="block mb-1 text-sm font-medium text-black-500">
              Cost per unit
            </label>
            <input
              type="number"
              name="inv_pro_cost"
              id="inv_pro_cost"
              placeholder="Rs."
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              value={formData.inv_pro_cost}
              onChange={handleInputChange}
              required
            />
            <p className="text-red-500">{validationErrors.inv_pro_cost}</p>
          </div>
          <div>
            <label htmlFor="price" className="block mb-1 text-sm font-medium text-black-500">
              Selling price per unit
            </label>
            <input
              type="number"
              name="inv_pro_selling"
              id="inv_pro_selling"
              placeholder="Rs."
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              value={formData.inv_pro_selling}
              onChange={handleInputChange}
              required
            />
            <p className="text-red-500">{validationErrors.inv_pro_selling}</p>
          </div>
          <div>
            <label htmlFor="warranty" className="block mb-1 text-sm font-medium text-black-500">
              Warranty
            </label>
            <input
              type="number"
              name="inv_pro_warranty"
              id="inv_pro_warranty"
              placeholder="days"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              value={formData.inv_pro_warranty}
              onChange={handleInputChange}
              required
            />
            <p className="text-red-500">{validationErrors.inv_pro_warranty}</p>
          </div>
          <div>
            <label htmlFor="stock_in_hand" className="block mb-1 text-sm font-medium text-black-500">
              Quantity
            </label>
            <input
              type="number"
              name="inv_pro_quantity"
              id="inv_pro_quantity"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              value={formData.inv_pro_quantity}
              onChange={handleInputChange}
              required
            />
            <p className="text-red-500">{validationErrors.inv_pro_quantity}</p>
          </div>
          <div>
            <label htmlFor="reorder_level" className="block mb-1 text-sm font-medium text-black-500">
              Reorder level
            </label>
            <input
              type="number"
              name="inv_pro_reorder_level"
              id="inv_pro_reorder_level"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              value={formData.inv_pro_reorder_level}
              onChange={handleInputChange}
              required
            />
            <p className="text-red-500">{validationErrors.inv_pro_reorder_level}</p>
          </div>
          <button
            type="submit"
            className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            Save
          </button>
        </form>
      )}
    </div>
  );
};

export default InventoryForm;
