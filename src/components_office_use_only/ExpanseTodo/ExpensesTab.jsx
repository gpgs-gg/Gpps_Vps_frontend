import React, { useState } from 'react'
import Main from './Main';

function ExpensesTab() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  //  const [activeLead, setActiveLead] = useState("BulkUploadLeads");
  //  const { setSelectedClient } = useApp();
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
       <div className="mt-24 pt-2 px-4 sm:px-6  bg-[#F8F9FB] shadow-sm  no-print">
         <div
           className="
           grid grid-cols-2 gap-2
           sm:flex sm:flex-row sm:space-x-6 sm:space-y-0
           border-b
         "
         >
           <button
             className={tabClass("Dashboard")}
             onClick={() => setActiveTab("Dashboard")}
           >
             <span><i className="fas fa-dashboard"></i> Dashboard</span>
           </button>
           <button
             className={tabClass("ExpenseList")}
             onClick={() => setActiveTab("ExpenseList")}
           >
             <span><i className="fas fa-ticket-alt"></i> Expense List</span>
           </button>
 
           <button
             className={tabClass("ExpenseCreate")}
             onClick={() => {
              //  setSelectedClient(null);          // 🔥 UPDATE MODE OFF
               // setActiveLead("BulkUploadLeads"); // किंवा CreateSingleLead
               setActiveTab("ExpenseCreate");
             }}
           >
 
             {/* <span><i className="fas fa-plus-circle"></i>  Create Expense</span> */}
           </button>
         </div>
       </div>
      <Main activeTab={activeTab} setActiveTab={setActiveTab}
         
       />
 
     </>
 
   );
}

export default ExpensesTab