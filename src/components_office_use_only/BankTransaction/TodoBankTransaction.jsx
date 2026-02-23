import { yupResolver } from '@hookform/resolvers/yup';
import Select from "react-select"
import { usePropertyData, useEmployeesDetails, useDropDowlList, useBankTransactionData, useUpdateBankTransaction } from "./Services/index";
import React, { useState, useMemo, useEffect } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../../context/AuthContext';
import { SelectStylesfilter } from "../../Config";
import Dashboard from "./Dashboard";
import { DashboardSkeleton, FormSkeleton, SearchSkeleton, TableSkeleton } from "./Skeleton";
import TodoBankForm from "./TodoBankForm";

const schema = yup.object().shape({
  // Date: yup.date().typeError("Date is required").required("Date is required"),
  Narration: yup.string().required("Narration is required"),
  ChqRefNo: yup.string().required("Chq./Ref. No. is required"),
  // ValueDate: yup.date().typeError("Value Date is required").required("Value Date is required"),
  PropertyExpenseCode: yup.string().required("Property / Expense Code is required"),
  ExpenseCategory: yup.string().required("Expense Category is required"),
  StatusForView: yup.string().required("StatusForView is required"),
  Comment: yup.string().when("StatusForView", {
    is: (val) => val === "RoadBlock" || val === "Re-Open",
    then: (schema) => schema.required("Comment is required"),
    otherwise: (schema) => schema.notRequired(),
  })
});

