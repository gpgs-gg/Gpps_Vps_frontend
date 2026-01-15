import React, { useState } from "react";
import LeadsNavigation from "./LeadsNavigation";

function LeadsTab() {
  const [activeTab, setActiveTab] = useState("leadsList");
   const [activeLead, setActiveLead] = useState("BulkUploadLeads");

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
    <div className="mt-24 pt-2 px-4 sm:px-6 bg-[#F8F9FB] shadow-sm border-b border-gray-200 no-print">
      <div
        className="
          grid grid-cols-2 gap-2
          sm:flex sm:flex-row sm:space-x-6 sm:space-y-0
          border-b
        "
      >
        <button
          className={tabClass("leadsList")}
          onClick={() => setActiveTab("leadsList")}
        >
        <span><i className="fas fa-ticket-alt"></i>   Leads List</span>
        </button>

        <button
          className={tabClass("CreateLead")}
          onClick={() => setActiveTab("CreateLead")}
        >
        <span><i className="fas fa-plus-circle"></i>  Create Lead</span>
        </button>
      </div>
    </div>
      <LeadsNavigation activeTab={activeTab} setActiveTab={setActiveTab}
       activeLead={activeLead} setActiveLead={setActiveLead}
      />

    </>

  );
}

export default LeadsTab;