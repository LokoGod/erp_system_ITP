import React, { useState, useEffect } from "react";
import { api } from "@/utils/api";

const SupplierForm = () => {
  const [availableProductTypes, setAvailableProductTypes] = useState([]);

  const [formData, setFormData] = useState({
    sup_name: "",
    sup_address: "",
    sup_email: "",
    sup_password: "",
    sup_phone: "",
    productTypesCount: 0,
    productTypes: Array.from({ length: 10 }, () => ""),
  });

  const [validationErrors, setValidationErrors] = useState({
    sup_name: "",
    sup_address: "",
    sup_email: "",
    sup_phone: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValidationErrors({ ...validationErrors, [name]: "" });

    if (name === "sup_name" && !/^[A-Za-z\s]+$/.test(value)) {
      setValidationErrors({
        ...validationErrors,
        sup_name: "Supplier name can only contain letters and spaces.",
      });
    } else if (name === "sup_address" && value.trim() === "") {
      setValidationErrors({
        ...validationErrors,
        sup_address: "Supplier address is required.",
      });
    } else if (name === "sup_email" && !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/.test(value)) {
      setValidationErrors({
        ...validationErrors,
        sup_email: "Invalid email address.",
      });
    } else if (name === "sup_phone" && !/^\d{10}$/.test(value)) {
      setValidationErrors({
        ...validationErrors,
        sup_phone: "Supplier phone number must be exactly 10 digits.",
      });
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleProductTypeChange = (index, e) => {
    const { value } = e.target;
    const updatedProductTypes = [...formData.productTypes];
    updatedProductTypes[index] = value;
    setFormData({
      ...formData,
      productTypes: updatedProductTypes,
    });
  };

  const [submissionStatus, setSubmissionStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const productTypesIds = formData.productTypes.map((type) => {
        const matchedType = availableProductTypes.find(
          (prod) => prod.name === type
        );
        return matchedType ? matchedType._id : null;
      });

      const response = await api.post("/supplier", {
        ...formData,
        offeredProductTypes: productTypesIds.filter((id) => id),
      });

      if (response.status === 201) {
        setSubmissionStatus("success");
        console.log("Data saved:", response.data.supplier);
      } else {
        setSubmissionStatus("error");
        console.error("Error:", response.data.error);
      }
    } catch (error) {
      setSubmissionStatus("error");
      console.error("Error: ", error);
    }
  };

  useEffect(() => {
    fetch("http://localhost:5000/api/v1/supProd")
      .then((response) => response.json())
      .then((data) => {
        setAvailableProductTypes(data.supProd || []);
      })
      .catch((error) => {
        console.error("Error fetching product types:", error);
      });
  }, []);

  const renderProductTypeSelectBoxes = () => {
    const { productTypesCount, productTypes } = formData;
    const selectBoxes = [];

    for (let i = 0; i < productTypesCount; i++) {
      selectBoxes.push(
        <div key={i}>
          <select
            onChange={(e) => handleProductTypeChange(i, e)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-100 p-2.5"
            required
          >
            <option value="">Select Product Type</option>
            {availableProductTypes.map((type, index) => (
              <option key={type._id} value={type.name}>
                {type.name}
              </option>
            ))}
          </select>
        </div>
      );
    }

    return selectBoxes;
  };

  return (
    <div>
      {submissionStatus === "success" ? (
        <div className="success-message">Data saved successfully!</div>
      ) : submissionStatus === "error" ? (
        <div className="error-message">Error: Data could not be saved.</div>
      ) : (
        <form className="space-y-4" onSubmit={handleSubmit} action="#">
          <h5 className="text-xl font-medium text-black-500">
            Supplier Information
          </h5>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="sup_name"
                className="block mb-1 text-sm font-medium text-black-500"
              >
                Supplier name
              </label>
              <input
                type="text"
                name="sup_name"
                id="sup_name"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                value={formData.sup_name}
                onChange={handleInputChange}
                required
              />
              <p className="text-red-500">{validationErrors.sup_name}</p>
            </div>
            <div>
              <label
                htmlFor="sup_address"
                className="block mb-1 text-sm font-medium text-black-500"
              >
                Supplier Address
              </label>
              <input
                type="text"
                name="sup_address"
                id="sup_address"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                value={formData.sup_address}
                onChange={handleInputChange}
                required
              />
              <p className="text-red-500">{validationErrors.sup_address}</p>
            </div>
            <div>
              <label
                htmlFor="sup_email"
                className="block mb-1 text-sm font-medium text-black-500"
              >
                Supplier E-Mail
              </label>
              <input
                type="email"
                name="sup_email"
                id="sup_email"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                value={formData.sup_email}
                onChange={handleInputChange}
                required
              />
              <p className="text-red-500">{validationErrors.sup_email}</p>
            </div>
            <div>
              <label
                htmlFor="sup_phone"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Supplier Phone-Number
              </label>
              <input
                type="text"
                name="sup_phone"
                id="sup_phone"
                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={formData.sup_phone}
                onChange={handleInputChange}
                required
              />
              <p className="text-red-500">{validationErrors.sup_phone}</p>
            </div>
          </div>
          <div className="mb-6">
            <label
              htmlFor="productTypesCount"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Number of Product Types
            </label>
            <select
              name="productTypesCount"
              id="productTypesCount"
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={formData.productTypesCount}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Number of Product Types</option>
              {[...Array(10)].map((_, index) => (
                <option key={index} value={index + 1}>
                  {index + 1}
                </option>
              ))}
            </select>
          </div>
          {renderProductTypeSelectBoxes()}
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

export default SupplierForm;