

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaMapMarkerAlt,
  FaSnowflake,
  FaUsers,
  FaBath,
  FaHome,
} from "react-icons/fa";
import { AiOutlineClear } from "react-icons/ai";
import { Skeleton } from "./Skeleton";
import { FaEdit } from "react-icons/fa";
import { MdOutlineEditNote } from "react-icons/md";

const NoticeAndFnFAndBedStatusList = ({ setActiveTab, setEditingClient }) => {
  const [data, setData] = useState([]);
  const [filterTotal, setFilterTotal] = useState("");
  const [genderFilter, setGenderFilter] = useState(null);
  const [activeFilters, setActiveFilters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [popup, setPopup] = useState(null);
  const [sortByVacatingDate, setSortByVacatingDate] = useState(false);
  const [sortByRent, setSortByRent] = useState(false);
  const [dynamicFilters, setDynamicFilters] = useState({
    location: [],
    ac: [],
    sharing: [],
    bathroom: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          // `http://localhost:3000/Beds-status`
          `${process.env.REACT_APP_BASE_URL}/get-notice-bedstatus-fnf`
        );

        if (res.data.success) {
          const raw = res.data.data;
          setData(raw);
          setShowContent(true);

          const extractUnique = (field) =>
            [...new Set(raw.map((d) => d[field]).filter(Boolean))];

          setDynamicFilters({
            location: extractUnique("PropLocation"),
            ac: extractUnique("ACRoom"),
            sharing: extractUnique("SharingType"),
            bathroom: extractUnique("BathAttached"),
          });
        }
      } catch (err) {
        console.error("Failed to load data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleFilter = (label) => {
    setActiveFilters((prev) =>
      prev.includes(label) ? prev.filter((f) => f !== label) : [...prev, label]
    );
  };

  const clearFilters = () => {
    setGenderFilter("");
    setActiveFilters([]);
  };

  const FILTER_FIELDS = {};
  dynamicFilters.ac.forEach((val) => (FILTER_FIELDS[val] = { key: "ACRoom", value: val }));
  dynamicFilters.sharing.forEach((val) => (FILTER_FIELDS[val] = { key: "SharingType", value: val }));
  dynamicFilters.location.forEach((val) => (FILTER_FIELDS[val] = { key: "PropLocation", value: val }));
  dynamicFilters.bathroom.forEach((val) => (FILTER_FIELDS[val] = { key: "BathAttached", value: val }));


  const getBedAvailableFrom = (row) => {
    if (!row?.CVD) return row?.BedAvailableFrom ?? "-";

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const cvdDate = new Date(row.CVD);

    if (cvdDate < today) {
      return "Immediate Available";
    }

    return row?.BedAvailableFrom ?? "-";
  };


  const getRedFlagStatus = (row) => {
    if (!row?.NSD) return row?.RedFlag ?? "-";
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const nsdDate = new Date(row.NLD);
    // difference in days
    const diffTime = today - nsdDate;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    if (diffDays >= 15) {
      return "Red Flag";
    }

    return row?.RedFlag ?? "-";
  };

  const filteredData = data
    .filter((item) => {
      if (item["BedAvailable"]?.toLowerCase() !== "yes") return false;
      if (
        genderFilter &&
        item["MPG/FPG"]?.toLowerCase() !== genderFilter.toLowerCase()
      )
        return false;

      const groupedFilters = {};
      activeFilters.forEach((label) => {
        const field = FILTER_FIELDS[label]?.key;
        const value = FILTER_FIELDS[label]?.value;
        if (field && value) {
          groupedFilters[field] = [...(groupedFilters[field] || []), value];
        }
      });

      return Object.entries(groupedFilters).every(([field, values]) => {
        const itemValue = item[field]?.toString().toLowerCase();
        return values.some((val) => itemValue === val.toLowerCase());
      });
    })
    .sort((a, b) => {
      if (!sortByVacatingDate) return 0;
      const dateA = new Date(a["CVD"]);
      const dateB = new Date(b["CVD"]);
      return dateA - dateB;
    })
    .sort((a, b) => {
      if (!sortByRent) return 0;
      const rentA = parseFloat(a["MFR"]);
      const rentB = parseFloat(b["MFR"]);
      return rentA - rentB; // kam rent pehle
    });



  useEffect(() => {
    setFilterTotal(filteredData.length);
  }, [filteredData]);




  const [IACount, setIACount] = useState(0);
  const [redFlag, setRedFlag] = useState(0);

  useEffect(() => {
    if (!Array.isArray(data)) {
      setIACount(0);
      setRedFlag(0);
      return;
    }

    const Icount = filteredData.filter(
      item =>
        item["BedAvailableFrom"]?.toLowerCase().trim() === "available immediate".toLowerCase()
    ).length;

    const redFlagCount = filteredData.filter(
      item =>
        item["Red Flag"]?.toLowerCase() === "red flag".toLowerCase()
    ).length


    setIACount(Icount);
    setRedFlag(redFlagCount);
  }, [filteredData, data]);


  const renderCheckboxList = (options) => (
    <div className="space-y-2">
      <div className="flex gap-3 mb-2">
        <button
          onClick={() =>
            setActiveFilters((prev) => [...new Set([...prev, ...options])])
          }
          className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded hover:bg-green-200"
        >
          Select All
        </button>
        <button
          onClick={() =>
            setActiveFilters((prev) => prev.filter((f) => !options.includes(f)))
          }
          className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200"
        >
          Clear All
        </button>
      </div>
      {options.map((label) => (
        <label key={label} className="block text-sm">
          <input
            type="checkbox"
            checked={activeFilters.includes(label)}
            onChange={() => toggleFilter(label)}
          />
          <span className="ml-2">{label}</span>
        </label>
      ))}
    </div>
  );

  const renderPopupContent = () => {
    switch (popup) {
      case "gender":
        return (
          <div className="space-y-2 text-sm">
            <label className="block">
              <input
                type="radio"
                name="gender"
                value="Girls"
                checked={genderFilter === "Girls"}
                onChange={() => setGenderFilter("Girls")}
              />
              <span className="ml-2">Girls</span>
            </label>
            <label className="block">
              <input
                type="radio"
                name="gender"
                value="Boys"
                checked={genderFilter === "Boys"}
                onChange={() => setGenderFilter("Boys")}
              />
              <span className="ml-2">Boys</span>
            </label>
          </div>
        );
      case "location":
        return renderCheckboxList(dynamicFilters.location);
      case "ac":
        return renderCheckboxList(dynamicFilters.ac);
      case "sharing":
        return renderCheckboxList(dynamicFilters.sharing);
      case "bathroom":
        return renderCheckboxList(dynamicFilters.bathroom);
      default:
        return null;
    }
  };

  const fields = [
    { label: "Ticket No", key: "TicketNo" },
    { label: "Property Code", key: "PropCode" },
    { label: "Red Flag", key: "RedFlag" },
    { label: "Sharing", key: "SharingType" },
    { label: "AC Room", key: "ACRoom" },
    { label: "Bed Available From", key: "BedAvailableFrom" },
    { label: "CVD", key: "CVD" },
    { label: "MFR", key: "MFR" },
    { label: "DA", key: "DA" },
    { label: "URHD", key: "URHD" },
    { label: "URHA", key: "URHA" },
    { label: "Bath Attached", key: "BathAttached" },
    { label: "Bed No", key: "BedNo" },
    { label: "Room No", key: "RoomNo" },
    { label: "NSD", key: "NSD" },
    { label: "NLD", key: "NLD" },
    { label: "Existing Client FullName", key: "FullName" },
    { label: "Existing Client Cantact", key: "WhatsAppNo" },
    { label: "Comments", key: "Comments" },
    { label: "Location", key: "PropLocation" },
    { label: "Bed Available", key: "BedAvailable" },
    { label: "Gender", key: "MPG/FPG" },

    // ✅ Added ONLY remaining fields after Gender

    { label: "Expenses", key: "Expenses" },
    { label: "OUT Amt", key: "OUTAmt" },

    { label: "To Rcable Amt", key: "ToRcableAmt" },
    { label: "To Rcved Amt", key: "ToRcvedAmt" },
    { label: "Current Due Amt", key: "CurDueAmt" },
    { label: "Previous Due Amt", key: "PreDueAmt" },

    { label: "Rent Amt", key: "RentAmt" },
    { label: "EB Amt", key: "EBAmt" },
    { label: "Flat EB", key: "FlatEB" },
    { label: "Adj EB", key: "AdjEB" },

    { label: "Days Count", key: "DaysCount" },
    { label: "Adj Amt", key: "AdjAmt" },
    { label: "Pro Fees", key: "ProFees" },

    { label: "Payment Comments", key: "PaymentComments" },
    { label: "Rent DOJ", key: "RentDOJ" },
    { label: "EB DOJ", key: "EBDOJ" },

    { label: "SDMF", key: "SDMF" },
    { label: "DA Rcved", key: "DARcved" },
    { label: "DA Due", key: "DADue" },
    { label: "DA Comment", key: "DAComment" },

    { label: "Docs Status", key: "DocsStatus" },
    { label: "Rent Date", key: "RentDate" },
    { label: "Free EB Per Day", key: "FreeEBPerDay" },

    { label: "Rent And EB Message", key: "RentAndEBMessage" },
    { label: "Send Rent EB Msg", key: "SendRentEBMsg" },

    { label: "Client ID", key: "ClientID" },
    { label: "PRHD", key: "PRHD" },

    { label: "Notice Reason", key: "NoticeReason" },
    { label: "Notice Discussion Proofs", key: "NoticeDiscussionProofs(Attach)" },

    { label: "Bed Additional Status", key: "BedAdtnlStatus" },

    { label: "New Client DOJ", key: "NewClntDOJ" },
    { label: "New Client FullName", key: "NewClntFullName" },
    { label: "New Client Comments", key: "NewClntComments" },

    { label: "Temp ASD", key: "TempASD" },
    { label: "Temp ALD", key: "TempALD" },
    { label: "Temp Client FullName", key: "TempClntFullName" },
    { label: "Temp Client WA No", key: "TempClntWANo" },
    { label: "Temp Client Call No", key: "TempClntCallNo" },
    { label: "Temp Client Comments", key: "TempClntComments" },

    { label: "Created Date", key: "CreatedDate" },
    { label: "AC Sub Meter Reading", key: "ACSubMtrReading" },

    { label: "Due Rent Amt", key: "DueRentAmt" },
    { label: "Comment For Due Rent Amt", key: "CommentForDueRentAmt" },

    { label: "Due EB Amt", key: "DueEBAmt" },
    { label: "Comment For Due EB Amt", key: "CommentForDueEBAmt" },

    { label: "Approx EB Amt", key: "ApproxEBAmt" },
    { label: "Comment For Approx EB Amt", key: "CommentForApproxEBAmt" },
    { label: "Comment For Previous Due Amt", key: "CommentForPreviousDueAmt" },

    { label: "Handover Taken By", key: "HandoverTakenBy" },
    { label: "Handover Checklist Attach", key: "HandoverCheckListAttach" },

    { label: "GPGS Review Link Decision", key: "GPGSReviewLinkDecision" },

    { label: "Deduction Amt", key: "DeductionAmt" },
    { label: "Comment For Deduction Amt", key: "CommentForDeductionAmt" },

    { label: "Total Due Amt", key: "TotalDueAmt" },
    { label: "Client Excess Amt", key: "ClientExcessAmt" },

    { label: "FNF Refundable Amt", key: "F&FRefundableAmt" },
    { label: "Client UPI/Bank Details", key: "ClientUPI/BankDetails" },

    { label: "FNF Msg", key: "FNFMsg" },
    { label: "Action Button To Send FnF Msg", key: "ActionButtonToSendFnFMsgforClient" },

    { label: "PG Main Sheet Updated", key: "PGMainSheetUpdated" },
    { label: "Removed From WhatsApp Group", key: "RemovedFromWhatsAppGrp" },
    { label: "Deactivated The Client", key: "DeactivatedTheClient" },
    { label: "Send GPGS Review Link", key: "SendGPGSReviewLink" },

    { label: "Reviewer", key: "Reviewer" },
    { label: "Notice & FNF Status", key: "Notice&FNFStatus" },
    { label: "Work Logs", key: "WorkLogs" },
    { label: "Actions", key: "Actions" },
  ];


  const filterButtons = [
    { id: "gender", icon: <FaUsers />, label: "Gender" },
    { id: "location", icon: <FaMapMarkerAlt />, label: "Location" },
    { id: "ac", icon: <FaSnowflake />, label: "AC / Non AC" },
    { id: "sharing", icon: <FaHome />, label: "Sharing Type" },
    { id: "bathroom", icon: <FaBath />, label: "Attached Bathroom" },
  ];



  const handleNoticeEdit = (row) => {
    setActiveTab("Tab3")
    setEditingClient(row)
  }
































  if (loading)
    return (
      <Skeleton />
    );

  return (

    <div className="min-h-screen bg-[#F8F9FB]">
      <div className="sticky top-0 z-5 ">
        <div className="relative flex items-center justify-center ">
          <div className="absolute  p-2 left-0 w-[250px]">
            {/* <img
              src="https://gpgs.in/wp-content/themes/paying_guest/images/logo.png"
              alt="Logo"
            /> */}
          </div>
        </div>


      </div>

      {showContent && (
        <div className="grid grid-cols-2  sm:flex sm:flex-wrap justify-center  gap-2">
          {filterButtons.map((btn) => {
            let selectedOptions = [];
            if (btn.id === "gender" && genderFilter) {
              selectedOptions = [genderFilter];
            } else {
              selectedOptions = activeFilters.filter(
                (label) => FILTER_FIELDS[label]?.key === btn.label
              );
            }

            return (
              <div
                key={btn.id}
                className="relative w-full sm:w-auto"
                onMouseEnter={() => setPopup(btn.id)}
                onMouseLeave={() => setPopup(null)}
              >
                <button className="flex items-center mt-5 justify-between w-full sm:justify-center gap-2 px-4 py-1 border border-orange-500 text-orange-600 bg-white rounded-xl hover:bg-orange-50 shadow-sm transition-all">
                  {btn.icon}
                  <span className="font-medium">{btn.label}</span>
                </button>

                {popup === btn.id && (
                  <div className="absolute top-6.5 left-0 z-50 bg-white border border-orange-300 shadow-lg rounded-xl p-4 w-64 mt-1">
                    <h2 className="text-sm text-orange-500 font-bold mb-3 capitalize">
                      {btn.label} Filter
                    </h2>
                    {renderPopupContent()}
                  </div>
                )}

                {/* {selectedOptions.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1 text-xs">
                      {selectedOptions.map((opt) => (
                        <span
                          key={opt}
                          className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full flex items-center gap-1"
                        >
                          {opt}
                     
                        </span>
                      ))}
                    </div>
                  )} */}
              </div>
            );
          })}


          {(activeFilters.length > 0 || genderFilter) && (
            <button className="flex items-center mt-5 bg-orange-100 justify-between h-8 sm:justify-center gap-2 px-4 py-1 border border-orange-500 text-orange-600 rounded-xl hover:bg-orange-50 shadow-sm transition-all">
              <span
                onClick={clearFilters}
                className="font-medium flex items-center gap-2"
              >
                <AiOutlineClear /> Clear Filters
              </span>
            </button>
          )}


          <div className="flex items-center justify-end mt-5 mb-2 gap-2">
            <button
              onClick={() => setSortByVacatingDate((prev) => !prev)}
              className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-all ${sortByVacatingDate ? "bg-orange-500" : "bg-gray-300"
                }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${sortByVacatingDate ? "translate-x-6" : "translate-x-0"
                  }`}
              />
            </button>
            <label className="text-lg font-medium  text-orange-600">
              CVD
            </label>
          </div>
          <div className="flex items-center justify-end mt-5 mb-2 gap-2">
            <button
              onClick={() => setSortByRent((prev) => !prev)}
              className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-all ${sortByRent ? "bg-orange-500" : "bg-gray-300"
                }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${sortByRent ? "translate-x-6" : "translate-x-0"
                  }`}
              />
            </button>
            <label className="text-lg font-medium  text-orange-600">
              RENT
            </label>
          </div>
        </div>
      )}

      <div className="max-w-full mx-auto ">
        {filteredData.length === 0 ? (
          <p className="text-gray-500 text-center flex justify-center items-center py-10">
            {/* No records found for selected filters. */}
            <img src="https://ispperio.com/ASPX_Images/not_found.jpg" alt="" />
          </p>
        ) : (
          <>

            {filterTotal > 0 && (
              <div className="flex items-center justify-between flex-wrap gap-2 text-sm  text-gray-600 mr-8 mb-1 ">

                {/* ✅ Filters Section */}
                <div className="flex flex-wrap gap-2">
                  {activeFilters.map((filter, index) => (
                    <span
                      key={index}
                      className="px-2  text-gray-800 rounded-md text-sm"
                    >
                      {filter}
                    </span>
                  ))}
                </div>

                {/* ✅ Counts Section */}
                <div className="whitespace-nowrap">
                  IA:{" "}
                  <span className="font-semibold text-orange-600">
                    {IACount}
                  </span>
                  &nbsp;&nbsp;

                  RF:{" "}
                  <span className="font-semibold text-orange-600">
                    {redFlag}
                  </span>
                  &nbsp;&nbsp;

                  Showing{" "}
                  <span className="font-semibold text-orange-600">
                    {filterTotal}
                  </span>{" "}
                  Bed(s)
                </div>
              </div>
            )}



            <div className="overflow-auto max-h-screen border border-gray-200">

              <table className="min-w-[1000px] w-full text-sm text-left text-gray-700">

                {/* ================= HEADER ================= */}
                <thead className="sticky top-0 bg-black z-10 shadow-md font-bold text-white text-base">
                  <tr>
                    {fields.map((col, idx) => (
                      <th
                        key={col.key}
                        className={`px-2 py-2 border-b border-gray-300 whitespace-nowrap
          ${idx === 0
                            ? "sticky left-0 z-20 bg-black"
                            : idx === 1
                              ? "sticky left-[100px] z-20 bg-black"
                              : ""
                          }`}
                      >
                        {col.label}
                      </th>
                    ))}

                    {/* ✅ Action column OUTSIDE map */}
                    <th className="px-2 py-2 sticky right-0 z-20 text-center bg-black whitespace-nowrap">
                      Action
                    </th>
                  </tr>
                </thead>

                {/* ================= BODY ================= */}
                <tbody>
                  {filteredData.map((row, i) => (
                    <tr
                      key={row?.ClientID || i}
                      className="bg-white hover:bg-gray-100 border-b border-gray-200"
                    >
                      {fields.map((col, idx) => (
                        <td
                          key={col.key}
                          className={`px-2 py-2 text-[15px] whitespace-nowrap
                ${idx === 0
                              ? "sticky left-0 z-20 bg-gray-100 font-bold"
                              : idx === 1
                                ? "sticky left-[100px] z-20 bg-gray-100 font-bold"
                                : ""
                            }`}
                        >
                          {col.key === "BedAvailableFrom"
                            ? getBedAvailableFrom(row)
                            : col.key === "RedFlag"
                              ? getRedFlagStatus(row)
                              : row?.[col.key] ?? "-"}
                        </td>
                      ))}

                      {/* ✅ Sticky Right Column 1 */}
                      <td className="sticky right-[0px] z-20 bg-gray-100 px-3 py-2 text-center whitespace-nowrap">

                        <button
                          onClick={() => handleNoticeEdit(row)}
                          className="inline-flex items-center gap-1 text-orange-600 hover:text-orange-800 hover:underline mr-2">
                          <i className="fa-solid fa-pen-to-square"></i>

                        </button>

                        {/* <button
                          // onClick={handleFNFEdit(row)}
                        className="inline-flex items-center gap-1 text-green-600 hover:text-green-800 hover:underline">
                          <FaEdit size={14} />
                          F&F
                        </button> */}

                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>

  );
};

export default NoticeAndFnFAndBedStatusList;























