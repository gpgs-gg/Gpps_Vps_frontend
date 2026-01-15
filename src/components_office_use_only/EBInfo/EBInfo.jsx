import { useEffect, useMemo, useState } from "react";
import { CreateAndEdit } from "./CreateAndEdit";

import LoaderPage from "../NewBooking/LoaderPage";
import { useApp } from "../TicketSystem/AppProvider";
import { useEbCalculationData } from "./services/index";
import Select from "react-select";
import { SelectStylesfilter } from "../../Config";
import { useReviewerOptions } from "./services/index";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";

const portalTarget = typeof window !== "undefined" ? document.body : null;
/* ================= TABLE COLUMN WIDTHS ================= */
const SR_NO_WIDTH = 70;
const PROPERTY_COL_WIDTH = 140;
const SUBMETERDETAILS_COL_WIDTH = 148;
const DEFAULT_COL_WIDTH = 160;
const ACTION_COL_WIDTH = 80;
const ASSIGNEE_COL_WIDTH = 180;

/** Returns column width based on:
 * - column index
 * - column key
 * - action column flag
 *
 * Pure function:
 * - No state
 * - No props
 * - No side effects
 * Safe to keep outside component
 */
const getColumnWidth = (index, header, isAction = false) => {
  if (isAction) return ACTION_COL_WIDTH;
  if (index === 0) return SR_NO_WIDTH;
  if (header === "PropertyCode") return PROPERTY_COL_WIDTH;
  if (header === "SubMeterDetails") return SUBMETERDETAILS_COL_WIDTH;
  if (header === "Assignee") return ASSIGNEE_COL_WIDTH;
  if (header === "Reviewer") return ASSIGNEE_COL_WIDTH;
  return DEFAULT_COL_WIDTH;
};

