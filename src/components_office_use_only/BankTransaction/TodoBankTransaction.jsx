import { yupResolver } from '@hookform/resolvers/yup';
import Select from "react-select"
import { usePropertyData, useAddBankTransaction, useBankTransactionData, useUpdateBankTransaction, useDeleteBankTransaction } from "./Services/index";
import React, { memo, useState} from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useForm, Controller} from "react-hook-form";
import * as yup from "yup";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const schema = yup.object().shape({
  Date: yup.date().typeError("Date is required").required("Date is required"),
  Narration: yup.string().required("Narration is required"),
  ChqRefNo: yup.string().required("Chq./Ref. No. is required"),
  ValueDate: yup.date().typeError("Value Date is required").required("Value Date is required"),
  //WithdrawalAmt: yup.number().typeError("Withdrawal Amount is required").required("Withdrawal Amount is required"),
  DepositAmt: yup.number().typeError("Deposit Amount is required").required("Deposit Amount is required"),
  PropertyExpenseCode: yup.string().required("Property Expense Code is required"),
  ExpenseCategory: yup.string().required("Expense Category is required"),
  UpdatedBy: yup.string(),
  UpdatedDate: yup.date(),
  UpdateStatus: yup.string(),
  ReviewedBy: yup.string(),
  ReviewedDate: yup.date(),
  CommentsByGPGS: yup.string(),
  //AuditStatus: yup.string(),
  CommentsByAuditTeam: yup.string(),
});

