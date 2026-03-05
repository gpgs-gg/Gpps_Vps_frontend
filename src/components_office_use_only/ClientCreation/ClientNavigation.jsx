import React from 'react'
import ClientMasterTable from './ClientMasterTable';
import CreateClient from './CreateClient';
import ClientTab from './ClientTab';
import Dashboard from './Dashboard';

// import Leads from './Leads';

function ClientNavigation({activeTab, setActiveTab  ,selectUpdateClient, setSelectUpdateClient, mode, setMode}) {
    switch(activeTab) {
       case "Dashboard":
    // code block
    return <Dashboard setActiveTab={setActiveTab} selectUpdateClient={selectUpdateClient} setSelectUpdateClient={setSelectUpdateClient} mode={mode} setMode={setMode} />;
    
  case "MasterTable":
    // code block
    return<ClientMasterTable setActiveTab={setActiveTab} selectUpdateClient={selectUpdateClient} setSelectUpdateClient={setSelectUpdateClient} mode={mode} setMode={setMode} />;
  case "CreateClient":
   return <CreateClient selectUpdateClient={selectUpdateClient} setSelectUpdateClient={setSelectUpdateClient} setActiveTab={setActiveTab} mode={mode} setMode={setMode}/>;
  default:
    // code block
}
  return (
    <div className=" max-h-[800px] border border-gray-50 bg-[#F8F9FB]">
      <ClientTab/>
    </div>
  )
}

export default ClientNavigation