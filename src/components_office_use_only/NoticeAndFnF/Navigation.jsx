

// import Leads from './Leads';

import Dashboard from "./Dashboard";
import FNFForm from "./FNFForm";
import FNFList from "./FNFList";
import NoticeAndFnFAndBedStatusList from "./NoticeAndFnFAndBedStatusList";
import NoticeForm from "./NoticeForm";
import Tab from "./Tab";

function Navigation({activeTab, setActiveTab , editingClient , setEditingClient }) {
    switch(activeTab) {
       case "Dashboard": // code block
    return <Dashboard setActiveTab={setActiveTab} activeTab={activeTab} />;
  case "Tab2": // code block
    return <NoticeAndFnFAndBedStatusList setActiveTab={setActiveTab}  activeTab={activeTab}   setEditingClient = {setEditingClient} />;
  case "Tab3":
   return <NoticeForm activeTab={activeTab}  setActiveTab={setActiveTab} editingClient = {editingClient}  setEditingClient = {setEditingClient}  />;
  case "Tab4":
   return <FNFList activeTab={activeTab}  setActiveTab={setActiveTab}  editingClient = {editingClient}  setEditingClient = {setEditingClient} />;
  case "Tab5":
   return <FNFForm activeTab={activeTab}  setActiveTab={setActiveTab} editingClient = {editingClient}  setEditingClient = {setEditingClient} />;
  default:
    // code block
}
  return (
    <div className=" max-h-[800px] border border-green-500 bg-[#F8F9FB]">
      <Tab activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  )
}

export default Navigation