import React, { useState } from "react";
import ClientNavigation from "./ClientNavigation";
import { useClientDetails } from "./services";

function ClientTab() {
    const [activeTab, setActiveTab] = useState("Dashboard");
    const [selectUpdateClient, setSelectUpdateClient] = useState(null);
    const [mode, setMode] = useState("Create New Client")

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
            <div className="relative mt-24 pt-2 px-4 sm:px-6 bg-[#F8F9FB] w-full border-gray-200 no-print overflow-hidden">

                <div className="absolute inset-0 flex items-center justify-end pointer-events-none select-none pr-6">
                    <h1 className="text-[50px] font-bold text-gray-500 opacity-20 whitespace-nowrap">
                        PG Clients List
                    </h1>   
                </div>

                {/* Tabs */}
                <div
                    className="
      relative z-10
      grid grid-cols-2 gap-2
      sm:flex sm:flex-row sm:space-x-6 sm:space-y-0
      border-b
    "
                >
                    {/* Dashboard */}
                    <button
                        className={tabClass("Dashboard")}
                        onClick={() => setActiveTab("Dashboard")}
                    >
                        <span>
                            <i className="fas fa-tachometer-alt"></i> Dashboard
                        </span>
                    </button>

                    {/* Clients List */}
                    <button
                        className={tabClass("MasterTable")}
                        onClick={() => {
                            setActiveTab("MasterTable");
                            setSelectUpdateClient(null);
                        }}
                    >
                        <span>
                            <i className="fa-solid fa-table-list"></i> PG Clients List
                        </span>
                    </button>

                    {/* Update Client */}
                    {selectUpdateClient && (
                        <button
                            className={tabClass("CreateClient")}
                            onClick={() => setActiveTab("CreateClient")}
                        >
                            <span>
                                <i className="fas fa-edit"></i> Update Client Details
                            </span>
                        </button>
                    )}
                </div>
            </div>
            <ClientNavigation activeTab={activeTab} setActiveTab={setActiveTab} selectUpdateClient={selectUpdateClient} setSelectUpdateClient={setSelectUpdateClient} mode={mode} setMode={setMode} />


        </>

    );
}

export default ClientTab;