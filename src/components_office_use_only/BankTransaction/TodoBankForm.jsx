import React, { memo, useEffect } from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import LoaderPage from "../NewBooking/LoaderPage";
import { Controller } from "react-hook-form";

const TodoBankForm = ({
  control,
  register,
  errors,
  handleSubmit,
  watch,
  editingRow,
  propertyOptions,
  expenseCategoryOptions,
  StatusOptions,
  reviewerOptions,
  AuditorOptions,
  isUpdatingData,
  selectedStatus,
  onSubmit,
  reset,
  setActiveTab,
  setEditingRow,
  goToNext,
  goToPrevious,
  currentIndex,
  totalLength,
  data 
}) => {

  const MemoizedSelect = memo(({ field, options, placeholder, isDisabled, onChange, styles }) => (
    <div className={isDisabled ? "cursor-not-allowed" : "cursor-pointer"}>
      <Select
        {...field}
        value={
          field.value
            ? options?.find((opt) => opt.value === field.value)
            : null
        }
        isDisabled={isDisabled}
        options={options}
        placeholder={placeholder}
        styles={styles}
        onChange={(selectedOption) => onChange(selectedOption ? selectedOption.value : "")}
        isClearable
        isSearchable
        menuShouldScrollIntoView={false}
      />
    </div>
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
      backgroundColor: state.isDisabled ? "#f5f5f5" : "white",
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

  const inputClass = 'w-full px-3  py-2 mt-1 border border-orange-500 rounded-md shadow focus:outline-none focus:ring-1 focus:ring-orange-400 focus:border-orange-400 disabled:cursor-not-allowed';

  useEffect(() => {
    if (editingRow) {
      reset(editingRow);
    }
  }, [editingRow, reset, data]);

  const parseDBDate = (dateStr) => {
    if (!dateStr) return null;

    const [dd, mm, yy] = dateStr.split("/");
    const year = Number(yy) < 50 ? `20${yy}` : `19${yy}`;

    return new Date(`${year}-${mm}-${dd}`);
  };




  return (
    <div className="overflow-auto border border-gray-200 rounded-lg">
      <div className="flex justify-end items-center p-2 gap-5 pr-5">
        <span className="text-sm text-gray-700">
          Sr. No.{currentIndex + 1}
        </span>
        <button
          onClick={goToPrevious}
          disabled={currentIndex === 0}
          className="px-3 py-1 bg-orange-400 text-white rounded disabled:opacity-50 hover:bg-orange-500 transition-colors"
        ><i className="fa-solid fa-arrow-left"></i> {" "}
          Previous
        </button>

        <button
          onClick={goToNext}
          disabled={currentIndex === totalLength - 1}
          className="px-3 py-1 bg-orange-400 text-white rounded disabled:opacity-50 hover:bg-orange-500 transition-colors"
        >
          Next <i className="fa-solid fa-arrow-right"></i>
        </button>
      </div>




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
                  selected={
                    typeof field.value === "string"
                      ? parseDBDate(field.value)
                      : field.value
                  }
                  onChange={(date) => field.onChange(date)}
                  dateFormat="d MMM yyyy"
                  placeholderText="dd mm yyyy"
                  className={inputClass}
                  wrapperClassName="w-full"
                  disabled={editingRow}
                />
              )}
            />
            {errors.Date && <p className="text-red-500 text-sm">{errors.Date.message}</p>}
          </div>

          {/* Withdrawal Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Withdrawal Amount </label>
            <input type="number" step="0.0001" {...register("WithdrawalAmt")} className={inputClass} placeholder='Withdrawal Amount' disabled={editingRow} />
            {/* {errors.WithdrawalAmt && <p className="text-red-500 text-sm">{errors.WithdrawalAmt.message}</p>} */}
          </div>

          {/* Deposit Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deposit Amount</label>
            <input type="number" step="0.0001" {...register("DepositAmt")} className={inputClass} placeholder='Deposit Amount' disabled={editingRow} />
            {/* {errors.DepositAmt && <p className="text-red-500 text-sm">{errors.DepositAmt.message}</p>} */}
          </div>

          {/* Narration */}
          <div className='col-span-1 md:col-span-2 lg:col-span-2'>
            <label className="block text-sm font-medium text-gray-700 mb-1">Narration <span className="text-red-500">*</span></label>
            <textarea type="text" {...register("Narration")} className={inputClass} placeholder='Naration' disabled={editingRow} />
            {errors.Narration && <p className="text-red-500 text-sm">{errors.Narration.message}</p>}
          </div>

          {/* Property Expense Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Property / Expense Code <span className="text-red-500">*</span>
            </label>
            <Controller
              name="PropertyExpenseCode"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <MemoizedSelect
                  field={field}
                  options={propertyOptions}
                  placeholder="Search & Select"
                  styles={employeeSelectStyles}
                  onChange={field.onChange}
                  menuPortalTarget={document.body}
                  menuPosition="fixed"
                />
              )}
            />
            {errors.PropertyExpenseCode && <p className="text-red-500 text-sm">{errors.PropertyExpenseCode.message}</p>}
          </div>

          {/* Expense Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Expense Category <span className="text-red-500">*</span></label>
            <Controller
              name="ExpenseCategory"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <MemoizedSelect
                  field={field}
                  options={expenseCategoryOptions}
                  placeholder="Search & Select"
                  styles={employeeSelectStyles}
                  onChange={field.onChange}
                  menuPortalTarget={document.body}
                  menuPosition="fixed"
                />
              )}
            />
            {errors.ExpenseCategory && <p className="text-red-500 text-sm">{errors.ExpenseCategory.message}</p>}
          </div>


          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status <span className="text-red-500">*</span></label>
            <Controller
              name="StatusForView"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <MemoizedSelect
                  field={field}
                  options={StatusOptions}
                  placeholder="Search & Select"
                  styles={employeeSelectStyles}
                  onChange={field.onChange}
                  menuPortalTarget={document.body}
                  menuPosition="fixed"
                />
              )}
            />
            {errors.StatusForView && <p className="text-red-500 text-sm">{errors.StatusForView.message}</p>}
          </div>

          {/* Chq/Ref No */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Chq./Ref. No. <span className="text-red-500">*</span></label>
            <input type="text" {...register("ChqRefNo")} className={inputClass} placeholder='Chq./Ref. No.' disabled={editingRow} />
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
                  selected={
                    typeof field.value === "string"
                      ? parseDBDate(field.value)
                      : field.value
                  }
                  onChange={(date) => field.onChange(date)}
                  dateFormat="d MMM yyyy"
                  placeholderText="dd mm yyyy"
                  className={inputClass}
                  wrapperClassName="w-full"
                  disabled={editingRow}
                />
              )}
            />
            {errors.ValueDate && <p className="text-red-500 text-sm">{errors.ValueDate.message}</p>}
          </div>

          {/* Assignee */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assignee
            </label>
            <Controller
              name="Assignee"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <MemoizedSelect
                  field={field}
                  isDisabled={true}
                  options={reviewerOptions}
                  className="cursor-not-allowed pointer-events-none"
                  placeholder="Search & Select"
                  styles={employeeSelectStyles}
                  onChange={field.onChange}
                  menuPortalTarget={document.body}
                  menuPosition="fixed"
                />
              )}
            />
            {/* {errors.Assignee && <p className="text-red-500 text-sm">{errors.Assignee.message}</p>} */}
          </div>

          {/* Reviewer */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reviewer
            </label>
            <Controller
              name="Reviewer"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <MemoizedSelect
                  field={field}
                  isDisabled={true}
                  options={reviewerOptions}
                  placeholder="Search & Select"
                  styles={employeeSelectStyles}
                  onChange={field.onChange}
                  menuPortalTarget={document.body}
                  menuPosition="fixed"
                />
              )}
            />
            {/* {errors.Reviewer && (<p className="text-red-500 text-sm mt-1">{errors.Reviewer?.message}</p>)} */}
          </div>

          {/* Auditor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Auditor
            </label>
            <Controller
              name="Auditor"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <MemoizedSelect
                  field={field}
                  isDisabled={true}
                  options={AuditorOptions}
                  placeholder="Search & Select"
                  styles={employeeSelectStyles}
                  onChange={field.onChange}
                  menuPortalTarget={document.body}
                  menuPosition="fixed"
                />
              )}
            />
            {/* {errors.Auditor && (<p className="text-red-500 text-sm mt-1"> {errors.Auditor?.message}</p>)} */}
          </div>

          {/* Comment */}
          <div className='col-span-1 md:col-span-2 lg:col-span-2'>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Comment
              {(selectedStatus === "RoadBlock" || selectedStatus === "Re-Open") && (
                <span className="text-red-500"> *</span>
              )}
            </label>
            <input type="text" {...register("Comment")} className={inputClass} placeholder='Comment' />
            {errors.Comment && <p className="text-red-500 text-sm">{errors.Comment.message}</p>}
          </div>

          {/* Worklogs */}
          <div className='col-span-1 md:col-span-3 lg:col-span-3'>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Worklogs
            </label>
            <Controller
              name="Worklogs"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <div className="w-full h-[180px] border border-orange-500 rounded-md px-3 py-2 overflow-auto bg-gray-50 cursor-not-allowed">
                  {field.value ? (
                    field.value.split("\n").map((line, i) => {
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
                            fontSize: "16px",
                          }}
                        >
                          {line}
                        </div>
                      );
                    })
                  ) : (
                    <span className="text-gray-400">No Worklogs</span>
                  )}
                </div>
              )}
            />
          </div>

          {/* Update and Cancel Button */}

          <div className="  flex  items-center gap-4 col-span-1 ">
            <button
              type="submit"
              disabled={isUpdatingData}
              className={`px-6 h-10 rounded font-semibold flex items-center justify-center gap-2
                  ${isUpdatingData
                  ? "bg-orange-300 cursor-not-allowed"
                  : "bg-orange-500 hover:bg-orange-600 text-white"
                }`}
            >
              {isUpdatingData ? (
                <>
                  <LoaderPage />
                  <span>Updating...</span>
                </>
              ) : (
                "Update"
              )}
            </button>

            <button type="button"  onClick={() => { reset(); setActiveTab("LIST"); setEditingRow(null); }} className="px-6 py-2 h-10 bg-gray-200 hover:bg-gray-300 rounded font-semibold">
              Cancel
            </button>
          </div>

        </div>
      </form>

    </div>
  );
};

export default TodoBankForm;