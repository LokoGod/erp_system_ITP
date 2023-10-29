import React, { useState, useEffect } from "react";
import { FaCubes, FaPlus } from "react-icons/fa";
import InventoryDropdown from "@/components/ui/3_dot_dropdown/InventoryDropdown";
import { data } from "@/data/inventory";
import TabBar from "../components/TabBar"; // Update the path
import { FaCubesStacked, FaPenToSquare } from "react-icons/fa6";
import InventoryForm from "@/components/ui/formCards/InventoryForm.jsx";
import { fetchInventory } from "./api/invApi";
import InventoryUpdate from "@/components/ui/updateFormCards/InventoryUpdate";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const Inventory = () => {
  const [selectedTab, setSelectedTab] = useState("Inventory");
  const [inventory, setInventory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const tabs = [
    { tab: "Inventory", icon: <FaCubesStacked /> },
    { tab: "Add Products", icon: <FaPlus /> },
    { tab: "Update Products", icon: <FaPenToSquare /> },
  ];

  useEffect(() => {
    if (selectedTab === "Inventory") {
      async function fetchInventoryData() {
        try {
          const inventoryData = await fetchInventory();
          setInventory(inventoryData);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }

      fetchInventoryData();
    }
  }, [selectedTab]);

  const handleDeleteInventory = async (SKU) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/v1/inventory/${SKU}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setInventory((prevInventory) =>
          prevInventory.filter((inventoryItem) => inventoryItem.sku !== SKU)
        );
      } else {
        console.error("Error deleting inventory item:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting inventory item:", error);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredInventory = inventory.filter((item) =>
    item.inv_pro_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Generate report
  const generatePDF = () => {
    const doc = new jsPDF();
    const tableRows = filteredInventory.map((item) => [
      item.inv_pro_name,
      item.sku,
      item.inv_pro_quantity,
      item.inv_pro_reorder_level,
    ]);
    doc.autoTable({
      head: [["Name", "SKU", "Stock On Hand", "Reorder Level"]],
      body: tableRows,
    });
    doc.save("inventory_report.pdf");
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
        {selectedTab === "Inventory" && (
          <div className="w-full m-auto p-4 border rounded-lg bg-white overflow-y-auto">
            <div className="flex flex-wrap items-center mb-4">
              <input
                type="text"
                placeholder="Search by product name"
                value={searchTerm}
                onChange={handleSearch}
                className="border rounded-lg p-2 flex-1"
              />
              <button
                onClick={generatePDF}
                className="px-4 py-2 ml-4 mt-4 text-white bg-green-600 hover:bg-green-800 rounded-lg transition duration-300 ease-in-out"
              >
                Download Report
              </button>
            </div>

            <div className="my-3 p-2 grid grid-cols-4 items-center justify-between cursor-pointer">
              <span className="font-bold">Name</span>
              <span className="text-center font-bold">SKU</span>
              <span className="text-center font-bold">Stock On Hand</span>
              <span className="text-center font-bold mr-20">Reorder level</span>
            </div>
            {Array.isArray(filteredInventory) &&
            filteredInventory.length > 0 ? (
              <ul>
                {filteredInventory.map((inventoryItem, id) => (
                  <li
                    key={id}
                    className={`bg-gray-50 hover:bg-gray-100 rounded-lg my-3 p-2 grid md:grid-cols-4 sm:grid-cols-3 grid-cols-2 items-center justify-between cursor-pointer border ${
                      inventoryItem.inv_pro_quantity <
                      inventoryItem.inv_pro_reorder_level
                        ? "border-2 border-red-500"
                        : ""
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="bg-purple-100 p-3 rounded-lg">
                        <FaCubes className="text-purple-800" />
                      </div>
                      <div className="pl-4">
                        <p className="text-gray-800 font-bold">
                          {inventoryItem.inv_pro_name}
                        </p>
                        <p className="text-gray-800 text-sm">
                          Rs.{inventoryItem.inv_pro_selling.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="text-center">
                      <span className={"bg-green-200 p-2 rounded-lg"}>
                        {inventoryItem.sku}
                      </span>
                    </div>
                    <div className="text-center">
                      <span
                        className={
                          inventoryItem.inv_pro_quantity <
                          inventoryItem.inv_pro_reorder_level
                            ? "text-red-500 font-bold"
                            : ""
                        }
                      >
                        {inventoryItem.inv_pro_quantity}
                      </span>
                    </div>
                    <div className="text-center sm:flex justify-between items-center">
                      <p className="ml-20">
                        {inventoryItem.inv_pro_reorder_level}
                      </p>
                      <div className="ml-3">
                        <button
                          className="px-4 py-2 text-white bg-red-600 hover:bg-red-800 rounded-lg transition duration-300 ease-in-out"
                          onClick={() =>
                            handleDeleteInventory(inventoryItem.sku)
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
              <p>No matching products found.</p>
            )}
          </div>
        )}

        {selectedTab === "Add Products" && (
          <div className="w-full m-auto p-4 border rounded-lg bg-white overflow-y-auto">
            <InventoryForm />
          </div>
        )}
        {selectedTab === "Update Products" && (
          <div className="w-full m-auto p-4 border rounded-lg bg-white overflow-y-auto">
            <InventoryUpdate />
          </div>
        )}
      </div>
    </div>
  );
};

export default Inventory;
