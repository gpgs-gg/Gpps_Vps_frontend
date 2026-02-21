import { useEffect, useMemo, useState } from "react";
import { CreateAndEdit } from "./CreateAndEdit";
import Dashboard from "./Dashboard";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { useApp } from "../TicketSystem/AppProvider";
import { useEbCalculationData, useUpdateEbAssignee } from "./services/index";
import Select from "react-select";
import { SelectStyles, SelectStylesfilter } from "../../Config";

import {
  useReviewerOptions,
  useDynamicValuesEBStatuses,
} from "./services/index";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { EBSkeleton, DashboardSkeleton } from "./DashboardSkeleton";
import { toast } from "react-toastify";
import LoaderPage from "../NewBooking/LoaderPage";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();
const portalTarget = typeof window !== "undefined" ? document.body : null;
/* ================= TABLE COLUMN WIDTHS ================= */
const SR_NO_WIDTH = 70;
const PROPERTY_COL_WIDTH = 140;
const SUBMETERDETAILS_COL_WIDTH = 148;
const DEFAULT_COL_WIDTH = 160;
const ACTION_COL_WIDTH = 80;
const ASSIGNEE_COL_WIDTH = 180;
const ATTACHMENTS_COL_WIDTH = 180;

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
  if (header === "Attachments") return ATTACHMENTS_COL_WIDTH;
  return DEFAULT_COL_WIDTH;
};

