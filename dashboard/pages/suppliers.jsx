import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { FaBoxOpen, FaPlus } from "react-icons/fa";
import SupplierDropdown from "@/components/ui/3_dot_dropdown/SupplierDropdown";
import TabBar from "../components/TabBar";
import SupplierForm from "@/components/ui/formCards/SupplierForm";
import { FaPeopleRoof, FaPenToSquare } from "react-icons/fa6";
import { fetchSuppliers } from "./api/supApi.js";
import SupplierUpdate from "@/components/ui/updateFormCards/SupplierUpdate";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const Suppliers = () => {
  const [selectedTab, setSelectedTab] = useState("Suppliers");
  const [suppliers, setSuppliers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const tabs = [
    { tab: "Suppliers", icon: <FaBoxOpen /> },
    { tab: "Add Suppliers", icon: <FaPlus /> },
    { tab: "Update Suppliers", icon: <FaPenToSquare /> },
  ];

  useEffect(() => {
    if (selectedTab === "Suppliers") {
      async function fetchSupplierData() {
        try {
          const supplierData = await fetchSuppliers();
          setSuppliers(supplierData);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }

      fetchSupplierData();
    }
  }, [selectedTab]);

  const handleDeleteSupplier = async (supPhone) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/v1/supplier/${supPhone}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setSuppliers((prevSuppliers) =>
          prevSuppliers.filter(
            (supplierItem) => supplierItem.sup_phone !== supPhone
          )
        );
      } else {
        console.error("Error deleting supplier:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting supplier:", error);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredSuppliers = suppliers.filter((supplier) =>
    supplier.sup_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Generate reports
  const generatePDF = () => {
    const doc = new jsPDF();
    const tableRows = filteredSuppliers.map((supplier) => [
      supplier.sup_name,
      supplier.sup_phone,
      supplier.sup_email,
      supplier.sup_address,
    ]);
    doc.autoTable({
      head: [["Name", "Phone Number", "E-Mail", "Address"]],
      body: tableRows,
    });
    doc.save("suppliers_report.pdf");
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="flex justify-between px-4 pt-4">
        <h2>Welcome Back, Clint</h2>
      </div>
      <TabBar
        tabs={tabs}
        selectedTab={selectedTab}
        onSelectTab={setSelectedTab}
      />
      <div className="p-4">
        {selectedTab === "Suppliers" && (
          <div className="w-full m-auto p-4 border rounded-lg bg-white overflow-y-auto">
            <div className="flex flex-wrap items-center mb-4">
              <input
                type="text"
                placeholder="Search by supplier name"
                value={searchTerm}
                onChange={handleSearch}
                className="border rounded-lg p-2 flex-1"
              />
              <button
                onClick={generatePDF}
                className="px-4 py-2 ml-4 text-white bg-green-600 hover:bg-green-800 rounded-lg transition duration-300 ease-in-out"
              >
                Download Report
              </button>
            </div>

            <div className="my-3 p-2 grid md:grid-cols-4 sm:grid-cols-3 grid-cols-2 items-center justify-between cursor-pointer">
              <span className="font-bold">Name</span>
              <span className="sm:text-left text-right font-bold">
                Phone Number
              </span>
              <span className="hidden md:grid font-bold">E-Mail</span>
              <span className="hidden sm:grid font-bold">Address</span>
            </div>
            {Array.isArray(filteredSuppliers) &&
            filteredSuppliers.length > 0 ? (
              <ul>
                {filteredSuppliers.map((supplierItem, id) => (
                  <li
                    key={id}
                    className="bg-gray-50 hover:bg-gray-100 rounded-lg my-3 p-2 grid md:grid-cols-4 sm:grid-cols-3 grid-cols-2 items-center justify-between cursor-pointer"
                  >
                    <div
                      className="flex"
                      onClick={() => {
                        console.log("Section clicked!");
                      }}
                    >
                      <div className="bg-purple-100 p-3 rounded-lg">
                        <FaPeopleRoof className="text-purple-800" />
                      </div>
                      <div className="pl-4">
                        <p className="text-gray-800 font-bold">
                          {supplierItem.sup_name}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-600 sm:text-left text-right">
                      <span className={"p-2 rounded-lg"}>
                        {supplierItem.sup_phone}
                      </span>
                    </p>
                    <p className="hidden md:flex">{supplierItem.sup_email}</p>
                    <div className="sm:flex hidden justify-between items-center">
                      <p>{supplierItem.sup_address}</p>
                      <Link
                        href={{
                          pathname: "/supplier/purchaseOrder",
                          query: {
                            productTypes: JSON.stringify(
                              supplierItem.offeredProductTypes
                            ),
                          },
                        }}
                      >
                        <div className="ml-3">
                          <button className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-800 rounded-lg transition duration-300 ease-in-out">
                            Order
                          </button>
                        </div>
                      </Link>
                      <div className="ml-3">
                        <button
                          className="px-4 py-2 text-white bg-red-600 hover:bg-red-800 rounded-lg transition duration-300 ease-in-out"
                          onClick={() =>
                            handleDeleteSupplier(supplierItem.sup_phone)
                          }
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No matching suppliers found.</p>
            )}
          </div>
        )}

        {selectedTab === "Add Suppliers" && (
          <div className="w-full m-auto p-4 border rounded-lg bg-white overflow-y-auto">
            <SupplierForm />
          </div>
        )}
        {selectedTab === "Update Suppliers" && (
          <div className="w-full m-auto p-4 border rounded-lg bg-white overflow-y-auto">
            <SupplierUpdate />
          </div>
        )}
      </div>
    </div>
  );
};

export default Suppliers;
