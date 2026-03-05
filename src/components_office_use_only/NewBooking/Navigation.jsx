
import Dashboard from './Dashboard';
import NewBookingForm from './NewBookingForm';
import NewBookingTable from './NewBookingTable';
import Tab from './Tab';
// import Leads from './Leads';

function Navigation({activeTab, setActiveTab , setEditingClient, editingClient , NewBookingSheetData , isNewBookingPending}) {

    switch(activeTab) {
       case "Dashboard":
    // code block
    return <Dashboard setActiveTab={setActiveTab} activeTab={activeTab} NewBookingSheetData = {NewBookingSheetData}  isNewBookingPending = {isNewBookingPending}/>;
    
  case "Tab2":
    // code block
    return <NewBookingTable setActiveTab={setActiveTab}  activeTab={activeTab} setEditingClient={setEditingClient} editingClient={editingClient} NewBookingSheetData = {NewBookingSheetData} isNewBookingPending = {isNewBookingPending}/>;
  case "Tab3":
   return <NewBookingTable activeTab={activeTab}  setActiveTab={setActiveTab} setEditingClient={setEditingClient} editingClient={editingClient} NewBookingSheetData = {NewBookingSheetData}/>;
  case "Tab4":
   return <NewBookingForm activeTab={activeTab}  setActiveTab={setActiveTab} editingClient={editingClient} NewBookingSheetData = {NewBookingSheetData}/>;
  default:
    // code block
}
  return (
    <div className=" max-h-[800px] border border-green-500 bg-[#F8F9FB]">
      <Tab activeTab={activeTab} setActiveTab={setActiveTab} NewBookingSheetData = {NewBookingSheetData}/>
    </div>
  )
}

export default Navigation