const EbCalculation = () => {
  const { decryptedUser } = useApp();

  const { data: reviewers = [] } = useReviewerOptions();

  const REVIEWER_MASTER = reviewers;
  //console.log("STATIC: ", REVIEWER_MASTER);
  const MONTH_SHORT_NAMES = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const getCurrentMonthOption = () => {
    const now = new Date();

    // Move to next month
    const nextMonthDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const month = MONTH_SHORT_NAMES[nextMonthDate.getMonth()];
    const year = nextMonthDate.getFullYear();

    return {
      value: `${month}${year}`, // Feb2026
      label: `${month} ${year}`, // Feb 2026
    };
  };

  const [filterTotal, setFilterTotal] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthOption());

  // const [selectedMonth, setSelectedMonth] = useState(MONTH_OPTIONS[0]);
  const [searchText, setSearchText] = useState("");
  const [searchInput, setSearchInput] = useState("");

  // Filter states
  const [dynamicFilters, setDynamicFilters] = useState({
    property: [],
    assignee: [],
    paid: [],
    status: [],
  });

  // select filter

  const [selectedProperty, setSelectedProperty] = useState(null);
  const [selectedAssignee, setSelectedAssignee] = useState(null);
  const [selectedPaid, setSelectedPaid] = useState(null);
  const [selectedReviewer, setSelectedReviewer] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Edit form state
  const [editingRow, setEditingRow] = useState(null);

  /* ================= FETCH DATA ================= */
  const SHEET_NAME = selectedMonth.value;

  const {
    data = [],
    isLoading,

    isError,
  } = useEbCalculationData(SHEET_NAME);
  console.log("333", data);

  // ✅ extract existing property codes from TABLE
  const existingPropertyCodes = useMemo(() => {
    return data.map((row) => row.PropertyCode).filter(Boolean);
  }, [data]);
  //console.log("all property codes : ", existingPropertyCodes);

  // const updateMutation = useUpdateEbCalculationRow();
  //console.log(decryptedUser.name);

  useEffect(() => {
    if (!data.length) return;

    const unique = (key) => [
      ...new Set(data.map((r) => r[key]).filter(Boolean)),
    ];

    const properties = unique("PropertyCode").map((p) => ({
      value: p,
      label: p,
    }));
    const assignees = unique("Assignee").map((a) => ({ value: a, label: a }));
    const paid = [
      { value: "Paid", label: "Paid" },
      { value: "Not Paid", label: "Not Paid" },
    ];

    const status = unique("EBCalnStatus").map((s) => ({ value: s, label: s }));
    //EBPaidStatus
    //FlatEBPaid
    setDynamicFilters({
      property: properties,
      assignee: assignees,
      paid: paid,
      status: status,
    });
  }, [data]);

  // pagination
  const ITEMS_PER_PAGE = 20;
  const [currentPage, setCurrentPage] = useState(1);

  /* ================= FILTERED DATA ================= */
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // 🔍 Search
      const searchMatch =
        !searchText ||
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(searchText.toLowerCase())
        );

      if (!searchMatch) return false;

      // 🎯 select filters
      const propertyFilter =
        !selectedProperty || selectedProperty.value === item.PropertyCode;

      const assigneeFilter =
        !selectedAssignee || selectedAssignee.value === item.Assignee;

      const paidFilter =
        !selectedPaid || selectedPaid.value === item.EBPaidStatus;

      const reviewerFilter =
        !selectedReviewer || selectedReviewer.value === item.Reviewer;

      return (
        propertyFilter &&
        assigneeFilter &&
        paidFilter &&
        reviewerFilter &&
        searchMatch
      );
    });
  }, [
    data,
    searchText,
    selectedProperty,
    selectedAssignee,
    selectedPaid,
    selectedReviewer,
  ]);

  // filtered list
  const TABLE_COLUMNS = useMemo(() => {
    if (!filteredData.length) return [];
    return Object.keys(filteredData[0]).filter(
      (key) => key !== "__rowNumber" && key !== "_rowNumber"
    );
  }, [filteredData]);

  useEffect(() => {
    setCurrentPage(1); // reset page on filters/search/month change
  }, [
    searchText,
    selectedProperty,
    selectedAssignee,
    selectedPaid,
    selectedReviewer,
    selectedMonth,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredData.length / ITEMS_PER_PAGE)
  );

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredData.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredData, currentPage]);
  console.log("11", paginatedData);
  // ✅ SAFE
  useEffect(() => {
    setFilterTotal(filteredData.length);
  }, [filteredData]);

  /* ================= EDIT FORM ================= */

  const clearAllFilters = () => {
    setSelectedProperty(null);
    setSelectedAssignee(null);
    setSelectedPaid(null);
    setSelectedReviewer(null);
    setSearchInput("");
    setSearchText("");
  };
  const activeFilterCount =
    (selectedProperty ? 1 : 0) +
    (selectedAssignee ? 1 : 0) +
    (selectedPaid ? 1 : 0) +
    (selectedReviewer ? 1 : 0) +
    (searchText ? 1 : 0);
  // format date  Formats date to: DD Mon YYYY Returns "-" for empty values
  const formatDate = (dateStr) => {
    if (!dateStr) return "-";

    const date = new Date(dateStr);

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (isError) {
    return <div>Error loading EB data</div>;
  }

  /**
   * 🚫 Guard: Do not render EB module if user is not logged in
   */
  if (!decryptedUser) {
    // console.log(filterTotal);
    return (
      <div className="flex items-center justify-center h-screen text-red-600 text-lg">
        Please login to access EB Calculation
      </div>
    );
  }

  /* ================= RENDER ================= */
  if (isLoading) {
    return (
      <>
        <div className="flex justify-center items-center h-screen">
          <LoaderPage />
        </div>
      </>
    );
  }
  /**
   * Calculates left offset for sticky columns
   * - Sr No → left = 0
   * - Next column → width of Sr No
   */
  const getStickyLeft = (colIndex) => {
    if (colIndex === 0) return 0;
    if (colIndex === 1) return SR_NO_WIDTH;
    return undefined;
  };

  const CellWithTooltip = ({ value, fullValue, colIndex, columnKey }) => {
    const [show, setShow] = useState(false);
    //const disableTooltip = colIndex === 0;

    // ✅ Tooltip allowed ONLY for specific columns
    const enableTooltip = TOOLTIP_COLUMNS.includes(columnKey);

    const displayValue =
      columnKey === "EBCalnDate"
        ? formatDate(value)
        : columnKey === "FlatEB" && value
        ? `₹ ${Number(value).toFixed(2).toLocaleString("en-IN")}`
        : value ?? "-";

    return (
      <div
        className="relative w-full"
        onMouseEnter={() => enableTooltip && setShow(true)}
        onMouseLeave={() => enableTooltip && setShow(false)}
      >
        <div
          className={`
          truncate overflow-hidden text-ellipsis left-8 ${
            enableTooltip ? "cursor-pointer" : ""
          }

        `}
        >
          {displayValue}
        </div>

        {/* {enableTooltip && show && (
          <div
            className="
            absolute left-36 mt-0 z-[130] w-[350px]
            bg-white border border-gray-300 rounded-lg shadow-xl p-3 text-xs break-words
          "
          >
            <pre className="whitespace-pre-wrap">{fullValue ?? "-"}</pre>
          </div>
        )} */}
        {enableTooltip && show && (
          <div
            className="
      absolute top-0 mb-2 left-full ml-2 z-[130] w-[350px]
      bg-white border border-gray-300 rounded-lg shadow-xl p-3 text-xs break-words
    "
          >
            <pre className="whitespace-pre-wrap">{fullValue ?? "-"}</pre>
          </div>
        )}
      </div>
    );
  };

  // handle form success
  const handleFormSuccess = () => {
    setEditingRow(null);
    setShowCreateForm(false);
  };

  //  header formatter

  const COLUMN_LABELS = {
    SrNo: "Sr No",
    PropertyCode: "Property Code",
    SubMeterDetails: "Sub Meter Details",
    Assignee: "Assignee",
    EBCalnDate: " Calculation Target Date",
    FlatEB: "Flat Electricity Bill",
    FlatUnits: "Flat Units",
    EBPaidStatus: "Bill Paid Status ",
    EBCalnStatus: "Calculation Status",
    Reviewer: "Reviewer",
    WorkLogs: "Work Logs",
  };

  const formatHeader = (key) => {
    return (
      COLUMN_LABELS[key] ||
      key
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase())
    );
  };

  // get  latest worklogs
  const getLatestWorkLog = (logs) => {
    if (!logs) return "";

    // Split by blank line between entries
    const entries = logs.split(/\n\s*\n/);

    // Return last (latest) entry
    return entries[entries.length - 1];
  };

  // Tooltip  Columns that should show tooltip on hover
  const TOOLTIP_COLUMNS = [
    "PropertyCode",
    "SubMeterDetails",
    "WorkLogs",
    "UpdatedBy",
    "CreatedBy",
  ];

  return (
    <div className="min-h-screen w-auto bg-gray-50 lg:pt-16">
      {/* NAVBAR */}
      <nav className="px-4 sm:px-6 shadow-sm">
        <div
          className="
      grid grid-cols-2 gap-2 mt-10
      sm:flex sm:flex-row sm:space-x-6 sm:space-y-0
    "
        >
          <button
            className="
        flex items-center space-x-2 px-3 py-2 text-lg font-medium rounded-md
        sm:rounded-t-lg border-b-2 transition-colors
        text-left w-full sm:w-auto
        text-orange-600 border-orange-600 bg-orange-50
      "
          >
            <i className="fas fa-ticket-alt"></i>
            <span>All Property</span>
          </button>

          <button
            onClick={() => setShowCreateForm(true)}
            className="
        flex items-center space-x-2 px-3 py-2 text-lg font-medium rounded-md
        sm:rounded-t-lg border-b-2 transition-colors
        text-left w-full sm:w-auto
        text-black border-transparent hover:text-gray-900 hover:border-gray-300
      "
          >
            <i className="fas fa-plus-circle"></i>
            <span>Add New Property</span>
          </button>
        </div>
      </nav>
      {/* ================= FILTER PANEL ================= */}
      <div className="mx-8 my-6">
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          {/* HEADER */}
          <div className="flex justify-end px-6 items-center mb-1">
            {activeFilterCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="text-orange-600 hover:text-orange-800 font-bold text-lg underline"
              >
                Clear All Filters
              </button>
            )}
          </div>

          {/* FILTER ROW */}
          <div className="w-full overflow-x-auto">
            <div className="flex gap-4 pb-2">
              {/* 🔍 SEARCH */}
              <div>
                <label className="block text-lg font-medium text-gray-800 mb-1">
                  Search
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search Property"
                    isClearable
                    value={searchInput}
                    onChange={(e) => {
                      setSearchInput(e.target.value);
                      const handler = setTimeout(() => {
                        setSearchText(e.target.value.trim());
                      }, 300);
                      return () => clearTimeout(handler);
                    }}
                    className="w-[200px] pl-2 pr-3 py-2 border-2 border-orange-200 rounded-md
                      focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                  />
                </div>
              </div>
              {/* MONTH SELECT */}

              <div className="z-[150]">
                <label className="block text-lg font-medium text-black mb-1">
                  Select Month
                </label>

                <DatePicker
                  selected={
                    selectedMonth?.value &&
                    selectedMonth.value !== "IT_DoNotDelete"
                      ? new Date(
                          Number(selectedMonth.value.slice(3)), // year
                          MONTH_SHORT_NAMES.indexOf(
                            selectedMonth.value.slice(0, 3)
                          ), // month
                          1
                        )
                      : null
                  }
                  onChange={(date) => {
                    if (!date) return;

                    const month = MONTH_SHORT_NAMES[date.getMonth()];
                    const year = date.getFullYear();

                    setSelectedMonth({
                      value: `${month}${year}`, // ✅ Jan2026 (used by API)
                      label: `${month} ${year}`, // ✅ Jan 2026 (UI)
                    });
                  }}
                  dateFormat="MMM yyyy"
                  showMonthYearPicker
                  popperClassName="z-[9999]"
                  placeholderText="Select month"
                  className="w-[200px] border-2 border-orange-300 px-3 py-2 rounded-md
               focus:outline-none focus:ring-1 focus:ring-orange-300"
                />
              </div>

              {/* PROPERTY SELECT */}
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-1">
                  Property
                </label>
                <Select
                  value={selectedProperty}
                  onChange={setSelectedProperty}
                  options={dynamicFilters.property}
                  styles={SelectStylesfilter}
                  className="w-[200px]"
                  placeholder=" Property"
                  isClearable
                  menuPortalTarget={portalTarget}
                  menuPosition="absolute"
                />
              </div>

              {/* EB PAID SELECT */}
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-1">
                  EB Paid
                </label>
                <Select
                  value={selectedPaid}
                  onChange={setSelectedPaid}
                  options={dynamicFilters.paid}
                  styles={SelectStylesfilter}
                  className="w-[200px]"
                  isClearable
                  placeholder="Select EB Paid"
                  menuPortalTarget={portalTarget}
                  menuPosition="absolute"
                />
              </div>
              {/* ASSIGNED TO SELECT */}
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-1">
                  Assigned to
                </label>
                <Select
                  value={selectedAssignee}
                  onChange={setSelectedAssignee}
                  options={dynamicFilters.assignee}
                  styles={SelectStylesfilter}
                  className="w-[200px]"
                  isClearable
                  placeholder=" Assigned to"
                  menuPortalTarget={portalTarget}
                  menuPosition="absolute"
                />
              </div>

              {/* REVIEWER SELECT */}
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-1">
                  Reviewer
                </label>
                <Select
                  value={selectedReviewer}
                  onChange={setSelectedReviewer}
                  options={REVIEWER_MASTER}
                  styles={SelectStylesfilter}
                  className="w-[200px]"
                  isClearable
                  placeholder=" Reviewer"
                  menuPortalTarget={portalTarget}
                  menuPosition="absolute"
                />
              </div>
            </div>
          </div>

          {/* ACTIVE FILTER CHIPS */}
          {activeFilterCount > 0 && (
            <div className="">
              {searchText && (
                <span className="">
                  {/* Search: {searchText} */}
                  <button
                    onClick={() => {
                      setSearchInput("");
                      setSearchText("");
                    }}
                    className="hover:text-red-600 font-bold"
                  >
                    {/* <FaTimes className="text-xs" /> */}
                  </button>
                </span>
              )}

              {selectedPaid && (
                <span className="">
                  {/* EB Paid: {selectedPaid.label} */}
                  <button
                    onClick={() => setSelectedPaid(null)}
                    className="hover:text-red-600 font-bold"
                  >
                    {/* <FaTimes className="text-xs" /> */}
                  </button>
                </span>
              )}

              {selectedAssignee && (
                <span className="">
                  {/* Assignee: {selectedAssignee.label} */}
                  <button
                    onClick={() => setSelectedAssignee(null)}
                    className="hover:text-red-600 font-bold"
                  >
                    {/* <FaTimes className="text-xs" /> */}
                  </button>
                </span>
              )}

              {selectedReviewer && (
                <span className="">
                  {/* Reviewer: {selectedReviewer.label} */}
                  <button
                    onClick={() => setSelectedReviewer(null)}
                    className="hover:text-red-600 font-bold"
                  >
                    {/* <FaTimes className="text-xs" /> */}
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* ================= TABLE ================= */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <div className="max-h-[79vh] overflow-auto">
              {filteredData.length === 0 ? (
                <div className="p-6 text-center text-gray-500 lg:mt-40 font-semibold flex items-center justify-center">
                  No records found for selected filters
                </div>
              ) : (
                <table className="min-w-full border-collapse text-sm table-fixed">
                  <thead className="bg-orange-300 sticky top-0 z-[100] backdrop-blur-sm">
                    <tr>
                      {TABLE_COLUMNS.map((key, colIndex) => (
                        <th
                          key={key}
                          className={`px-3 py-3 text-left font-bold text-black text-lg whitespace-nowrap
                            ${colIndex < 2 ? "sticky z-40 bg-orange-300" : ""}
                          `}
                          style={{
                            width: getColumnWidth(colIndex, key),
                            left: getStickyLeft(colIndex),
                          }}
                        >
                          {formatHeader(key)}
                        </th>
                      ))}
                      <th
                        className="px-4 py-3 font-bold text-lg sticky right-0 z-[120] bg-orange-300 shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.1)]"
                        style={{ width: ACTION_COL_WIDTH }}
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="bg-white divide-y divide-gray-200 text-[16px]">
                    {paginatedData.map((row, idx) => (
                      <tr key={idx} className="hover:bg-[#F8F9FB]">
                        {TABLE_COLUMNS.map((key, colIndex) => (
                          <td
                            className={`
                              px-3 py-4 whitespace-normal
                              ${colIndex < 2 ? "sticky bg-white z-20" : ""}
                              ${colIndex === 0 ? "text-center " : ""}
                            `}
                            style={{
                              width: getColumnWidth(colIndex, key),
                              left: getStickyLeft(colIndex),
                              maxWidth: getColumnWidth(colIndex, key),
                            }}
                            key={key}
                          >
                            <CellWithTooltip
                              value={
                                key === "WorkLogs"
                                  ? getLatestWorkLog(row[key])
                                  : row[key]
                              }
                              fullValue={row[key]}
                              colIndex={colIndex}
                              columnKey={key}
                            />
                          </td>
                        ))}
                        <td className="pl-8 py-2  sticky right-0 z-[60] bg-white shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.1)]">
                          {/* <button
                            onClick={() =>
                              setEditingRow({
                                ...row,
                                rowIndex: row.__rowNumber - 2,
                              })
                            }
                            className="hover:scale-110 transition-transform"
                          >
                            <FaEdit className="text-green-600 w-5 h-5" />
                          </button> */}
                          <div className="flex justify-around">
                            <div>
                              <button
                                onClick={() =>
                                  setEditingRow({
                                    ...row,
                                    rowIndex: row.__rowNumber - 2,
                                  })
                                }
                                className="text-red-600 hover:text-red-900"
                                title="View"
                              >
                                <i className="fa fa-eye"></i>
                              </button>
                            </div>
                            <div>
                              <button
                                onClick={() =>
                                  setEditingRow({
                                    ...row,
                                    rowIndex: row.__rowNumber - 2,
                                  })
                                }
                                className="text-green-600 hover:text-green-900 mr-3"
                                title="Edit"
                              >
                                <i className="fas fa-edit h-5 w-5"></i>
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* pagination */}
            <div className="flex justify-center items-center gap-6 py-5">
              <span className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>

              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                className="px-4 py-2 bg-orange-400 text-white rounded disabled:opacity-50 hover:bg-orange-500 transition-colors"
              >
                Previous
              </button>

              <button
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                className="px-4 py-2 bg-orange-400 text-white rounded disabled:opacity-50 hover:bg-orange-500 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {showCreateForm && (
        <CreateAndEdit
          sheetName={SHEET_NAME}
          existingPropertyCodes={existingPropertyCodes}
          onClose={() => setShowCreateForm(false)}
          onSuccess={handleFormSuccess}
        />
      )}
      {editingRow && (
        <CreateAndEdit
          sheetName={SHEET_NAME}
          editingRow={editingRow}
          onClose={() => setEditingRow(null)}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
};

export default EbCalculation;