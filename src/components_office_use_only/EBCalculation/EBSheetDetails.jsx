import React, { useEffect, useState } from 'react'
// import { usePropertyData } from '../EBCalculation/service'
import CryptoJS from 'crypto-js';
import { SECRET_KEY } from '../../Config';
// ================= MOCK DATA (AS PROVIDED) =================


const propertyData = {
  propertyCode: 'RH18PVNL17',
  billingPeriod: {
    ebStartDate: '17 Nov 2025',
    ebEndDate: '17 Dec 2025',
  },
  propertySummary: {
    propertyEB: 10901,
    propertyEBUnits: 0,
    propertyFreeEB: 5160,
    ebToBeRecovered: 5741,
  },
  clients: [
    {
      clientID: 'Client20_RH18PVNL17_14 Nov 2025',
      clientName: 'Swathi M Naik',
      totalDays: 31,
      adjFreeEB: 0,
      freeEB: 248,
      ceb: 286.97,
      aceb: 0,
      adjEB: 0,
      totalClientEB: 286.97,
      comments: 'N/A',
    },
    {
      clientID: 'Client08_RH18PVNL17_08 Nov 2025',
      clientName: 'Vedika pillay',
      totalDays: 18,
      adjFreeEB: 104,
      freeEB: 248,
      ceb: 155.93,
      aceb: 0,
      adjEB: 0,
      totalClientEB: 155.93,
      comments: 'N/A',
    },
    {
      clientID: 'Client07_RH18PVNL17_30 Nov 2025',
      clientName: 'Vani Jain',
      totalDays: 18,
      adjFreeEB: 0,
      freeEB: 144,
      ceb: 155.93,
      aceb: 0,
      adjEB: 0,
      totalClientEB: 155.93,
      comments: 'N/A',
    },
    {
      clientID: 'Client02_RH18PVNL17_02 Dec 2025',
      clientName: 'Dr. Dhanashree Kamalakar Bhosale',
      totalDays: 7,
      adjFreeEB: 0,
      freeEB: 56,
      ceb: 58.93,
      aceb: 0,
      adjEB: 0,
      totalClientEB: 58.93,
      comments: 'N/A',
    },
    {
      clientID: 'Client23_RH18PVNL17_13 Nov 2025',
      clientName: 'Rohini Sikariya',
      totalDays: 31,
      adjFreeEB: 0,
      freeEB: 248,
      ceb: 286.97,
      aceb: 0,
      adjEB: 0,
      totalClientEB: 286.97,
      comments: 'N/A',
    },
    {
      clientID: 'Client20_RH18PVNL17_14 Nov 2025',
      clientName: 'Swathi M Naik',
      totalDays: 31,
      adjFreeEB: 0,
      freeEB: 248,
      ceb: 286.97,
      aceb: 0,
      adjEB: 0,
      totalClientEB: 286.97,
      comments: 'N/A',
    },
    {
      clientID: 'Client08_RH18PVNL17_08 Nov 2025',
      clientName: 'Vedika pillay',
      totalDays: 18,
      adjFreeEB: 104,
      freeEB: 248,
      ceb: 155.93,
      aceb: 0,
      adjEB: 0,
      totalClientEB: 155.93,
      comments: 'N/A',
    },
    {
      clientID: 'Client07_RH18PVNL17_30 Nov 2025',
      clientName: 'Vani Jain',
      totalDays: 18,
      adjFreeEB: 0,
      freeEB: 144,
      ceb: 155.93,
      aceb: 0,
      adjEB: 0,
      totalClientEB: 155.93,
      comments: 'N/A',
    },
    {
      clientID: 'Client02_RH18PVNL17_02 Dec 2025',
      clientName: 'Dr. Dhanashree Kamalakar Bhosale',
      totalDays: 7,
      adjFreeEB: 0,
      freeEB: 56,
      ceb: 58.93,
      aceb: 0,
      adjEB: 0,
      totalClientEB: 58.93,
      comments: 'N/A',
    },
    {
      clientID: 'Client23_RH18PVNL17_13 Nov 2025',
      clientName: 'Rohini Sikariya',
      totalDays: 31,
      adjFreeEB: 0,
      freeEB: 248,
      ceb: 286.97,
      aceb: 0,
      adjEB: 0,
      totalClientEB: 286.97,
      comments: 'N/A',
    },
    {
      clientID: 'Client20_RH18PVNL17_14 Nov 2025',
      clientName: 'Swathi M Naik',
      totalDays: 31,
      adjFreeEB: 0,
      freeEB: 248,
      ceb: 286.97,
      aceb: 0,
      adjEB: 0,
      totalClientEB: 286.97,
      comments: 'N/A',
    },
    {
      clientID: 'Client08_RH18PVNL17_08 Nov 2025',
      clientName: 'Vedika pillay',
      totalDays: 18,
      adjFreeEB: 104,
      freeEB: 248,
      ceb: 155.93,
      aceb: 0,
      adjEB: 0,
      totalClientEB: 155.93,
      comments: 'N/A',
    },
    {
      clientID: 'Client07_RH18PVNL17_30 Nov 2025',
      clientName: 'Vani Jain',
      totalDays: 18,
      adjFreeEB: 0,
      freeEB: 144,
      ceb: 155.93,
      aceb: 0,
      adjEB: 0,
      totalClientEB: 155.93,
      comments: 'N/A',
    },
    {
      clientID: 'Client02_RH18PVNL17_02 Dec 2025',
      clientName: 'Dr. Dhanashree Kamalakar Bhosale',
      totalDays: 7,
      adjFreeEB: 0,
      freeEB: 56,
      ceb: 58.93,
      aceb: 0,
      adjEB: 0,
      totalClientEB: 58.93,
      comments: 'N/A',
    },
    {
      clientID: 'Client23_RH18PVNL17_13 Nov 2025',
      clientName: 'Rohini Sikariya',
      totalDays: 31,
      adjFreeEB: 0,
      freeEB: 248,
      ceb: 286.97,
      aceb: 0,
      adjEB: 0,
      totalClientEB: 286.97,
      comments: 'N/A',
    },
  ],
}