export default function TodoBankTransaction() {
  const { data: propertyDetails, isLoading: propertyLoading } = usePropertyData();
  const { data: employeesDetails } = useEmployeesDetails();
  const { data: dropdownlist } = useDropDowlList();

  const [filters, setFilters] = useState({
    bankACNo: "",
    propertyExpenseCode: "",
    assignee: "",
    reviewer: "",
    StatusForView: "",
    fromDate: null,
    toDate: null,
    auditor: ""
  });
  const [globalSearch, setGlobalSearch] = useState("");

  const { data: BankTransaction, isPending: bankLoading } = useBankTransactionData();
  const { user, isAuthenticated } = useAuth();

  const { mutate: updateBankData, isPending: isUpdatingData } = useUpdateBankTransaction();
  const [activeTab, setActiveTab] = useState("DASHBOARD");
  const [editingRow, setEditingRow] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [data, setData] = useState([]); // table data
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const { control, register, watch, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });




  const propertyOptions = Array.isArray(propertyDetails?.data)
    ? propertyDetails.data.map((ele) => ({
      value: ele["Property Code"] || ele.code,
      label: ele["Property Code"] || ele.code,
    }))
    : [];

  const reviewerOptions = Array.isArray(employeesDetails?.data)
    ? employeesDetails.data
      .filter(emp => emp.Department === "Accounts" && emp.Name)
      .map(emp => ({
        value: emp.Name,
        label: emp.Name,
      }))
    : [];

  const expenseCategoryOptions = Array.isArray(dropdownlist)
    ? [...new Set(dropdownlist?.map(item => item.ExpenseCategory?.trim())
      .filter(Boolean))].map(value => ({
        value,
        label: value,
      }))
    : [];

  const StatusOptions = Array.isArray(dropdownlist)
    ? [...new Set(dropdownlist
      ?.map(item => item.Status?.trim())
      .filter(Boolean))].map(value => ({
        value,
        label: value,
      }))
    : [];

  const AuditorOptions = [
    { value: "Kamleshwar Kodag", label: "Kamleshwar Kodag" },
    { value: "Abhishek Gautam", label: "Abhishek Gautam" }
  ];


  const bankACNoOptions = useMemo(() => {
    if (!BankTransaction?.data) return [];

    const uniqueValues = [
      ...new Set(
        BankTransaction.data
          .map(row => row.BankACNo)
          .filter(Boolean)
      )
    ].reverse();

    return uniqueValues.map((val, index) => ({
      value: val,
      label: ` ${val}`
    }));

  }, [BankTransaction?.data]);

  //FILTER
  const filteredData = useMemo(() => {
    if (!BankTransaction?.data) return [];

    const filtered = BankTransaction.data.filter(row => {

      const parseRowDate = (dateStr) => {
        if (!dateStr) return null;

        const [day, month, year] = dateStr.split("/");

        const fullYear =
          Number(year) < 50 ? 2000 + Number(year) : 1900 + Number(year);

        return new Date(fullYear, Number(month) - 1, Number(day));
      };

      const rowDate = parseRowDate(row.Date);

      // Normalize filter dates
      const fromDate = filters.fromDate
        ? new Date(new Date(filters.fromDate).setHours(0, 0, 0, 0))
        : null;

      const toDate = filters.toDate
        ? new Date(new Date(filters.toDate).setHours(23, 59, 59, 999))
        : null;

      const matchesDate =
        (!fromDate || (rowDate && rowDate >= fromDate)) &&
        (!toDate || (rowDate && rowDate <= toDate));

      // Filter logic
      const matchesFilters =
        (!filters.bankACNo || row.BankACNo === filters.bankACNo) &&
        (!filters.propertyExpenseCode || row.PropertyExpenseCode === filters.propertyExpenseCode) &&
        (!filters.assignee || row.Assignee === filters.assignee) &&
        (!filters.reviewer || row.Reviewer === filters.reviewer) &&
        (!filters.status || row.StatusForView === filters.status) &&
        (!filters.auditor || row.Auditor === filters.auditor);

      const matchesDeposit = !filters.DepositAmt || Number(row["DepositAmt."]) > 0;
      const matchesWithdrawal = !filters.WithdrawalAmt || Number(row["WithdrawalAmt."]) > 0;

      // Global search
      const search = globalSearch.toLowerCase();
      const matchesSearch =
        search === "" ||
        Object.values(row).some(val => String(val).toLowerCase().includes(search));

      return matchesFilters && matchesSearch && matchesDate && matchesDeposit && matchesWithdrawal;
    });

    return [...filtered];
  }, [BankTransaction?.data, filters, globalSearch]);

  const selectedStatus = watch("Status");

  useEffect(() => {
    if (isAuthenticated && user?.employee?.Name) {
      //console.log("Logged-in User Name:", user.name);
      //setValue("UpdatedBy", user.name); //auto-fill
    }
  }, [user, isAuthenticated, setValue]);



  // ===================== onSubmit =====================

  const onSubmit = async (data) => {

    // ✅ Date normalize helper
    const normalizeDate = (value) => {
      if (!value) return "";

      const dateObj = new Date(value);
      if (isNaN(dateObj)) return "";

      return dateObj.toISOString().split("T")[0];
    };

    try {
      let previousRow = null;
      let existingWorklogs = "";


      if (editingRow && BankTransaction?.data) {
        previousRow = BankTransaction.data.find(row =>
          row.Narration === editingRow.Narration &&
          row["Chq.No./Ref.No."] === editingRow["Chq.No./Ref.No."]

        );

        existingWorklogs = previousRow?.Worklogs || "";
      }

      const payload = {
        Date: data?.Date,
        Narration: data.Narration || "",
        "Chq.No./Ref.No.": data.ChqRefNo || "",
        ValueDate: data?.ValueDate,
        "WithdrawalAmt.": data.WithdrawalAmt || "",
        "DepositAmt.": data.DepositAmt || "",
        PropertyExpenseCode: data.PropertyExpenseCode || "",
        ExpenseCategory: data.ExpenseCategory || "",
        Assignee: data.Assignee || user?.employee?.Name || "",
        StatusForEdit: data.StatusForView || "",
        // Reviewer: data.Status === "Review Done" || data.Status === "Re-Open" ? user?.employee?.Name : data.Reviewer || "",
        // Auditor: data.Status === "Closed" || data.Status === "Re-Open" ? user?.employee?.Name : data.Auditor || "",
        Reviewer: data.StatusForView === "Review Done" ? user?.employee?.Name : data.Reviewer || "",
        Auditor: data.StatusForView === "Closed" ? user?.employee?.Name : data.Auditor || "",
        Worklogs: data.Worklogs || existingWorklogs,
      };

      const fieldNameMap = {
        PropertyExpenseCode: "Property / Expense Code",
        ExpenseCategory: "Expense Category",
        StatusForEdit: "Status",
      };

      /* ================== WORKLOG LOGIC START ================== */

      if (editingRow && previousRow) {
        const previousRow = BankTransaction.data.find(row =>
          row.Narration === payload.Narration &&
          row["Chq.No./Ref.No."] === payload["Chq.No./Ref.No."]
        );
        const now = new Date();

        const formattedDate = now.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });

        const formattedTime = now.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });

        const header = `[${formattedDate}, ${formattedTime} - (${user?.employee?.EmployeeID}) ${user?.employee?.Name || ""
          }]`;

        const changedFields = [];
        const ignoreFields = ["Worklogs"];

        Object.keys(payload).forEach((key) => {
          if (ignoreFields.includes(key)) return;

          let oldValue = previousRow?.[key] ?? "";
          let newValue = payload[key] ?? "";

          // 🔥 Special handling for StatusForEdit
          if (key === "StatusForEdit") {
            oldValue = previousRow?.StatusForEdit
              ? previousRow.StatusForEdit
              : previousRow?.StatusForView || "Open";

            newValue = payload.StatusForEdit || "Open";
          }


          if (["Date", "ValueDate"].includes(key)) {
            oldValue = normalizeDate(oldValue);
            newValue = normalizeDate(newValue);
          } else {
            oldValue = oldValue.toString().trim();
            newValue = newValue.toString().trim();
          }

          const displayKey = fieldNameMap[key] || key;

          if (oldValue !== newValue) {
            changedFields.push(
              `${displayKey} changed from ${oldValue || "N/A"} to ${newValue || "N/A"}`
            );

          }
        });
        /* ================== CHANGE LOG ================== */

        let newBlock = "";

        const comment = data.Comment?.trim();

        if (changedFields.length > 0) {

          newBlock = `${header}\n${changedFields.join("\n")}`;
          if (comment) {
            newBlock += `\n${comment}`;
          }
        } else if (comment) {
          newBlock = `${header}\n${comment}`;
        }

        /* ================== FINAL MERGE ================== */
        if (newBlock) {
          payload["Worklogs"] = existingWorklogs
            ? newBlock + "\n\n" + existingWorklogs
            : newBlock;
        }
      }
      /* ================== WORKLOG LOGIC END ================== */

      updateBankData({
        ...payload,
        Narration: data.Narration,
        "Chq.No./Ref.No.": data.ChqRefNo,
      }, {
        onSuccess: () => {

          toast.dismiss();
          toast.success("Bank Transaction Updated successfully");
          // reset();
          setValue("Comment", "");
          setEditingRow(null);
          // setActiveTab("LIST");

        },
      });

    } catch (err) {
      console.error(err);
      toast.dismiss();
      toast.error("Something went wrong!");
    }
  };




  const parseDBDate = (dateStr) => {
    if (!dateStr) return null;

    const [dd, mm, yy] = dateStr.split("/");
    const year = Number(yy) < 50 ? `20${yy}` : `19${yy}`;

    return new Date(`${year}-${mm}-${dd}`);
  };


  const handleEdit = (row, index) => {
    setCurrentIndex(index);
    setEditingRow({ ...row }); // spread important

    setActiveTab("CREATE");
    window.scrollTo({ top: 0, behavior: "smooth" });

    reset({
      Date: row.Date ? parseDBDate(row.Date) : null,
      Narration: row.Narration || "",
      ChqRefNo: row["Chq.No./Ref.No."] || "",
      ValueDate: row.ValueDate ? parseDBDate(row.ValueDate) : null,
      WithdrawalAmt: row["WithdrawalAmt."] || "",
      DepositAmt: row["DepositAmt."] || "",
      PropertyExpenseCode: row.PropertyExpenseCode || "",
      ExpenseCategory: row.ExpenseCategory || "",
      Assignee: row.Assignee || "",
      StatusForView: row.StatusForView || "",
      Reviewer: row.Reviewer || "",
      Auditor: row.Auditor || "",
      Worklogs: row.Worklogs || "",
    });

  };

  const goToNext = () => {
    if (currentIndex < filteredData.length - 1) {
      const nextIndex = currentIndex + 1;
      handleEdit(filteredData[nextIndex], nextIndex);
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      handleEdit(filteredData[prevIndex], prevIndex);
    }
  };
  /* ================= TABLE COLUMN WIDTHS ================= */
  const SR_NO_WIDTH = 70;
  const DATE_COL_WIDTH = 140;
  const DEFAULT_COL_WIDTH = 160;
  const ACTION_COL_WIDTH = 100;

  const getColumnWidth = (key) => {
    if (key === "index") return SR_NO_WIDTH;
    if (key === "Date") return DATE_COL_WIDTH;
    return DEFAULT_COL_WIDTH;
  };

  const CellWithTooltip = ({ value, disableTooltip = false }) => {
    const [show, setShow] = useState(false);

    if (disableTooltip) {
      return (
        <div className="truncate overflow-hidden text-ellipsis">
          {value ?? "-"}
        </div>
      );
    }

    const isWorklog =
      typeof value === "string" && value.includes("[");

    const previewLine =
      isWorklog
        ? value.split("\n").filter(Boolean)[0]
        : value;

    return (
      <div
        className="relative w-full"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >

        {/* ===== TABLE PREVIEW (NO STYLE CHANGE) ===== */}
        <div className="truncate overflow-hidden text-ellipsis">
          {previewLine ?? "-"}
        </div>

        {/* ===== WORKLOG TOOLTIP ===== */}
        {show && isWorklog && (
          <div
            className="absolute right-10 mr-5 z-[9999]
          bg-white border border-gray-300 rounded-lg shadow-xl
          p-3 max-w-[450px] max-h-[350px] overflow-auto"
            style={{
              width: "max-content",
              minWidth: "280px",
              top: "95%",
              transform: "translateY(0%)"
            }}
          >
            {value.split("\n").map((line, i) => {
              const isHeader = line.startsWith("[");
              const isEmpty = line.trim() === "";

              if (isEmpty) {
                return <div key={i} style={{ height: "12px" }} />;
              }

              return (
                <div
                  key={i}
                  style={{
                    fontWeight: isHeader ? "normal" : "600",
                    color: isHeader ? "#374151" : "#000",
                    fontSize: "13px",
                  }}
                >
                  {line}
                </div>
              );
            })}
          </div>
        )}

        {/* ===== NORMAL TOOLTIP FOR OTHER COLUMNS ===== */}
        {show && !isWorklog && (
          <div
            className="absolute left-10 ml-3 top-5 z-[9999] bg-white border border-gray-300 rounded-lg shadow-xl p-3 text-xs break-words max-w-[400px] max-h-[400px] overflow-auto"
            style={{ width: 'max-content', minWidth: '150px' }}
          >
            <pre className="whitespace-pre-wrap">{value ?? "-"}</pre>
          </div>
        )}
      </div>
    );
  };

  const paginatedData = useMemo(() => {
    const startIdx = (currentPage - 1) * rowsPerPage;
    return filteredData.slice(startIdx, startIdx + rowsPerPage);
  }, [filteredData, currentPage]);

  const totalPages = Math.ceil((filteredData.length || 0) / rowsPerPage);

  const TABLE_COLUMNS = [
    { key: "index", label: "Sr.No." },
    { key: "Date", label: "Date" },
    { key: "Narration", label: "Narration" },
    { key: "Chq.No./Ref.No.", label: "Chq. No./Ref. No." },
    { key: "WithdrawalAmt.", label: "Withdrawal Amt." },
    { key: "DepositAmt.", label: "Deposit Amt." },
    { key: "PropertyExpenseCode", label: "Property / Expense Code" },
    { key: "ExpenseCategory", label: "Expense Category" },
    { key: "Assignee", label: "Assignee" },
    { key: "StatusForView", label: "Status" },
    { key: "Reviewer", label: "Reviewer" },
    { key: "Auditor", label: "Auditor" },
    { key: "Worklogs", label: "Worklogs" },
    { key: "ValueDate", label: "Value Date" },

  ];

  const formatDate = (dateStr) => {
    if (!dateStr || dateStr === "-") return "-";

    const parts = dateStr.split("/");
    if (parts.length !== 3) return dateStr;

    let [day, month, year] = parts;

    // 2-digit year handle (26 → 2026)
    if (year.length === 2) {
      year = `20${year}`;
    }

    const dateObj = new Date(year, month - 1, day);

    return dateObj.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };


  return (

    <div className='min-h-screen w-auto bg-gray-50 pt-24'>

      {/* ================= TOP TABS ================= */}
      <nav className="px-0 sm:px-0 shadow-sm">
        <div className="bg-white rounded-t-lg  px-2 pt-2 flex items-center relative gap-6">

          {/* Left buttons */}
          <div className="flex gap-6">
            <button
              onClick={() => {
                setActiveTab("DASHBOARD");
                setEditingRow(null);
                reset();
              }}
              className={`flex items-center space-x-2 px-3 py-2 text-md sm:text-lg font-medium rounded-md sm:rounded-t-lg border-b-2 transition-colors
      ${activeTab === "DASHBOARD"
                  ? "text-orange-600 border-orange-600 bg-orange-50"
                  : "text-black border-transparent hover:text-gray-900 hover:border-gray-300"}`}
            >
              <i className="fas fa-tachometer-alt"></i>
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => {
                setActiveTab("LIST");
                setEditingRow(null);
                reset();
              }}
              className={`flex items-center space-x-2 px-3 py-2 text-md sm:text-lg font-medium rounded-md sm:rounded-t-lg border-b-2 transition-colors
      ${activeTab === "LIST" ? "text-orange-600 border-orange-600 bg-orange-50"
                  : "text-black border-transparent hover:text-gray-900 hover:border-gray-300"}`}
            >
              <i className="fas fa-ticket-alt"></i>
              <span>All Info</span>
            </button>
          </div>

          {/* Center heading */}
          <div className="absolute left-1/2 transform -translate-x-1/2 font-bold text-xl text-gray-800">
            Bank Transaction
          </div>

          {/* Right buttons */}
          {editingRow && (
            <button
              className={`flex items-center space-x-2 px-3 py-2 text-md sm:text-lg font-medium rounded-md sm:rounded-t-lg border-b-2 transition-colors
      ${activeTab === "CREATE"
                  ? "text-orange-600 border-orange-600 bg-orange-50"
                  : "text-black border-transparent hover:text-gray-900 hover:border-gray-300"}`}
            >
              <i className="fas fa-edit"></i>
              <span>Update Transaction Info</span>
            </button>
          )}

        </div>
      </nav>

      {/* ================= DASHBOARD ================= */}
      {activeTab === "DASHBOARD" && (
        (bankLoading) ? (
          <div className="p-6 bg-white">
            <DashboardSkeleton />
          </div>
        ) : (
          <div className="p-6 bg-white">
            <Dashboard data={BankTransaction?.data || []} />
          </div>
        )
      )}

      {/* ================= CREATE FORM ================= */}
      <div className='bg-white'>
        {activeTab === "CREATE" && (
          (false) ? (
            <FormSkeleton />
          ) : (
            <TodoBankForm
              control={control}
              register={register}
              errors={errors}
              handleSubmit={handleSubmit}
              watch={watch}
              setValue={setValue}
              reset={reset}
              editingRow={editingRow}
              propertyOptions={propertyOptions}
              expenseCategoryOptions={expenseCategoryOptions}
              StatusOptions={StatusOptions}
              reviewerOptions={reviewerOptions}
              AuditorOptions={AuditorOptions}
              updateBankData={updateBankData}
              selectedStatus={selectedStatus}
              onSubmit={onSubmit}
              setActiveTab={setActiveTab}
              setEditingRow={setEditingRow}
              goToNext={goToNext}
              goToPrevious={goToPrevious}
              currentIndex={currentIndex}
              totalLength={filteredData.length}
              data={BankTransaction?.data}
              isUpdatingData={isUpdatingData}
              user={user}

            />
          )
        )}
      </div>

      {/* ================= FILTER PANEL ================= */}
      {activeTab === "LIST" && (
        (bankLoading) ? (
          <SearchSkeleton />
        ) : (
          <div className="px-2 py-2 bg-white">
            <div className="bg-white rounded-lg shadow mb-1">

              {/* HEADER */}
              <div className="flex justify-end md:px-2 gap-5 mr-5 items-center">

                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    className='w-4 h-4 accent-orange-500'
                    checked={filters.DepositAmt}
                    onChange={(e) => setFilters(prev => ({ ...prev, DepositAmt: e.target.checked, WithdrawalAmt: false }))}
                  />
                  <label className='text-lg font-semibold'>Deposits</label>
                  <input
                    type="radio"
                    className='w-4 h-4 accent-orange-500'
                    checked={filters.WithdrawalAmt}
                    onChange={(e) => setFilters(prev => ({ ...prev, WithdrawalAmt: e.target.checked, DepositAmt: false }))}
                  />
                  <label className='text-lg font-semibold'>Withdrawals</label>
                </div>



                {Object.values(filters).some(val => val) && (
                  <button
                    onClick={() => {
                      setFilters({
                        bankACNo: "",
                        propertyExpenseCode: "",
                        assignee: "",
                        fromDate: null,
                        toDate: null,
                        DepositAmt: false,
                        WithdrawalAmt: false,
                      });
                      setCurrentPage(1);
                    }}
                    className="text-orange-600 hover:text-orange-800 font-bold text-lg underline"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>


              {/* FILTER ROW */}
              <div className="w-full md:px-2 overflow-x-auto">
                <div className="flex gap-4 pt-2 pb-2">

                  {/* GLOBAL SEARCH */}
                  <div>
                    <label className="block text-md font-medium text-gray-800">
                      Search
                    </label>
                    <input
                      type="text"
                      value={globalSearch}
                      onChange={(e) => {
                        setGlobalSearch(e.target.value);
                        setCurrentPage(1); // reset page on search
                      }}
                      placeholder="Search"
                      className="w-[200px] p-2 border-2 border-orange-300 rounded-md
                      focus:outline-none focus:ring-1 focus:ring-orange-300 focus:border-orange-300  mt-1"
                    />
                  </div>

                  {/* FROM DATE */}
                  <div className="flex flex-col w-[200px]">
                    <label className="block text-md font-medium text-gray-800">
                      From Date
                    </label>

                    <DatePicker
                      selected={filters.fromDate}
                      onChange={(date) => {
                        setFilters(prev => ({
                          ...prev,
                          fromDate: date
                        }));
                        setCurrentPage(1);
                      }}
                      dateFormat="d MMM yyyy"
                      placeholderText="From Date"
                      className="w-[200px] p-2 border-2 border-orange-300 rounded-md
                      focus:outline-none focus:ring-1 focus:ring-orange-300 focus:border-orange-300  mt-1"
                      wrapperClassName="w-full"
                      popperPlacement="bottom-start"
                      popperClassName="!z-[99999]"
                      isClearable
                    />
                  </div>


                  {/* TO DATE */}
                  <div className="flex flex-col w-[200px]">
                    <label className="block text-md font-medium text-gray-1000">
                      To Date
                    </label>

                    <DatePicker
                      selected={filters.toDate}
                      onChange={(date) => {
                        setFilters(prev => ({
                          ...prev,
                          toDate: date
                        }));
                        setCurrentPage(1);
                      }}
                      dateFormat="d MMM yyyy"
                      placeholderText="To Date"
                      className="w-[200px] p-2 border-2 border-orange-300 rounded-md
                                      focus:outline-none focus:ring-1 focus:ring-orange-300 focus:border-orange-300 mt-1"
                      wrapperClassName="w-full"
                      popperPlacement="bottom-start"
                      popperClassName="!z-[99999]"
                      isClearable
                    />
                  </div>

                  {/* SEARCH ACCOUNT */}
                  <div className="flex flex-col w-[200px]">
                    <label className="block text-md font-medium text-gray-800">
                      Select Bank Account
                    </label>

                    <Select
                      value={
                        filters.bankACNo
                          ? bankACNoOptions.find(opt => opt.value === filters.bankACNo)
                          : null
                      }
                      options={bankACNoOptions}
                      placeholder="Account"
                      onChange={(selected) => {
                        setFilters(prev => ({
                          ...prev,
                          bankACNo: selected?.value || ""
                        }));
                        setCurrentPage(1);
                      }}
                      styles={SelectStylesfilter}
                      isClearable
                      menuPortalTarget={document.body}
                      menuPosition="fixed"
                    />
                  </div>

                  {/* PROPERTY */}
                  <div className="flex flex-col w-[200px]">
                    <label className="block text-md font-medium text-gray-800">
                      Property / Expense Code
                    </label>

                    <Select
                      value={filters.propertyExpenseCode ? propertyOptions.find(opt => opt.value === filters.propertyExpenseCode) : null}
                      options={propertyOptions}
                      placeholder="Property"
                      onChange={(selected) => {
                        setFilters(prev => ({
                          ...prev,
                          propertyExpenseCode: selected?.value || ""
                        }));
                        setCurrentPage(1);
                      }}
                      styles={SelectStylesfilter}
                      isClearable
                      menuPortalTarget={document.body}
                      menuPosition="fixed"
                    />
                  </div>

                  {/* Status */}
                  <div className="flex flex-col w-[200px]">
                    <label className="block text-md font-medium text-gray-800">
                      Status
                    </label>

                    <Select
                      value={filters.status ? StatusOptions.find(opt => opt.value === filters.StatusForView) : null}
                      options={StatusOptions}
                      placeholder="Status"
                      onChange={(selected) => {
                        setFilters(prev => ({
                          ...prev,
                          status: selected?.value || ""
                        }));
                        setCurrentPage(1);
                      }}
                      styles={SelectStylesfilter}
                      isClearable
                      menuPortalTarget={document.body}
                      menuPosition="fixed"
                    />
                  </div>

                  {/* ASSIGNEE */}
                  <div className="flex flex-col w-[200px]">
                    <label className="block text-md font-medium text-gray-800">
                      Assignee
                    </label>

                    <Select
                      value={filters.assignee ? reviewerOptions.find(opt => opt.value === filters.assignee) : null}
                      options={reviewerOptions}
                      placeholder="Assignee"
                      onChange={(selected) => {
                        setFilters(prev => ({
                          ...prev,
                          assignee: selected?.value || ""
                        }));
                        setCurrentPage(1);
                      }}
                      styles={SelectStylesfilter}
                      isClearable
                      menuPortalTarget={document.body}
                      menuPosition="fixed"
                    />
                  </div>
                  {/* Reviewer */}
                  <div className="flex flex-col w-[200px]">
                    <label className="block text-md font-medium text-gray-800">
                      Reviewer
                    </label>

                    <Select
                      value={filters.reviewer ? reviewerOptions.find(opt => opt.value === filters.reviewer) : null}
                      options={reviewerOptions}
                      placeholder="Reviewer"
                      onChange={(selected) => {
                        setFilters(prev => ({
                          ...prev,
                          reviewer: selected?.value || ""
                        }));
                        setCurrentPage(1);
                      }}
                      styles={SelectStylesfilter}
                      isClearable
                      menuPortalTarget={document.body}
                      menuPosition="fixed"
                    />
                  </div>

                  {/* Auditor */}
                  <div className="flex flex-col w-[200px]">
                    <label className="block text-md font-medium text-gray-800">
                      Auditor
                    </label>

                    <Select
                      value={filters.auditor ? AuditorOptions.find(opt => opt.value === filters.auditor) : null}
                      options={AuditorOptions}
                      placeholder="Auditor"
                      onChange={(selected) => {
                        setFilters(prev => ({
                          ...prev,
                          auditor: selected?.value || ""
                        }));
                        setCurrentPage(1);
                      }}
                      styles={SelectStylesfilter}
                      isClearable
                      menuPortalTarget={document.body}
                      menuPosition="fixed"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      )}

      {/* ================= Table View ================= */}
      <div className="bg-white shadow-sm px-2 pt-0 rounded-b-lg">
        <div className='overflow-x-auto'>
          {activeTab === "LIST" && (
            (bankLoading) ? (
              <TableSkeleton />
            ) : paginatedData.length > 0 ? (
              <>
                <div className="max-h-[52vh] overflow-auto border border-gray-200">

                  <table className="min-w-full border-collapse text-sm text-left text-gray-700 table-fixed">
                    <thead className="sticky top-0 text-white bg-black z-[30] shadow-md  ">
                      <tr>
                        {TABLE_COLUMNS.map((col) => (
                          <th key={col.key}
                            className={`px-3 py-3 text-left text-md whitespace-nowrap border border-gray-300
                          ${col.key === "index" ? "sticky z-20 text-white border border-gray-100 bg-black" : ""} 
                          ${col.key === "Date" ? "sticky z-20 text-white border border-gray-100 bg-black" : ""}`}
                            style={{
                              width: getColumnWidth(col.key),
                              left: col.key === "index" ? 0 : col.key === "Date" ? SR_NO_WIDTH : undefined
                            }}
                          >
                            {col.key === "index" ? "Sr.No" : col.label}
                          </th>
                        ))}
                        <th className="px-4 py-3 sticky right-0 z-[30] text-white bg-black"
                          style={{ width: ACTION_COL_WIDTH }}>Actions</th>

                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 text-[15px]">
                      {paginatedData.map((row, idx) => (
                        <tr key={idx} className="hover:bg-[#F8F9FB]">
                          {TABLE_COLUMNS.map((col) => (
                            <td
                              key={col.key}
                              className={`px-3 py-3 whitespace-nowrap 
                              ${col.key === "index" ? "sticky bg-white  z-20 " : ""} 
                              ${col.key === "Date" ? "sticky bg-white z-20 " : ""}`}
                              style={{
                                width: getColumnWidth(col.key),
                                maxWidth: getColumnWidth(col.key),
                                left:
                                  col.key === "index"
                                    ? 0
                                    : col.key === "Date"
                                      ? SR_NO_WIDTH
                                      : undefined,
                              }}
                            >
                              {col.key === "Narration" || col.key === "Worklogs" ? (
                                <CellWithTooltip
                                  value={row[col.key] || "-"}
                                />
                              ) : (
                                <div className="truncate overflow-hidden text-ellipsis">
                                  {col.key === "index"
                                    ? (currentPage - 1) * rowsPerPage + idx + 1
                                    : col.key === "Date"
                                      ? formatDate(row[col.key])
                                      : row[col.key] || "-"}
                                </div>
                              )}
                            </td>
                          ))}

                          <td className="px-2 py-2 sticky right-0 bg-white z-[20]" style={{ width: ACTION_COL_WIDTH }}>
                            <div className="flex justify-center gap-2">
                              <button onClick={() => handleEdit(row, filteredData.indexOf(row))}
                                className="text-orange-500 hover:text-orange-700" title="Edit"><i className="fas fa-edit"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* ================= PAGINATION ================= */}
                <div className="flex justify-center items-center gap-5 pt-2 pb-2">
                  {/* Page Info */}
                  <span className="text-sm text-gray-700">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    className="px-3 py-1 bg-black text-white rounded disabled:opacity-50 hover:bg-orange-500 transition-colors"
                  ><i className="fa-solid fa-arrow-left"></i> {" "}
                    Previous
                  </button>

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    className="px-3 py-1 bg-black text-white rounded disabled:opacity-50 hover:bg-orange-500 transition-colors"
                  >
                    Next <i className="fa-solid fa-arrow-right"></i>
                  </button>
                </div>
              </>
            ) : (
              <div className="px-6 pb-8 text-center text-gray-500 lg:mt-20 font-semibold flex items-center justify-center">
                No records found for selected filters
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}