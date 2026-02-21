import React, { useEffect, useState, useMemo } from 'react'
import CryptoJS from 'crypto-js';
import { SECRET_KEY } from '../../Config';
import { format, subMonths } from "date-fns";
import LoaderPage from "../NewBooking/LoaderPage";
import { useForm, Controller } from 'react-hook-form';
import Select from "react-select";
import { useMainSheetDataForEb } from '.';
import { usePropertMasteryData } from '../TicketSystem/Services';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";



// ================= MOCK DATA (AS PROVIDED) =================

function EBSheetDetails() {

  const MONTH_SHORT_NAMES = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  // =================== use sate ===================

  const [decryptedUser, setDecryptedUser] = useState(null);
  const [ebSheetData, setEbSheetData] = useState([]);

  const { data: MainPropertyData } = usePropertMasteryData();
  // ==================== Admin Logic code ====================
  // const { data: propertyMasterData } = usePropertMasteryData();


  const { watch, control, setValue } = useForm({
    defaultValues: {
      PropertyCode: null,
    }
  });

  const selectedPropertyCode = watch("PropertyCode");

  // console.log("Selected Property Code:", selectedPropertyCode?.value);


  const filteredAdminPropertySheetData = useMemo(() => {
    return MainPropertyData?.data?.filter(
      (ele) => ele["Property Code"] === selectedPropertyCode?.value
    );
  }, [MainPropertyData, selectedPropertyCode?.value]);



  // const mainSheetIdForAdmin = useMemo(() => {
  //   if (!filteredAdminPropertySheetData || filteredAdminPropertySheetData.length === 0) return "";

  //   const sheetBaseId = filteredAdminPropertySheetData[0]["PG EB  Sheet ID"];

  //   // current month only
  //   const currentMonth = format(new Date(), "MMMyyyy"); // //
  //   // const currentMonth = ""
  //   return `${sheetBaseId},${currentMonth}`;
  // }, [filteredAdminPropertySheetData]);

const selectedMonth = watch("selectedMonth") || "";


  const mainSheetIdForAdmin = useMemo(() => {
    if (!filteredAdminPropertySheetData || filteredAdminPropertySheetData.length === 0) return "";

    const sheetBaseId = filteredAdminPropertySheetData[0]["PG EB  Sheet ID"];

    return `${sheetBaseId},${selectedMonth}`;
  }, [filteredAdminPropertySheetData, selectedMonth]);


  const ebSheetDataObjForAdmin = useMemo(() => {
    if (!ebSheetData?.data || !Array.isArray(ebSheetData.data)) return {};

    return ebSheetData.data.find(
      (item) => item.ClientID === item.ClientID
    ) || {};
  }, [ebSheetData, selectedPropertyCode?.value]);
  const employeeSelectStyles = {
    control: (base, state) => ({
      ...base,
      padding: "0.14rem 0.5rem",
      marginTop: "0.09rem",
      borderWidth: "1px",
      borderColor: state.isFocused ? "#fb923c" : "#f97316",
      borderRadius: "0.375rem",
      boxShadow: state.isFocused
        ? "0 0 0 2px rgba(251,146,60,0.5)"
        : "0 1px 2px rgba(0,0,0,0.05)",
      backgroundColor: "white",
      minHeight: "40px",
      "&:hover": { borderColor: "#fb923c" },
    }),
    option: (provided, state) => ({
      ...provided,
      color: state.isSelected ? "white" : "#fb923c",
      backgroundColor: state.isSelected ? "#fb923c" : "white",
      "&:hover": { backgroundColor: "#fed7aa" },
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999,
    }),
  };



  const ProperyOptions = MainPropertyData?.data?.map((prop) => ({
    value: prop["Property Code"],
    label: prop["Property Code"],
  })) || [];
  // ================================ client Logic Code ==============================

  // // Fetch Property Data to get Main Sheet ID

  const filteredPropertySheetData = useMemo(() => {
    return MainPropertyData?.data?.filter(
      (ele) => ele["Property Code"] === decryptedUser?.employee?.PropertyCode
    );
  }, [MainPropertyData, decryptedUser?.employee?.PropertyCode]);


const mainSheetId = useMemo(() => {
  if (!filteredPropertySheetData?.length || !selectedMonth) return "";

  const sheetBaseId = filteredPropertySheetData[0]["PG EB  Sheet ID"];
  return `${sheetBaseId},${selectedMonth}`;
}, [filteredPropertySheetData, selectedMonth]);


  const { data: ebPropertyData, isLoading, isError, isFetching, isPending } = useMainSheetDataForEb(mainSheetId || mainSheetIdForAdmin);

  useEffect(() => {
    if (!ebPropertyData) return;
    setEbSheetData(ebPropertyData);
  }, [ebPropertyData]);




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
  const sortedEbSheetData = useMemo(() => {
    if (!ebSheetData?.data || !decryptedUser?.employee?.ClientID) return [];

    const myClientId = String(decryptedUser?.employee?.ClientID);
    return [...ebSheetData.data].sort((a, b) => {
      console.log("Comparing Client IDs:", a.ClientID,);
      if (String(a.ClientID) === myClientId) return -1;
      if (String(b.ClientID) === myClientId) return 1;
      return 0;
    });
  }, [ebSheetData, decryptedUser?.employee?.ClientID]);


  useEffect(() => {
    if (decryptedUser?.role?.toLowerCase() === "client") {
      // Find the full option object in ProperyOptions that matches decryptedUser?.employee?.PropertyCode
      const selectedOption = ProperyOptions.find(
        (opt) => opt.value === decryptedUser?.employee?.PropertyCode
      );

      if (selectedOption) {
        setValue("PropertyCode", selectedOption);
      }
    }

  }, [decryptedUser, setValue]);

  const ebSheetDataObj = useMemo(() => {
    if (!ebSheetData?.data || !Array.isArray(ebSheetData.data)) return {};

    return ebSheetData.data.find(
      (item) => String(item.ClientID) === String(decryptedUser?.employee?.ClientID)
    ) || {};
  }, [ebSheetData, decryptedUser?.employee?.ClientID]);



  if (!decryptedUser || !ebSheetData) {
    return <LoaderPage />;
  }


  // 2️⃣ API failed / error
  if (isError || !ebSheetData) {
    return (
      <div className="flex items-center justify-center h-[50vh] px-5">
        <h2 className="text-xl font-semibold text-red-600">
          Please Note : Electricity Bill is not generated yet for the selected {selectedMonth} month.
     <button className='underline  text-black' onClick={() => window.location.reload()}>
  Go Back
</button>
        </h2>
      </div>
    );
  }

  // 3️⃣ No data available
  if (ebSheetData?.data?.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h2 className="text-xl font-semibold text-gray-700">
          No EB Data Available
        </h2>
      </div>
    );
  }

  // const { propertyCode, billingPeriod, propertySummary, clients } = propertyData

  // console.log("Logged clientID:", decryptedUser?.employee?.ClientID);

  // console.log(
  //   "All sheet clientIDs:",
  //   ebSheetData?.data?.map(i => i.clientID)
  // );


  return (
    <>
      {decryptedUser?.employee?.Role === 'client' && (
        <div className=" h-screen flex flex-col gap-10 ">

          {/* ================= PROPERTY SUMMARY ================= */}
          {isLoading ? (
             <LoaderPage />
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-6 gap-4 ">
                {/* Property Select */}
                <div className="col-span-2  lg:col-span-2 flex justify-evenly items-center gap-5 ">
                  <div>
                    <label className="text-sm text-gray-700 mb-1">
                      Property Code
                    </label>
                    <Controller
                      name="PropertyCode"
                      control={control}
                      render={({ field }) => {
                        // Ensure value is an option object, not just the raw value
                        const selectedOption = ProperyOptions.find(
                          (opt) => opt.value === field.value || opt.value === decryptedUser?.employee?.PropertyCode
                        ) || null;

                        return (
                          <Select
                            {...field}
                            value={selectedOption}
                            onChange={(option) => field.onChange(option?.value)} // store only the value in the form
                            isDisabled={decryptedUser?.employee?.Role === 'client'}
                            placeholder="Select Property Code"
                            isClearable
                            styles={employeeSelectStyles}
                            options={ProperyOptions} // pass all options, not just selected
                          />
                        );
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black-700 mb-1">
                      Select Month
                    </label>
                    <Controller
                      name="selectedMonth"
                      control={control}
                      rules={{ required: "Please select a month" }}
                      render={({ field }) => {

                        let selectedDate = null;

                        if (field.value) {
                          const monthStr = field.value.slice(0, 3); // "Dec"
                          const yearStr = field.value.slice(3);     // "2024"
                          const monthIndex = MONTH_SHORT_NAMES.indexOf(monthStr);

                          if (monthIndex !== -1) {
                            selectedDate = new Date(Number(yearStr), monthIndex, 1);
                          }
                        } else {
                          // Default to current month
                          const now = new Date();
                          selectedDate = new Date(now.getFullYear(), now.getMonth(), 1);
                          // Update the field value so the form knows about it
                          const defaultMonth = `${MONTH_SHORT_NAMES[now.getMonth()]}${now.getFullYear()}`;
                          field.onChange(defaultMonth);
                        }

                        return (
                          <DatePicker
                            selected={selectedDate}
                            onChange={(date) => {
                              if (!date) return field.onChange("");

                              const month = MONTH_SHORT_NAMES[date.getMonth()];
                              const year = date.getFullYear();
                              const formatted = `${month}${year}`;

                              field.onChange(formatted);
                            }}
                            dateFormat="MMM yyyy"
                            showMonthYearPicker
                            popperPlacement="right-start"
                            placeholderText="Select month"
                            className="w-full border focus:ring-1 focus:ring-orange-500 px-3 py-2 border-orange-500 outline-none rounded-md"
                          />
                        );
                      }}
                    />

                  </div>

                </div>

                {[
                  {
                    label: 'Electricity Bill Cycle',
                    value: `${ebSheetDataObjForAdmin?.EBStartDate ?? '--'} - ${ebSheetDataObjForAdmin?.EBEndDate ?? '--'}`
                  },
                  { label: 'Common Electricity Bill', value: ebSheetDataObjForAdmin?.CommonEB },
                  { label: 'Total Flat Units', value: ebSheetDataObjForAdmin?.FlatTotalUnits },
                  { label: 'Total Free Electricity Bill', value: ebSheetDataObjForAdmin?.PropertyFreeEB },
                  { label: 'Electricity Bill To Be Recovered', value: ebSheetDataObjForAdmin?.EBToBeRecovered },

                  { label: 'Flat Total Electricity Bill', value: ebSheetDataObjForAdmin?.FlatTotalEB },
                  { label: 'Per Unit Cost', value: ebSheetDataObjForAdmin?.PerUnitCost },
                  { label: 'AC Total Units', value: ebSheetDataObjForAdmin?.ACTotalUnits },
                  { label: 'AC Total Electricity Bill', value: ebSheetDataObjForAdmin?.ACTotalEB },

                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="bg-white px-2 py-1.5 rounded-md shadow-sm min-h-[58px] flex flex-col justify-center"
                  >
                    <p className="text-[13px] font-medium text-gray-500 leading-tight">
                      {label}
                    </p>
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {value ?? '--'}
                    </p>
                  </div>
                ))}

              </div>
              {/* ================= CLIENT TABLE (LAPTOP) ================= */}
              <div className="max-h-[500px] whitespace-nowrap overflow-y-auto">
                <table className="w-full ">
                  <thead className="bg-orange-300 sticky top-0 z-20">
                    <tr>
                      <th className="p-3  bg-orange-300 sticky left-0 border">Client Name</th>
                      <th className="p-3 border">Total Days</th>
                      {/* <th className="p-3 border">Adjusted Free EB</th> */}
                      {/* <th className="p-3 border">Free Electricity Bill</th> */}
                      <th className="p-3 border">Common EB Per Client</th>
                      <th className="p-3 border">AC EB Per Client</th>
                      {/* <th className="p-3 border">Adjusted EB</th> */}
                      <th className="p-3 border">Total EB Per Client </th>
                      {/* <th className="p-3 border">Comments (1)</th>
                      <th className="p-3 border">Comments (2)</th> */}
                      <th className="p-3 border">Vacation Period (1)</th>
                      <th className="p-3 border">Vacation Period (2)</th>


                    </tr>
                  </thead>

                  <tbody>
                    {
                      sortedEbSheetData?.filter((c) => c.ClientName !== "").map((c) => (
                        <tr key={c.ClientID} className="hover:bg-gray-50 text-black">
                          <td className="p-3 bg-orange-300 sticky left-0 border font-semibold">{c.ClientName}</td>
                          <td className="p-3 border flex justify-center items-center font-semibold">{c.TotalDays}</td>
                          {/* <td className="p-3 border text-center">{c.AdjFreeEB}</td> */}
                          {/* <td className="p-3 border text-center">{c.FreeEB}</td> */}
                          <td className="p-3 border text-center">{c.CEB}</td>
                          <td className="p-3 border text-center">{c.ACEB}</td>
                          {/* <td className="p-3 border text-center">{c.AdjEB}</td> */}
                          <td className="p-3 border text-center">{c.TotalClientEB}</td>
                          {/* <td className="p-3 border text-center">{c.Comments1}</td>
                          <td className="p-3 border text-center">{c.Comments2}</td> */}
                          <td className="p-3 border text-center">{c.VSD1} - {c.VED1}</td>
                          <td className="p-3 border text-center">{c.VSD2} - {c.VED2}</td>

                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>
              {/* ================= CLIENT CARDS (MOBILE) ================= */}
              {/* ================= CLIENT CARDS (MOBILE) ================= */}
              <div className="md:hidden space-y-4">
                {sortedEbSheetData
                  ?.filter((c) => c.ClientName !== '')
                  .map((c) => (
                    <div
                      key={c.ClientID}
                      className="bg-white rounded-xl shadow-md border border-gray-200"
                    >
                      {/* Header */}
                      <div className="flex justify-between items-center bg-orange-400 text-white px-4 py-2 rounded-t-xl">
                        <p className="font-semibold text-sm truncate">{c.ClientName}</p>
                        <span className="text-xs font-semibold bg-white text-orange-500 px-2 py-1 rounded">
                          {c.TotalDays} Days
                        </span>
                      </div>

                      {/* Body */}
                      <div className="p-4 space-y-3 text-sm">
                        {/* <div className="flex justify-between">
                          <span className="text-gray-500">Free EB</span>
                          <span className="font-semibold">{c.FreeEB ?? '--'}</span>
                        </div> */}

                        <div className="flex justify-between">
                          <span className="text-gray-500">Common Electricity Bill</span>
                          <span className="font-semibold">{c.CEB ?? '--'}</span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-gray-500">AC Electricity Bill</span>
                          <span className="font-semibold">{c.ACEB ?? '--'}</span>
                        </div>

                        {/* <div className="flex justify-between">
                          <span className="text-gray-500">Adjusted EB</span>
                          <span className="font-semibold">{c.AdjEB ?? '--'}</span>
                        </div> */}

                        <div className="flex justify-between border-t pt-2">
                          <span className="text-gray-700 font-semibold">
                            Total EB
                          </span>
                          <span className="font-bold text-orange-600">
                            {c.TotalClientEB ?? '--'}
                          </span>
                        </div>

                        {/* Vacation Periods */}
                        {(c.VSD1 || c.VSD2) && (
                          <div className="border-t pt-2 text-xs text-gray-600 space-y-1">
                            {c.VSD1 && (
                              <p>
                                Vacation 1: {c.VSD1} - {c.VED1}
                              </p>
                            )}
                            {c.VSD2 && (
                              <p>
                                Vacation 2: {c.VSD2} - {c.VED2}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>


            </>
          )}


        </div>
      )}


      {/* Admin View  */}





      {decryptedUser?.employee?.Role !== 'client' && (
        <div className=" h-screen flex flex-col gap-5 mt-32 px-5">

          {/* 🔹 FULL PAGE LOADER – ONLY FIRST LOAD */}
          {isLoading ? (
            <LoaderPage />
          ) : (
            <>
              {/* ================= HEADER SECTION ================= */}
              <div>
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
                  {/* Property Select */}
                  <div className="col-span-2 lg:col-span-2 flex justify-center items-center gap-5 ">
                    <div >
                      <label className="text-sm text-gray-700 mb-1">
                        Property Code
                      </label>
                      <Controller
                        name="PropertyCode"
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            placeholder="Select Property "
                            isClearable
                            styles={employeeSelectStyles}
                            options={ProperyOptions}
                          />
                        )}
                      />
                    </div>


                <div>
                    <label className="block text-sm font-medium text-black-700 mb-1">
                      Select Month
                    </label>
                    <Controller
                      name="selectedMonth"
                      control={control}
                      rules={{ required: "Please select a month" }}
                      render={({ field }) => {

                        let selectedDate = null;

                        if (field.value) {
                          const monthStr = field.value.slice(0, 3); // "Dec"
                          const yearStr = field.value.slice(3);     // "2024"
                          const monthIndex = MONTH_SHORT_NAMES.indexOf(monthStr);

                          if (monthIndex !== -1) {
                            selectedDate = new Date(Number(yearStr), monthIndex, 1);
                          }
                        } else {
                          // Default to current month
                          const now = new Date();
                          selectedDate = new Date(now.getFullYear(), now.getMonth(), 1);
                          // Update the field value so the form knows about it
                          const defaultMonth = `${MONTH_SHORT_NAMES[now.getMonth()]}${now.getFullYear()}`;
                          field.onChange(defaultMonth);
                        }

                        return (
                          <DatePicker
                            selected={selectedDate}
                            onChange={(date) => {
                              if (!date) return field.onChange("");

                              const month = MONTH_SHORT_NAMES[date.getMonth()];
                              const year = date.getFullYear();
                              const formatted = `${month}${year}`;

                              field.onChange(formatted);
                            }}
                            dateFormat="MMM yyyy"
                            showMonthYearPicker
                            popperPlacement="right-start"
                            placeholderText="Select month"
                            className="w-full border focus:ring-1 focus:ring-orange-500 px-3 py-2 border-orange-500 outline-none rounded-md"
                          />
                        );
                      }}
                    />

                  </div>
                  </div>


                  {[
                    {
                      label: 'Electricity Bill Cycle',
                      value: `${ebSheetDataObjForAdmin?.EBStartDate ?? '--'} - ${ebSheetDataObjForAdmin?.EBEndDate ?? '--'}`
                    },
                    { label: 'Common Electricity Bill', value: ebSheetDataObjForAdmin?.CommonEB },
                    { label: 'Total Flat Units', value: ebSheetDataObjForAdmin?.PropertyEBUnits },
                    { label: 'Total Free Electricity Bill', value: ebSheetDataObjForAdmin?.PropertyFreeEB },
                    { label: 'Electricity Bill To Be Recovered', value: ebSheetDataObjForAdmin?.EBToBeRecovered },

                    { label: 'Flat Total Electricity Bill', value: ebSheetDataObjForAdmin?.FlatTotalEB },
                    { label: 'Flat Total Units', value: ebSheetDataObjForAdmin?.FlatTotalUnits },
                    { label: 'Per Unit Cost', value: ebSheetDataObjForAdmin?.PerUnitCost },
                    { label: 'AC Total Units', value: ebSheetDataObjForAdmin?.ACTotalUnits },
                    { label: 'AC Total Electricity Bill', value: ebSheetDataObjForAdmin?.ACTotalEB },

                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      className="bg-white px-2 py-1.5 rounded-md shadow-sm min-h-[58px] flex flex-col justify-center"
                    >
                      <p className="text-[13px] font-medium text-gray-500 leading-tight">
                        {label}
                      </p>
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {value ?? '--'}
                      </p>
                    </div>
                  ))}

                </div>
              </div>

              {/* ================= Admin TABLE ================= */}
              <div className="max-h-[500px] whitespace-nowrap overflow-y-auto">
                <table className="w-full ">
                  <thead className="bg-black text-white sticky top-0 z-20">
                    <tr>
                      <th className="p-3 bg-black  sticky left-0 border">Client Name</th>
                      <th className="p-3 border">Total Days</th>
                      <th className="p-3 border">Adjusted Free EB</th>
                      <th className="p-3 border">Free Electricity Bill</th>
                      <th className="p-3 border">Common EB Per Client</th>
                      <th className="p-3 border">AC EB Per Client</th>
                      <th className="p-3 border">Adjusted EB</th>
                      <th className="p-3 border">Total EB Per Client </th>
                      <th className="p-3 border">Comments (1)</th>
                      <th className="p-3 border">Comments (2)</th>
                      <th className="p-3 border">Vacation Period (1)</th>
                      <th className="p-3 border">Vacation Period (2)</th>


                    </tr>
                  </thead>

                  <tbody>
                    {
                      ebSheetData?.data?.filter((c) => c.ClientName !== "").map((c) => (
                        <tr key={c.ClientID} className="hover:bg-gray-50 text-black">
                          <td className="p-3 bg-white sticky left-0 border font-semibold">{c.ClientName}</td>
                          <td className="p-3 border flex justify-center items-center font-semibold">{c.TotalDays}</td>
                          <td className="p-3 border text-center">{c.AdjFreeEB}</td>
                          <td className="p-3 border text-center">{c.FreeEB}</td>
                          <td className="p-3 border text-center">{c.CEB}</td>
                          <td className="p-3 border text-center">{c.ACEB}</td>
                          <td className="p-3 border text-center">{c.AdjEB}</td>
                          <td className="p-3 border text-center">{c.TotalClientEB}</td>
                          <td className="p-3 border text-center">{c.Comments1}</td>
                          <td className="p-3 border text-center">{c.Comments2}</td>
                          <td className="p-3 border text-center">{c.VSD1} - {c.VED1}</td>
                          <td className="p-3 border text-center">{c.VSD2} - {c.VED2}</td>

                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}

    </>
  );

}
export default EBSheetDetails;