function TodoBankTransactionSkeleton({ type = "table", rows = 10, cols = 10 }) {

// ====================== Form Skeleton ======================
  if (type === "form") {
    return (
      <div className="bg-white shadow-sm py-5 rounded-b-lg px-10 max-w-8xl w-full animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {Array.from({ length: 10 }).map((_, idx) => (
            <div key={idx} className="h-14 bg-gray-200 rounded-md relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer"></div>
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-center gap-4">
          <div className="h-10 w-24 bg-gray-300 rounded relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer"></div>
          </div>
          <div className="h-10 w-24 bg-gray-300 rounded relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer"></div>
          </div>
        </div>

        {/* Shimmer Animation */}
        <style>
          {`
            @keyframes shimmer {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(100%); }
            }
            .animate-shimmer {
              animation: shimmer 1.2s infinite;
            }
          `}
        </style>
      </div>
    );
  }

  return (
    <div className="overflow-auto max-h-[calc(100vh-12rem)] border border-gray-200 rounded-lg p-2">
      <table className="min-w-[1300px] border-collapse text-sm text-left text-gray-700 table-fixed">

        {/* Header Skeleton */}
        <thead className="sticky top-0 bg-orange-300 z-[100] shadow-md font-bold text-gray-800 text-base">
          <tr>
            {Array.from({ length: cols }).map((_, idx) => (
              <th
                key={idx}
                className="px-3 py-3 border-b border-gray-300 bg-gray-300 rounded"
              >
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
              </th>
            ))}
          </tr>
        </thead>

        {/* Body Skeleton */}
        <tbody className="divide-y divide-gray-200">
        {Array.from({ length: rows }).map((_, rowIdx) => (
          <tr key={rowIdx} className="h-[50px]">
            {Array.from({ length: cols }).map((__, colIdx) => (
              <td key={colIdx} className="px-3 py-3">
                <div
                  className="h-5 w-full bg-gray-200 rounded relative overflow-hidden"
                  style={{
                    animationDelay: `${rowIdx * 100 + colIdx * 50}ms`,
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer"></div>
                </div>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
      </table>

      {/* Shimmer Animation */}
      <style>
        {`
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          .animate-shimmer {
            animation: shimmer 1.2s infinite;
          }
        `}
      </style>
    </div>
  );
};


export default function TodoBankTransaction() {
  const { data: propertyDetails, isLoading: propertyLoading } = usePropertyData();
  const { data: BankTransaction, isLoading: bankLoading } = useBankTransactionData();

  const addTransactionMutation = useAddBankTransaction();
  const updateTransactionMutation = useUpdateBankTransaction();
  const deleteTransactionMutation = useDeleteBankTransaction();
  const [activeTab, setActiveTab] = useState("LIST"); // LIST | CREATE
  const [editingIndex, setEditingIndex] = useState(null); // <-- For Update

  const { control, register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const MemoizedSelect = memo(({ field, options, placeholder, isDisabled, onChange, styles }) => (
    <Select
      {...field}
      value={options?.find((opt) => opt.value === field.value)}
      isDisabled={isDisabled}
      options={options}
      placeholder={placeholder}
      styles={styles}
      onChange={(selectedOption) => onChange(selectedOption ? selectedOption.value : "")}
      isClearable
      isSearchable
      menuShouldScrollIntoView={false}
    />
  ));

  const employeeSelectStyles = {
    control: (base, state) => ({
      ...base,
      padding: "0.20rem 0.5rem",
      marginTop: "0.50rem",
      borderWidth: "1px",
      borderColor: state.isFocused ? "#fb923c" : "#f97316",
      borderRadius: "0.375rem",
      boxShadow: state.isFocused ? "0 0 0 2px rgba(251,146,60,0.5)" : "0 1px 2px rgba(0,0,0,0.05)",
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
    menu: (provided) => ({ ...provided, zIndex: 9999 }),
  };

  const propertyOptions = Array.isArray(propertyDetails?.data)
    ? propertyDetails.data.map((ele) => ({
        value: ele["Property Code"] || ele.code,
        label: ele["Property Code"] || ele.code,
      }))
    : [];

  const inputClass = 'w-full px-3 py-2 mt-1 border border-orange-500 rounded-md shadow focus:outline-none focus:ring-1 focus:ring-orange-400 focus:border-orange-400';

  // ===================== onSubmit =====================
  const onSubmit = async (data) => {
    const toastId = toast.loading("Saving data...");

    const payload = {
        Date: data.Date ? data.Date.toLocaleDateString("en-GB", { day: 'numeric', month: 'short', year: 'numeric' }) : "",
        Narration: data.Narration || "",
        "Chq.No./Ref.No.": data.ChqRefNo || "", 
        ValueDate: data.ValueDate ? data.ValueDate.toLocaleDateString("en-GB", { day: 'numeric', month: 'short', year: 'numeric' }) : "",
        "WithdrawalAmt.": data.WithdrawalAmt || "",
        "DepositAmt.": data.DepositAmt || "",
        PropertyExpenseCode: data.PropertyExpenseCode || "",
        ExpenseCategory: data.ExpenseCategory || "",
        UpdatedBy: data.UpdatedBy || "",
        UpdatedDate: data.UpdatedDate ? data.UpdatedDate.toLocaleDateString("en-GB", { day: 'numeric', month: 'short', year: 'numeric' }) : "",
        UpdateStatus: data.UpdateStatus || "",
        ReviewedBy: data.ReviewedBy || "",
        ReviewedDate: data.ReviewedDate ? data.ReviewedDate.toLocaleDateString("en-GB", { day: 'numeric', month: 'short', year: 'numeric' }) : "",
        CommentsByGPGS: data.CommentsByGPGS || "",
        AuditStatus: data.AuditStatus || "",
        CommentsByAuditTeam: data.CommentsByAuditTeam || "",
        };

    try {
      if (editingIndex !== null) {
        await updateTransactionMutation.mutateAsync({ ...payload, index: editingIndex });
        toast.dismiss(); 
        toast.success("Updated successfully");
      } else {
        await addTransactionMutation.mutateAsync(payload);
        toast.dismiss(); 
        toast.success("Created successfully");
      }

      reset();
      setEditingIndex(null);
      setActiveTab("LIST"); // redirect to list after submit
    } catch (err) {
      console.error(err);
      toast.dismiss();
      toast.error("Something went wrong!");
    } 
  };

  const handleEdit = (row, index) => {
    setEditingIndex(index);
    setActiveTab("CREATE");
    window.scrollTo({ top: 0, behavior: "smooth" });

    //mapping
    setValue("Date", row.Date ? new Date(row.Date) : null);
    setValue("Narration", row.Narration || "");
    setValue("ChqRefNo", row["Chq.No./Ref.No."] || "");
    setValue("ValueDate", row.ValueDate ? new Date(row.ValueDate) : null);
    setValue("WithdrawalAmt", row["WithdrawalAmt."] || "");
    setValue("DepositAmt", row["DepositAmt."] || "");
    setValue("PropertyExpenseCode", row.PropertyExpenseCode || "");
    setValue("ExpenseCategory", row.ExpenseCategory || "");
    setValue("UpdatedBy", row.UpdatedBy || "");
    setValue("UpdatedDate", row.UpdatedDate ? new Date(row.UpdatedDate) : null);
    setValue("UpdateStatus", row.UpdateStatus || "");
    setValue("ReviewedBy", row.ReviewedBy || "");
    setValue("ReviewedDate", row.ReviewedDate ? new Date(row.ReviewedDate) : null);
    setValue("CommentsByGPGS", row.CommentsByGPGS || "");
    setValue("AuditStatus", row.AuditStatus || "");
    setValue("CommentsByAuditTeam", row.CommentsByAuditTeam || "");
  };


  const handleDelete = async (index) => {
  if (!window.confirm("Are you sure you want to delete this row?")) return;
  
  const toastId = toast.loading("Deleting data...");
  try {
    await deleteTransactionMutation.mutateAsync({ index }); 
    toast.dismiss();
    toast.success("Data deleted successfully");
  } catch (err) {
    console.error(err);
    toast.dismiss();
    toast.error("Delete failed!");
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

const CellWithTooltip = ({ value }) => {
  const [show, setShow] = useState(false);

  return (
    <div
      className="relative w-full"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <div className="truncate overflow-hidden text-ellipsis cursor-pointer">
        {value ?? "-"}
      </div>

      {show && (
        <div className="absolute left-full ml-2 top-0 z-[9999] w-[300px] bg-white border border-gray-300 rounded-lg shadow-xl p-3 text-xs break-words">
          <pre className="whitespace-pre-wrap">{value ?? "-"}</pre>
        </div>
      )}
    </div>
  );
};


  return (
    
    <div className='h-screen w-screen bg-[#E5E7EB] flex flex-col py-24 overflow-hidden'>

    {/* ================= TOP TABS ================= */}
      <div className="bg-white rounded-t-lg border-b px-2 pt-2 flex gap-4">
        <button
          onClick={() => setActiveTab("LIST")}
          className={`flex items-center gap-2 px-4 py-2 font-medium rounded-t-md border-b-2
            ${activeTab === "LIST" ? "text-orange-600 border-orange-600 bg-orange-50" : "border-transparent hover:text-gray-700"}`}
        >
          <i className="fas fa-ticket-alt"></i>
          <span>All Info</span>
        </button>

        <button
          onClick={() => { reset(); setEditingIndex(null); setActiveTab("CREATE"); }}
          className={`flex items-center gap-2 px-4 py-2 font-medium rounded-t-md border-b-2
            ${activeTab === "CREATE" ? "text-orange-600 border-orange-600 bg-orange-50" : "border-transparent hover:text-gray-700"}`}
        >
          <i className="fas fa-plus-circle"></i>
          <span>{editingIndex !== null ? "Edit Bank Info" : "Create New"}</span>
        </button>
      </div>


      {/* ================= CREATE FORM ================= */}

      {activeTab === "CREATE" && (
        (propertyLoading ) ? (
          <TodoBankTransactionSkeleton type="form" />
        ) : (
          <form className="bg-white shadow-sm py-5 rounded-b-lg px-10 max-w-8xl w-full" onSubmit={handleSubmit(onSubmit)}>
            {/* Form Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5">
              {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date <span className="text-red-500">*</span>
            </label>
            <Controller
              name="Date"
              control={control}
              defaultValue={null}
              render={({ field }) => (
                <DatePicker
                  selected={field.value}
                  onChange={(date) => field.onChange(date)}
                  dateFormat="d MMM yyyy"
                  placeholderText="dd mm yyyy"
                  className={inputClass}
                  wrapperClassName="w-full"
                  isClearable
                />
              )}
            />
            {errors.Date && <p className="text-red-500 text-sm">{errors.Date.message}</p>}
          </div>

          {/* Narration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Narration <span className="text-red-500">*</span></label>
            <input type="text" {...register("Narration")} className={inputClass} placeholder='Naration'/>
            {errors.Narration && <p className="text-red-500 text-sm">{errors.Narration.message}</p>}
          </div>

          {/* Chq/Ref No */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Chq./Ref. No. <span className="text-red-500">*</span></label>
            <input type="number" {...register("ChqRefNo")} className={inputClass} placeholder='Chq./Ref. No.'/>
            {errors.ChqRefNo && <p className="text-red-500 text-sm">{errors.ChqRefNo.message}</p>}
          </div>

          {/* Value Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Value Date <span className="text-red-500">*</span>
            </label>
            <Controller
              name="ValueDate"
              control={control}
              defaultValue={null}
              render={({ field }) => (
                <DatePicker
                  selected={field.value}
                  onChange={(date) => field.onChange(date)}
                  dateFormat="d MMM yyyy"
                  placeholderText="dd mm yyyy"
                  className={inputClass}
                  wrapperClassName="w-full"
                  isClearable
                />
              )}
            />
            {errors.ValueDate && <p className="text-red-500 text-sm">{errors.ValueDate.message}</p>}
          </div>

          {/* Withdrawal Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Withdrawal Amount </label>
            <input type="number" step="0.0001" {...register("WithdrawalAmt")} className={inputClass} placeholder='Withdrawal Amount'/>
            {/* {errors.WithdrawalAmt && <p className="text-red-500 text-sm">{errors.WithdrawalAmt.message}</p>} */}
          </div>

          {/* Deposit Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deposit Amount <span className="text-red-500">*</span></label>
            <input type="number" step="0.0001" {...register("DepositAmt")} className={inputClass} placeholder='Deposit Amount'/>
            {errors.DepositAmt && <p className="text-red-500 text-sm">{errors.DepositAmt.message}</p>}
          </div>

          {/* Property Expense Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Property Expense Code <span className="text-red-500">*</span>
            </label>
            <Controller
              name="PropertyExpenseCode"
              control={control}
              defaultValue={null}
              render={({ field }) => (
                <MemoizedSelect
                  field={field}
                  options={propertyOptions}
                  placeholder="Search & Select"
                  styles={employeeSelectStyles}
                  onChange={field.onChange}
                  
                />
              )}
            />
            {errors.PropertyExpenseCode && <p className="text-red-500 text-sm">{errors.PropertyExpenseCode.message}</p>}
          </div>

          {/* Expense Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Expense Category <span className="text-red-500">*</span></label>
            <input type="text" {...register("ExpenseCategory")} className={inputClass} placeholder='Expense Category'/>
            {errors.ExpenseCategory && <p className="text-red-500 text-sm">{errors.ExpenseCategory.message}</p>}
          </div>

          {/* Fields */}

          {[
            { name: "UpdatedBy", label: "Updated By" },
            { name: "UpdatedDate", label: "Updated Date" },
            { name: "UpdateStatus", label: "Update Status" },
            { name: "ReviewedBy", label: "Reviewed By" },
            { name: "ReviewedDate", label: "Reviewed Date" },
            { name: "CommentsByGPGS", label: "Comments By GPGS" },
            { name: "AuditStatus", label: "Audit Status" },
            { name: "CommentsByAuditTeam", label: "Comments By Audit Team" },
            ].map((field) => (
            <div key={field.name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}{["CommentsByGPGS","CommentsByAuditTeam", "AuditStatus"].includes(field.name) ? "" : ( <span className="text-red-500">*</span> )}
                </label>

                <Controller
                name={field.name}
                control={control}
                defaultValue={
                    field.name.includes("Date") ? null : "" 
                }
                render={({ field: controllerField }) => {
                    if (field.name.toLowerCase().includes("comments")) {
                    // Textarea for Comments fields
                    return (
                        <textarea
                        {...controllerField}
                        rows={4}
                        placeholder={`Enter ${field.label}`}
                        className="w-full h-[50px] border border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300 rounded-md px-3 py-2"
                        />
                    );
                    } else if (field.name.includes("Date")) {
                    // DatePicker for Date fields
                    return (
                        <DatePicker
                        selected={controllerField.value}
                        onChange={(date) => controllerField.onChange(date)}
                        dateFormat="d MMM yyyy"
                        placeholderText="dd mm yyyy"
                        className={inputClass}
                        wrapperClassName="w-full"
                        isClearable
                        />
                    );
                    } else {
                    // Normal text input
                    return <input type="text" {...controllerField} className={inputClass} placeholder={` ${field.label} `} />;
                    }
                }}
                />

                {errors[field.name] && (
                <p className="text-red-500 text-sm mt-1">
                    {errors[field.name]?.message}
                </p>
                )}
            </div>
            ))}
            </div>

            {/* Submit & Cancel */}

            <div className="mt-6 flex justify-center gap-4">
              <button type="submit" className="px-6 py-2 bg-orange-300 hover:bg-orange-400 rounded font-semibold">
                {editingIndex !== null ? "Update" : "Submit"}
              </button>
              <button type="button" onClick={() => { reset(); setActiveTab("LIST"); setEditingIndex(null); }} className="px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded font-semibold">
                Cancel
              </button>
            </div>
          </form>
        )
      )}

      <div className="bg-white shadow-sm px-2 pt-2 rounded-b-lg">
        {/* ================= Bank Transition TABLE SHOW ================= */}
        {activeTab === "LIST" && (
          bankLoading ? (
            <TodoBankTransactionSkeleton type="table" />
          ) : BankTransaction?.data?.length > 0 ? (
            <div className="overflow-auto max-h-[calc(100vh-12rem)] border border-gray-200 rounded-lg">
              <table className="min-w-[1200px] border-collapse text-sm text-left text-gray-700 table-fixed">
                <thead className="sticky top-0 bg-orange-300 z-[100] shadow-md font-bold text-gray-800 text-base">
              <tr>
                {Object.keys(BankTransaction.data[0]).map((key) => (
                  <th
                    key={key}
                    className={`px-3 py-3 text-left border-b font-bold border-gray-300 whitespace-nowrap
                      ${key === "index" ? "sticky z-40 bg-orange-300" : ""}
                      ${key === "Date" ? "sticky z-40 bg-orange-300" : ""}
                    `}
                    style={{
                      width: getColumnWidth(key),
                      left:
                        key === "index"
                          ? 0
                          : key === "Date"
                          ? SR_NO_WIDTH
                          : undefined,
                    }}
                  >
                    {key === "index" ? "Sr.No" : key}
                  </th>
                ))}

                <th
                  className="px-4 py-3 font-bold text-black sticky right-0 z-[120] bg-orange-300"
                  style={{ width: ACTION_COL_WIDTH }}
                >
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 text-[15px]">
              {BankTransaction.data.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-100">
                  {Object.keys(BankTransaction.data[0]).map((key) => (
                    <td
                      key={key}
                      className={`px-3 py-3 whitespace-nowrap
                        ${key === "index" ? "sticky bg-orange-300 z-20 font-bold" : ""}
                        ${key === "Date" ? "sticky bg-orange-300 z-20 font-bold" : ""}
                      `}
                      style={{
                        width: getColumnWidth(key),
                        maxWidth: getColumnWidth(key),
                        left:
                          key === "index"
                            ? 0
                            : key === "Date"
                            ? SR_NO_WIDTH
                            : undefined,
                      }}
                    >
                      <CellWithTooltip
                        value={key === "index" ? idx + 1 : row[key]}
                      />
                    </td>
                  ))}

                  {/* Action Column */}
                  <td
                    className="px-2 py-2 sticky right-0 bg-white z-[60]"
                    style={{ width: ACTION_COL_WIDTH }}
                  >
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleEdit(row, idx)}
                        className="text-orange-500 hover:text-orange-700"
                        title="Edit"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(idx)}
                        className="text-orange-500 hover:text-orange-700"
                        title="Delete"
                      >
                        {/* <i className="fa-solid fa-trash"></i> */}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center py-10 text-gray-500">No data available</p>
          )
        )}
        
      </div>
    </div>
  );
}