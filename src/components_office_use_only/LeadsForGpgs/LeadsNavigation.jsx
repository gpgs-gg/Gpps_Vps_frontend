import React from 'react'
import LeadsTable from './LeadsTable';
import ClientLeads from './ClientLeads';
import LeadsTab from './LeadsTab';
// import Leads from './Leads';

function LeadsNavigation({activeTab, setActiveTab  , activeLead, setActiveLead}) {
    switch(activeTab) {
  case "leadsList":
    // code block
    return <LeadsTable setActiveTab={setActiveTab} activeLead={activeLead} setActiveLead={setActiveLead} />;
  case "CreateLead":
   return <ClientLeads activeLead={activeLead} setActiveLead={setActiveLead} setActiveTab={setActiveTab}/>;
  default:
    // code block
}
  return (
    <div className="min-h-screen bg-[#F8F9FB]">
      <LeadsTab />
    </div>
  )
}

export default LeadsNavigation