const EbCalculation = () => {
  const { decryptedUser } = useApp();

  const { data: reviewers = [] } = useReviewerOptions();
  const [previewFile, setPreviewFile] = useState(null);

  const { data: ebStatuses } = useDynamicValuesEBStatuses();
  // const {mutateAsync: updateMutation} = useUpdateEbCalculationRow();
  const {
    mutateAsync: updateAssigneeMutation,
    isPending: isUpdateAssigneePending,
  } = useUpdateEbAssignee();

  //! EB PAID OPTIONS FROM MASTER TABLE DYNAMIC
  const ebPaidOptions = useMemo(() => {
    return (ebStatuses?.ebPaidStatus ?? []).map((status) => ({
      value: status,
      label: status,
    }));
  }, [ebStatuses?.ebPaidStatus]);
  // EB CALCULATION STATUS FROM MASTER TABLE DYNAMIC
  const ebCalculationStatusOptions = useMemo(() => {
    return (ebStatuses?.ebCalculationStatus ?? []).map((status) => ({
      value: status,
      label: status,
    }));
  }, [ebStatuses?.ebCalculationStatus]);
  // EB CALCULATION STATUS PAID FROM MASTER TABLE DYNAMIC
  const ebCalculationStatusPaidOptions = useMemo(() => {
    return (ebStatuses?.ebCalculationStatusPaid ?? []).map((status) => ({
      value: status,
      label: status,
    }));
  }, [ebStatuses?.ebCalculationStatusPaid]);

  //! both calculation status
  const bothCalculationStatusForFilter = useMemo(() => {
    return [...ebCalculationStatusOptions, ...ebCalculationStatusPaidOptions];
  }, [ebCalculationStatusOptions, ebCalculationStatusPaidOptions]);

  //console.log(bothCalculationStatusForFilter, 11111111111);
  //console.log(ebCalculationStatusPaidOptions, 11111111111);
  // console.log("paid options dynamic: ", ebPaidOptions);
  // console.log("calculation status dynamic: ", ebCalculationStatusOptions);
  // console.log("EBCalculationStatus:", ebCalculationStatusList);

  // console.log("EBPaidStatus:", ebPaidStatusList);

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
  const [selectedLeadNos, setSelectedLeadNos] = useState([]);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferAssignee, setTransferAssignee] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [activeTab, setActiveTab] = useState("DASHBOARD");

  // Edit form state
  const [editingRow, setEditingRow] = useState(null);

  /* ================= FETCH DATA ================= */
  const SHEET_NAME = selectedMonth.value;

  const {
    data = [],
    isLoading,
    isPending,
    isError,
  } = useEbCalculationData(SHEET_NAME);
  //console.log("333", data);

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

    setDynamicFilters({
      property: properties,
      assignee: assignees,
      paid: ebPaidOptions,
      status: bothCalculationStatusForFilter,
    });
  }, [data, ebPaidOptions, bothCalculationStatusForFilter]);

  // pagination
  const ITEMS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);

  /* ================= FILTERED DATA ================= */
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // 🔍 Search
      const searchMatch =
        !searchText ||
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(searchText.toLowerCase()),
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

      const statusFilter =
        !selectedStatus || selectedStatus.value === item.EBCalnStatus;

      return (
        propertyFilter &&
        assigneeFilter &&
        paidFilter &&
        reviewerFilter &&
        statusFilter &&
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
    selectedStatus,
  ]);

  // filtered list
  const TABLE_COLUMNS = useMemo(() => {
    if (!filteredData.length) return [];
    return Object.keys(filteredData[0]).filter(
      (key) => key !== "__rowNumber" && key !== "_rowNumber",
    );
  }, [filteredData]);
  // console.log("EB ", TABLE_COLUMNS);
  useEffect(() => {
    setCurrentPage(1); // reset page on filters/search/month change
  }, [
    searchText,
    selectedProperty,
    selectedAssignee,
    selectedPaid,
    selectedReviewer,
    selectedMonth,
    selectedStatus,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredData.length / ITEMS_PER_PAGE),
  );

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredData.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredData, currentPage]);
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
    setSelectedStatus(null);
    setSearchInput("");
    setSearchText("");
    console.log(filterTotal);
  };
  const activeFilterCount =
    (selectedProperty ? 1 : 0) +
    (selectedAssignee ? 1 : 0) +
    (selectedPaid ? 1 : 0) +
    (selectedReviewer ? 1 : 0) +
    (selectedStatus ? 1 : 0) +
    (searchText ? 1 : 0);
  // format date  Formats date to: DD Mon YYYY Returns "-" for empty values
  const formatDate = (dateStr) => {
    if (!dateStr) return "-";

    const date = new Date(dateStr);

    return date
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      .replace("am", "AM")
      .replace("pm", "PM");
  };

  if (isError) {
    return <div>Error loading EB data</div>;
  }

  const handleCheckboxChange = (PropertyCode) => {
    setSelectedLeadNos((prev) =>
      prev.includes(PropertyCode)
        ? prev.filter((no) => no !== PropertyCode)
        : [...prev, PropertyCode],
    );
  };
  const formatLogDate = () => {
    return new Date().toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };
  const handleTransferSave = async () => {
    // const comment = commentRef.current?.value?.trim();

    // if (!comment) {
    //   toast.error("Comment is required to transfer the lead");
    //   commentRef.current?.focus();
    //   return;
    // }
    try {
      const payload = [];

      data.forEach((row) => {
        if (!selectedLeadNos.includes(row.PropertyCode)) return;

        const oldAssignee = row.Assignee || "Unassigned";
        const newAssignee = transferAssignee.label;

        const newLog =
          `[${formatLogDate()} - (${decryptedUser?.employee?.EmployeeID}) ${decryptedUser?.employee?.Name}]\n` +
          `Assignee changed from ${oldAssignee} to ${newAssignee}`;

        payload.push({
          PropertyCode: row.PropertyCode, // ✅ LeadNo based
          Assignee: transferAssignee.value, // or Assignee
          WorkLogs: newLog + (row.WorkLogs ? "\n\n" + row.WorkLogs : ""),
        });
      });

      if (!payload.length) {
        // toast.warn("No leads selected");
        return;
      }

      await updateAssigneeMutation({
        sheetName: SHEET_NAME,
        formData: payload,
      });
      // toast.success("Leads transferred successfully");
      toast.success(`Assignee updated for ${payload.length} Properties`);
      setSelectedLeadNos([]);
      setShowTransferModal(false);
      setTransferAssignee(null);
    } catch (err) {
      console.error(err);
      // toast.error("Transfer failed");
    }
  };
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
      columnKey === "Attachments" && value ? (
        <div className="flex gap-2 max-h-[44vh] overflow-auto">
          {value
            .split(",")
            .map((url) => url.trim())
            .filter(Boolean)
            .map((url, i) => {
              const cleanUrl = url.split("?")[0];
              //  console.log("eb calculaion attachments,", url);
              const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
              const isVideo = /\.(mp4|webm|avi|mov|mkv)$/i.test(url);
              //const isPdf = /\.pdf$/i.test(url);
              const isPdf = /\.pdf$/i.test(cleanUrl);
              const fileName = cleanUrl.split("/").pop();

              if (!isImage && !isVideo && !isPdf) return null;

              return (
                <div
                  key={i}
                  className="w-10 h-10 border rounded cursor-pointer overflow-hidden"
                  onClick={() => {
                    if (isImage || isVideo) {
                      setPreviewFile({
                        url,
                        type: isImage ? "image" : "video",
                      });
                    } else {
                      // PDF → open in new tab
                      window.open(url, "_blank");
                    }
                  }}
                  // title="Open attachment"
                  title={fileName} // 👈 this line
                >
                  {isImage ? (
                    <img
                      src={url}
                      alt="attachment"
                      className="w-full h-full object-cover"
                    />
                  ) : isVideo ? (
                    <video
                      src={url}
                      className="w-full h-full object-cover"
                      muted
                    />
                  ) : isPdf ? (
                    <div className="flex flex-col items-center justify-center text-center p-1">
                      <i className="fa-solid fa-file-pdf text-red-600 text-2xl"></i>
                      <span className="text-[10px] mt-1 truncate w-12">
                        {fileName}
                      </span>
                    </div>
                  ) : null}
                </div>
              );
            })}
        </div>
      ) : // <a
      //   href={value}
      //   target="_blank"
      //   rel="noopener noreferrer"
      //   className="text-blue-600 underline font-medium"
      // >
      //   View Attachment
      // </a>
      columnKey === "EBCalnDate" ? (
        formatDate(value)
      ) : columnKey === "FlatEB" && value ? (
        `₹ ${Number(value).toFixed(2).toLocaleString("en-IN")}`
      ) : (
        (value ?? "-")
      );

    // ✅ Tooltip position control
    const isLeftTooltip = columnKey === "WorkLogs" || columnKey === "UpdatedBy" || columnKey === "CreatedBy";
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

        {enableTooltip && show && (
          <div
            className={`
            absolute top-0 left-5 z-[130] w-[350px]
            bg-white border border-gray-300 rounded-lg shadow-xl p-3 text-xs break-words   max-h-[200px] overflow-y-auto
            ${
              isLeftTooltip
                ? "right-full mr-2" // 👈 LEFT side tooltip (UpdatedBy)
                : "left-full ml-2" // 👉 RIGHT side tooltip (others)
            }
          `}
          >
            <div className="whitespace-pre-wrap text-xs space-y-3">
              {columnKey === "WorkLogs" ? (
                // (() => {
                //   const text = normalizeAmPm(fullValue ?? "-");

                //   // Split each log block
                //   const blocks = text.split(/\n\s*\n/);

                //   return blocks.map((block, index) => {
                //     const lines = block.split("\n");
                //     const header = lines[0];
                //     const message = lines.slice(1).join("\n");

                //     return (
                //       <div key={index}>
                //         {/* Header (Date + Name) */}
                //         <div className="text-gray-700">{header}</div>

                //         {/* Message (Bold) */}
                //         <div className="font-bold mt-1">{message}</div>
                //       </div>
                //     );
                //   });
                // })()
                (() => {
                  const text = normalizeAmPm(fullValue ?? "-");

                  const blocks = text.split(/(?=\[\d{1,2} .*?\])/g);

                  return blocks.map((block, index) => {
                    const match = block.match(/^\[(.*?)\]/);
                    const header = match ? `[${match[1]}]` : "";
                    const message = block.replace(/^\[(.*?)\]\s*/, "");

                    return (
                      <div key={index} className="mb-3">
                        {/* Header */}
                        <div className="text-gray-700">{header}</div>

                        {/* Status Message */}
                        <div className="font-bold mt-1 whitespace-pre-wrap">
                          {message}
                        </div>
                      </div>
                    );
                  });
                })()
              ) : (
                <pre>{normalizeAmPm(fullValue ?? "-")}</pre>
              )}
            </div>

            {/* <pre className="whitespace-pre-wrap">
              {normalizeAmPm(fullValue ?? "-")}
            </pre> */}
          </div>
        )}
      </div>
    );
  };

  // handle form success
  const handleFormSuccess = () => {
    setEditingRow(null);

    setActiveTab("EB");
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
    Attachments: "Attachments",
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
  const normalizeAmPm = (text) => {
    if (!text) return text;

    return String(text)
      .replace(/\bam\b/g, "AM")
      .replace(/\bpm\b/g, "PM");
  };

  // get  latest worklogs
  const getLatestWorkLog = (logs) => {
    if (!logs) return "";

    const entries = logs.split(/\n\s*\n/);
    const latest = entries[entries.length - 1];

    return normalizeAmPm(latest);
  };

  // Tooltip  Columns that should show tooltip on hover
  const TOOLTIP_COLUMNS = [
    // "PropertyCode",
    "SubMeterDetails",
    "WorkLogs",
    "UpdatedBy",
    "CreatedBy",
  ];

  return (
    <>
      <div className="min-h-screen w-auto bg-gray-50 pt-16">
        {/* NAVBAR */}
        <nav className="px-1 sm:px-6 shadow-sm">
          <div
            className="
      grid grid-cols-2 gap-2 mt-10
      sm:flex sm:flex-row sm:space-x-6 sm:space-y-0
    "
          >
            {/* dashboard */}
            <button
              onClick={() => {
                setActiveTab("DASHBOARD");
                setEditingRow(null);
              }}
              className={`
    flex items-center space-x-2 px-3 py-2 text-md sm:text-lg font-medium
    rounded-md sm:rounded-t-lg border-b-2 transition-colors
    ${
      activeTab === "DASHBOARD"
        ? "text-orange-600 border-orange-600 bg-orange-50"
        : "text-black border-transparent hover:text-gray-900 hover:border-gray-300"
    }
  `}
            >
              <i className="fas fa-tachometer-alt"></i>
              <span className="">Dashboard</span>
            </button>

            {/* all eb info */}
            <button
              onClick={() => {
                setActiveTab("EB");

                setEditingRow(null);
              }}
              className={`
    flex items-center space-x-2 px-3 py-2 text-md sm:text-lg font-medium
    rounded-md sm:rounded-t-lg border-b-2 transition-colors
    ${
      activeTab === "EB"
        ? "text-orange-600 border-orange-600 bg-orange-50"
        : "text-black border-transparent hover:text-gray-900 hover:border-gray-300"
    }
  `}
            >
              <i className="fas fa-ticket-alt"></i>
              <span>All EB Info</span>
            </button>
            {/* create new record */}
            <button
              onClick={() => {
                setActiveTab("CREATE");

                setEditingRow(null);
              }}
              className={`
    flex items-center space-x-2 px-3 py-2 text-md sm:text-lg font-medium
    rounded-md sm:rounded-t-lg border-b-2 transition-colors
    ${
      activeTab === "CREATE"
        ? "text-orange-600 border-orange-600 bg-orange-50"
        : "text-black border-transparent hover:text-gray-900 hover:border-gray-300"
    }
  `}
            >
              <i className="fas fa-plus-circle"></i>
              <span>Create New</span>
            </button>
          </div>
        </nav>

        {/* Dashboard */}
        {activeTab === "DASHBOARD" && (
          <div className="mx-6 my-10">
            {isPending ? (
              <DashboardSkeleton />
            ) : (
              <Dashboard data={data} isPending={isPending} />
            )}
          </div>
        )}

        {/* ================= FILTER PANEL ================= */}
        {activeTab === "EB" &&
          !editingRow &&
          (isLoading ? (
            <EBSkeleton />
          ) : (
            <div className="mx-6 my-6">
              <div className="bg-white flex justify-between sm:block rounded-lg shadow p-4 mb-6">
                {/* HEADER */}

                <div className="flex justify-end md:px-6 gap-3 items-center mb-1">
                  {activeFilterCount > 0 && (
                    <button
                      onClick={clearAllFilters}
                      className="text-orange-600 hover:text-orange-800 font-bold text-lg underline"
                    >
                      Clear All Filters
                    </button>
                  )}
                  {selectedLeadNos.length > 0 && (
                    <button
                      onClick={() => setShowTransferModal(true)}
                      className="text-orange-500 hover:text-orange-600 font-bold text-lg underline"
                    >
                      Changed Assignee ({selectedLeadNos.length}){" "}
                      <i className="fa-solid fa-arrow-right"></i>
                    </button>
                  )}
                </div>

                {/* FILTER ROW */}
                <div className="w-full md:px-2  overflow-x-auto">
                  <div className="flex gap-4 pb-2  ">
                    {/* 🔍 SEARCH */}
                    <div>
                      <label className="block text-lg font-medium text-gray-800 mb-1">
                        Search
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search Property"
                          value={searchInput}
                          onChange={(e) => {
                            setSearchInput(e.target.value);
                            const handler = setTimeout(() => {
                              setSearchText(e.target.value.trim());
                            }, 300);
                            return () => clearTimeout(handler);
                          }}
                          className="w-[200px] pl-2 pr-3 py-2 border-2 border-orange-300 rounded-md
                      focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300"
                        />
                      </div>
                    </div>
                    {/* MONTH SELECT */}

                    <div className="">
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
                                  selectedMonth.value.slice(0, 3),
                                ), // month
                                1,
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
                        popperPlacement="right"
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

                    {/* EB CALCULATION STATUS SELECT */}
                    <div>
                      <label className="block text-lg  whitespace-nowrap font-medium text-gray-700 mb-1">
                        EB Calculation Status
                      </label>
                      <Select
                        value={selectedStatus}
                        onChange={setSelectedStatus}
                        options={dynamicFilters.status}
                        styles={SelectStylesfilter}
                        className="w-[200px]"
                        isClearable
                        placeholder="Select Status"
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
                  <div className="max-h-[44vh] overflow-auto">
                    {filteredData.length === 0 ? (
                      <div className="px-6 text-center text-gray-500 lg:mt-40 font-semibold flex items-center justify-center">
                        No records found for selected filters
                      </div>
                    ) : (
                      <table className="min-w-full border-collapse text-sm table-fixed">
                        <thead className="bg-black text-white sticky top-0 z-[50] backdrop-blur-sm">
                          <tr>
                            <th className=" sticky left-0 z-20 bg-black ">
                              <input
                                type="checkbox"
                                className="w-10 scale-150 accent-orange-500"
                                checked={
                                  selectedLeadNos.length ===
                                    paginatedData.length &&
                                  paginatedData.length > 0
                                }
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedLeadNos(
                                      paginatedData.map((r) => r.PropertyCode),
                                    );
                                  } else {
                                    setSelectedLeadNos([]);
                                  }
                                }}
                              />
                            </th>
                            {TABLE_COLUMNS.map((key, colIndex) => (
                              <th
                                key={key}
                                className={`px-3 py-3 text-left font-bold text-white text-lg whitespace-nowrap
                            ${colIndex < 2 ? "sticky z-40 bg-black" : ""}
                            
                          `}
                                style={{
                                  width: getColumnWidth(colIndex, key),
                                  left: getStickyLeft(colIndex),
                                }}
                              > 
                                {key === "UpdatedBy" ? "" : formatHeader(key)}
                              </th>
                            ))}
                            <th
                              className="px-4 py-3 font-bold text-lg text-white sticky right-0 z-[120] bg-black shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.1)]"
                              style={{ width: ACTION_COL_WIDTH }}
                            >
                              Actions
                            </th>
                          </tr>
                        </thead>

                        <tbody className=" divide-y divide-gray-200 text-[16px]">
                          {paginatedData.map((row, idx) => (
                            <tr key={idx} className="hover:bg-[#F8F9FB]">
                              <td className="sticky left-0 z-10 bg-white ">
                                <input
                                  type="checkbox"
                                  className="w-10 scale-150 accent-orange-500"
                                  checked={selectedLeadNos.includes(
                                    row.PropertyCode,
                                  )}
                                  onChange={() =>
                                    handleCheckboxChange(row.PropertyCode)
                                  }
                                />
                              </td>
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
                                        : key === "UpdatedBy" ? "" : row[key]
                                    }
                                    fullValue={row[key]}
                                    colIndex={colIndex}
                                    columnKey={key}
                                  />
                                </td>
                              ))}
                              <td className="pl-8 py-2  sticky right-0 z-[30] bg-white shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.1)]">
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

                  <div className="flex justify-center items-center gap-6 m-5">
                    <span className="text-sm text-gray-700">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => p - 1)}
                      className="px-4 py-2 bg-black text-white rounded disabled:opacity-50"
                    >
                      <i className="fa-solid fa-arrow-left"></i> Previous
                    </button>
                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((p) => p + 1)}
                      className="px-4 py-2 bg-black text-white rounded disabled:opacity-50"
                    >
                      Next <i className="fa-solid fa-arrow-right"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

        {activeTab === "CREATE" && (
          <CreateAndEdit
            sheetName={SHEET_NAME}
            existingPropertyCodes={existingPropertyCodes}
            onClose={() => {
              setActiveTab("EB");
            }}
            onSuccess={handleFormSuccess}
          />
        )}
        {activeTab === "EB" && editingRow && (
          <CreateAndEdit
            sheetName={SHEET_NAME}
            editingRow={editingRow}
            onClose={() => setEditingRow(null)}
            onSuccess={handleFormSuccess}
          />
        )}
      </div>
      {previewFile && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999]"
          onClick={() => setPreviewFile(null)}
        >
          <div
            className="bg-white p-4 rounded-lg max-w-2xl w-[40%] max-h-screen overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {previewFile.type === "image" && (
              <img
                src={previewFile.url}
                alt="preview"
                className="max-h-[80vh] mx-auto"
              />
            )}

            {previewFile.type === "video" && (
              <video
                src={previewFile.url}
                controls
                autoPlay
                className="max-h-[80vh] mx-auto"
              />
            )}

            {previewFile.type === "pdf" && (
              <Document file={previewFile.url}>
                <Page pageNumber={1} width={800} />
              </Document>
            )}

            <button
              onClick={() => setPreviewFile(null)}
              className="absolute top-4 right-4 text-white bg-red-600 px-3 py-1 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
      {showTransferModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[350px] shadow-xl">
            <h2 className="text-lg font-semibold mb-4">Transfer To</h2>

            <Select
              options={REVIEWER_MASTER}
              placeholder="Select Assignee"
              value={transferAssignee}
              onChange={setTransferAssignee}
              styles={SelectStyles}
              // className="border border-orange-400 rounded-md"
            />
            {/* <div className="mt-3">
                    <label className="text-sm text-gray-700 relative after:content-['*'] after:ml-1 after:text-red-500">
                      Comments
                    </label>
      
                    <textarea
                      ref={commentRef}
                      className="w-full px-3 py-[8px] border border-orange-400 outline-none rounded-md focus:ring-2 focus:ring-orange-300"
                      placeholder="Enter reason for transfer lead"
                    />
                  </div> */}

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowTransferModal(false)}
                className="px-4 py-1 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleTransferSave}
                className="px-4 py-1 bg-orange-500 text-white rounded"
                // disabled={!transferAssignee}
              >
                {/* {isUpdatePending ? <div className="flex justify-center items-center gap-2">
                        <LoaderPage /> Transferring...
                      </div> : "Save"} */}
                <div className="flex justify-center items-center gap-2">
                  {isUpdateAssigneePending ? (
                    <span className="flex items-center gap-2">
                      <LoaderPage />
                      Transferring...
                    </span>
                  ) : (
                    "Transfer"
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EbCalculation;