function EBSheetDetails() {
 const [decryptedUser, setDecryptedUser] = useState(null);

// const {data:MainPropertyData} = usePropertyData();

// // Decrypt user data from localStorage on component mount

   useEffect(() => {
          const encrypted = localStorage.getItem('user');
          if (encrypted) {
              try {
                  const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
                  const decrypted = bytes.toString(CryptoJS.enc.Utf8);
                  setDecryptedUser(JSON.parse(decrypted));
              } catch (error) {
                  console.error('Failed to decrypt user:', error);
              }
          }
          // const timer = setInterval(() => {
          //     setCurrentTime(new Date());
          // }, 1000);
          // return () => clearInterval(timer);
      }, []);
      




  const { propertyCode, billingPeriod, propertySummary, clients } = propertyData

  return (
    <div className=' h-screen flex flex-col gap-10 px-5'>
      {/* ================= PROPERTY SUMMARY ================= */}
      <div className=''>
        <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-7 gap-4'>
          {[
            { label: 'Property Code', value: propertyCode },
            { label: 'EB Start Date', value: billingPeriod.ebStartDate },
            { label: 'EB End Date', value: billingPeriod.ebEndDate },
            { label: 'Electricity Bill Amount', value: propertySummary.propertyEB },
            { label: 'Total Units', value: propertySummary.propertyEBUnits },
            { label: 'Total Free EB', value: propertySummary.propertyFreeEB },
            { label: 'EB To Be Recovered', value: propertySummary.ebToBeRecovered },
          ].map(({ label, value }) => (
            <div key={label} className='bg-white p-2 rounded-lg shadow'>
              <p className='text-xs font-medium text-gray-600'>{label}</p>
              <p className='md:text-lg text-md font-semibold text-gray-900'>{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ================= CLIENT TABLE (LAPTOP) ================= */}
   
       {/* 💻 Laptop View */}
<div className="max-h-[500px] overflow-y-auto">
  <table className="w-full border-collapse">
    <thead className="bg-orange-300 sticky top-0 z-20">
      <tr>
        <th className="p-3 border">Client Name</th>
        <th className="p-3 border">Total Days</th>
        {/* <th className="p-3 border">Free EB</th> */}
        <th className="p-3 border">Current EB</th>
        <th className="p-3 border">AC EB</th>
        <th className="p-3 border">Adj EB</th>
        <th className="p-3 border">Total EB</th>
      </tr>
    </thead>
    <tbody>
      {propertyData?.clients?.map((c) => (
        <tr key={c.clientID} className="hover:bg-gray-50 text-black">
          <td className="p-3 border font-semibold ">{c.clientName}</td>
          <td className="p-3 border text-center">{c.totalDays}</td>
          {/* <td className="p-3 border text-center">{c.freeEB}</td> */}
          <td className="p-3 border text-center">{c.ceb}</td>
          <td className="p-3 border text-center">{c.aceb}</td>
          <td className="p-3 border text-center">{c.adjEB}</td>
          <td className="p-3 border text-center font-semibold">{c.totalClientEB}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>


        {/* ================= CLIENT CARDS (MOBILE) ================= */}
        {/* 📱 Mobile View */}
<div className="sm:hidden space-y-4">
  {propertyData?.clients?.map((c) => (
    <div
      key={c.clientID}
      className="bg-white rounded-xl  p-4 space-y-3 shadow-md"
    >
      <div className="flex justify-between items-center bg-orange-400 p-2 rounded-lg">
        <p className="font-semibold">{c.clientName}</p>
        <span className="text-xs font-semibold px-2 py-1 rounded">
          {c.totalDays} Days
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm font-semibold">
        <p >Free EB</p><p className="text-right">{c.freeEB}</p>
        <p >Current EB</p><p className="text-right">{c.ceb}</p>
        <p >AC EB</p><p className="text-right">{c.aceb}</p>
        <p >Adj EB</p><p className="text-right">{c.adjEB}</p>
      </div>

      <div className="border-t-2 pt-2 flex justify-between font-semibold  p-2 rounded-lg">
        <span className=' text-orange-500'>Total EB</span>
        <span className='text-black'>{c.totalClientEB}</span>
      </div>
    </div>
  ))}
</div>

     
    </div>
  )
}

export default EBSheetDetails