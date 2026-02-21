import React from 'react'
import ExpensesTab from './ExpensesTab';
import ExpenseList from './ExpenseList';
import Dashboard from './Dashboad';

function Main({activeTab, setActiveTab  , activeLead, setActiveLead}) {
     switch(activeTab) {
       case "Dashboard":
    // code block
    return <Dashboard setActiveTab={setActiveTab} activeLead={activeLead} setActiveLead={setActiveLead} />;
       case "ExpenseList":
    // code block
    return <ExpenseList setActiveTab={setActiveTab} activeLead={activeLead} setActiveLead={setActiveLead} />;
    
  case "ExpenseCreate":
    // code block
    // return <ExpensesFrom setActiveTab={setActiveTab} activeLead={activeLead} setActiveLead={setActiveLead} />;
  default:
    // code block
}
  return (
    <div  className=" max-h-[800px] border border-gray-50 bg-[#F8F9FB]">
      <ExpensesTab/>
    </div>
  )
}

export default Main