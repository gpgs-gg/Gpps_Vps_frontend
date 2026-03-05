import React, { useState } from "react";
import { useApp } from "../TicketSystem/AppProvider";
import Navigation from "./Navigation";
import { useNewBookingData } from "./services";

function Tab() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const { setSelectedClient } = useApp(null);
  const [editingClient, setEditingClient] = useState(null);
  const { data: NewBookingSheetData, isPending: isNewBookingPending } = useNewBookingData();

  const tabClass = (tab) =>
    `
    flex items-center space-x-2 px-3 py-2 text-lg font-medium rounded-md
    sm:rounded-t-lg border-b-2 transition-colors
    text-left w-full sm:w-auto
    ${activeTab === tab
      ? "text-orange-600 border-orange-600 bg-orange-50"
      : "text-black border-transparent hover:text-gray-900 hover:border-gray-300"
    }
  `;

  return (
    <>
      <div className="relative mt-24 pt-2 px-4 sm:px-6 bg-transparent w-full border-gray-200 no-print overflow-hidden">

        {/* Background Text */}
        <div className="absolute inset-0 flex items-center justify-end pointer-events-none select-none pr-6">
          <h1 className="text-[40px] font-bold text-gray-500 opacity-20 whitespace-nowrap">
            PG New BOOKING List
          </h1>
        </div>

        {/* Tabs Section */}
        <div
          className="
      relative
      grid grid-cols-2 gap-2
      sm:flex sm:flex-row sm:space-x-6 sm:space-y-0
      border-b
    "
        >
          <button
            className={tabClass("Dashboard")}
            onClick={() => setActiveTab("Dashboard")}
          >
            <span><i className="fas fa-tachometer-alt"></i> Dashboard</span>
          </button>

          <button
            className={activeTab === "Tab4" ? tabClass("Tab4") : tabClass("Tab2")}
            onClick={() => {
              setActiveTab("Tab2");
              setSelectedClient(null);
            }}
          >
            <span>
              {activeTab === "Tab4" ?
                <i className="fas fa-edit"></i> :
                <i className="fa-solid fa-table-list"></i>}
              {activeTab === "Tab4" ? " Update New Booking" : " New Booking List"}
            </span>
          </button>

          <button
            className={tabClass("Tab3")}
            onClick={() => setActiveTab("Tab3")}
          >
            <span>
              <i className="fas fa-user-plus"></i> Move to PG Client List
            </span>
          </button>
        </div>
      </div>
      <Navigation NewBookingSheetData={NewBookingSheetData} activeTab={activeTab} setActiveTab={setActiveTab} setEditingClient={setEditingClient} editingClient={editingClient}
        isNewBookingPending={isNewBookingPending}
      />

    </>

  );
}

export default Tab;