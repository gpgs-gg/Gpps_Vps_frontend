import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import { toast } from "react-toastify";
import { useApp } from "../TicketSystem/AppProvider";
import LoaderPage from "../NewBooking/LoaderPage";
import {
  useUpdateEbCalculationRow,
  useCreateEbCalculationRow,
  useReviewerOptions,
  usePropertyCodes,
} from "./services/index";
import { SelectStyles } from "../../Config";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

/**
 * Create / Update EB Calculation Modal
 */
export const CreateAndEdit = ({
  editingRow,
  sheetName,
  existingPropertyCodes = [], // Property codes already present in EB table
  onClose,
  onSuccess,
}) => {
  /* ======================================================
     HOOKS & DATA
  ====================================================== */
  const { decryptedUser } = useApp();
  const LOGGED_IN_USER = `${decryptedUser?.name}` || "Unknow User";
  const { data: reviewerOptions = [], isLoading: reviewersLoading } =
    useReviewerOptions();

  // console.log("all property codes from table : ", existingPropertyCodes);

  const { data: propertyCodes = [], isLoading } = usePropertyCodes();
  // console.log("all propertycode from master table ", propertyCodes);

  const updateMutation = useUpdateEbCalculationRow();
  const createMutation = useCreateEbCalculationRow();

  //const [selectedMonth, setSelectedMonth] = useState(null);

  //console.log(reviewerOptions);
  /* ======================================================
     FORM SETUP
  ====================================================== */
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      PropertyCode: "",
      SubMeterDetails: "",
      Assignee: null,
      EBCalnDate: "",
      EBPaidStatus: null,
      EBCalnStatus: null,
      Reviewer: null,
      FlatEB: "",
      FlatUnits: "",
      WorkLogs: "",
    },
  });

  /* ======================================================
     EDIT MODE – PREFILL FORM
  ====================================================== */
  useEffect(() => {
    if (editingRow) {
      reset({
        PropertyCode: editingRow.PropertyCode || "",
        SubMeterDetails: editingRow.SubMeterDetails || "",
        Assignee: editingRow.Assignee
          ? { value: editingRow.Assignee, label: editingRow.Assignee }
          : null,

        FlatEB: editingRow.FlatEB || "",
        FlatUnits: editingRow.FlatUnits || "",

        EBCalnDate: editingRow.EBCalnDate || "",
        EBPaidStatus: {
          value: editingRow.EBPaidStatus,
          label: editingRow.EBPaidStatus,
        },
        EBCalnStatus: {
          value: editingRow.EBCalnStatus,
          label: editingRow.EBCalnStatus,
        },
        Reviewer: { value: editingRow.Reviewer, label: editingRow.Reviewer },
        WorkLogHistory: editingRow.WorkLogs || "",
      });
    } else {
      reset({
        PropertyCode: "",
        SubMeterDetails: "",
        Assignee: null,
        EBCalnDate: "",
        EBPaidStatus: null,
        EBCalnStatus: null,
        Reviewer: null,
        FlatEB: "",
        FlatUnits: "",
        WorkLogs: "",
      });
    }
  }, [editingRow, reset]);

  //  all properties
  useEffect(() => {
    //  console.log("from master table", propertyCodes);
  }, [propertyCodes]);

  // const allpropertyCodeOptionsfrommastertable = propertyCodes.map((code) => ({
  //   value: code,
  //   label: code,
  // }));

  const normalize = (v = "") => v.trim().toUpperCase();

  const normalizedExistingCodes = existingPropertyCodes.map(normalize);

  const propertyCodeOptions = editingRow
    ? propertyCodes.map((code) => ({
        value: code,
        label: code,
      }))
    : propertyCodes
        .filter((code) => !normalizedExistingCodes.includes(normalize(code)))
        .map((code) => ({
          value: code,
          label: code,
        }));
  // console.log("from master table", allpropertyCodeOptionsfrommastertable);
  // console.log(
  //   "propertycode not in existing table but in master table : ",
  //   propertyCodeOptions
  // );
  // console.log("existing property code in table", existingPropertyCodes);

  const assigneeOptions = reviewerOptions;

  const paidOptions = [
    { value: "Paid", label: "Paid" },
    { value: "Not Paid", label: "Not Paid" },
  ];

  const statusOptions = [
    { value: "Done", label: "Done" },
    { value: "Not Done", label: "Not Done" },
  ];

  // format work log date time and user
  const formatLogDateTime = (date = new Date()) => {
    return date
      .toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
      .replace(",", "");
  };

  const buildWorkLogEntry = ({ user, message }) => {
    return `[${formatLogDateTime()} - ${user}] ${message}`;
  };

  const buildAuditEntry = () => `${LOGGED_IN_USER} | ${formatLogDateTime()}`;
  const buildUpdatedByEntry = (message = "") => {
    return `[${formatLogDateTime()} - ${LOGGED_IN_USER}] ${message}`;
  };

  // status change log

  const buildStatusChangeLog = ({ field, from, to }) => {
    if (!from || !to || from === to) return "";

    return `[${formatLogDateTime()} - ${LOGGED_IN_USER}] ${field} changed from ${from} to ${to}`;
  };

  const onSubmit = async (formData) => {
    try {
      if (!sheetName) {
        toast.warn("Please select a valid month before saving.");
        return;
      }

      /* ==================================================
       🚫 DUPLICATE PROPERTY CHECK (
    ================================================== */

      const selectedPropertyCode =
        typeof formData.PropertyCode === "string"
          ? formData.PropertyCode
          : formData.PropertyCode?.value;

      // Only block while CREATING (not editing)
      const normalize = (v = "") => v.trim().toUpperCase();
      if (!editingRow) {
        const normalizedSelected = normalize(selectedPropertyCode);
        const alreadyExists = existingPropertyCodes
          .map(normalize)
          .includes(normalizedSelected);

        if (alreadyExists) {
          toast.error("Property already exists. ❌");
          return; // ⛔ STOP HERE
        }
      }
      // worklog, updatedby and autolog intialization
      let finalWorkLogs = editingRow?.WorkLogs || "";
      let finalUpdatedBy = editingRow?.UpdatedBy || "";
      let autoLogs = [];

      // ✅ AUTO: EB Paid Status change
      if (
        editingRow &&
        editingRow.EBPaidStatus !== formData.EBPaidStatus?.value
      ) {
        autoLogs.push(
          buildStatusChangeLog({
            field: "EB Paid Status",
            from: editingRow.EBPaidStatus,
            to: formData.EBPaidStatus?.value,
          })
        );
      }

      // ✅ AUTO: EB Calculation Status change
      if (
        editingRow &&
        editingRow.EBCalnStatus !== formData.EBCalnStatus?.value
      ) {
        autoLogs.push(
          buildStatusChangeLog({
            field: "EB Calculation Status",
            from: editingRow.EBCalnStatus,
            to: formData.EBCalnStatus?.value,
          })
        );
      }

      if (editingRow) {
        const newEntry = buildUpdatedByEntry();
        finalUpdatedBy = finalUpdatedBy
          ? `${finalUpdatedBy}\n${newEntry}`
          : newEntry;
      }

      // ✅ MANUAL WorkLog
      if (editingRow && formData.WorkLogs?.trim()) {
        autoLogs.push(
          buildWorkLogEntry({
            user: LOGGED_IN_USER,
            message: formData.WorkLogs.trim(),
          })
        );
      }

      // ✅ Combine all logs
      if (autoLogs.length > 0) {
        finalWorkLogs = finalWorkLogs
          ? `${autoLogs.join("\n")}\n\n${finalWorkLogs}`
          : autoLogs.join("\n");
      }

      const payload = {
        sheetName,
        updates: [
          {
            rowIndex: editingRow?.rowIndex,
            columns: [
              {
                columnName: "PropertyCode",
                value:
                  typeof formData.PropertyCode === "string"
                    ? formData.PropertyCode
                    : formData.PropertyCode?.value || "",
              },
              {
                columnName: "SubMeterDetails",
                value: formData.SubMeterDetails,
              },
              { columnName: "Assignee", value: formData.Assignee?.value || "" },
              { columnName: "EBCalnDate", value: formData.EBCalnDate },
              {
                columnName: "EBPaidStatus",
                value: formData.EBPaidStatus?.value || "",
              },
              {
                columnName: "EBCalnStatus",
                value: formData.EBCalnStatus?.value || "",
              },
              { columnName: "FlatEB", value: formData.FlatEB || "" },
              { columnName: "FlatUnits", value: formData.FlatUnits || "" },
              { columnName: "Reviewer", value: formData.Reviewer?.value || "" },

              { columnName: "WorkLogs", value: finalWorkLogs },
              { columnName: "UpdatedBy", value: finalUpdatedBy },
            ],
          },
        ],
      };

      if (editingRow) {
        await updateMutation.mutateAsync(payload);
        //  console.log("updating record : ", payload);
        toast.success("EB record updated ✅");
      } else {
        payload.updates[0].columns.push({
          columnName: "CreatedBy",
          value: buildAuditEntry(),
        });

        await createMutation.mutateAsync(payload);
        console.log("creating record : ", payload);
        toast.success("EB record created ✅");
      }

      onSuccess?.();
      onClose?.();
    } catch (err) {
      //  console.error(err);
      toast.error("Operation failed ❌");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-[180]  ">
      <div className="bg-white w-[900px] rounded-2xl shadow-2xl overflow-hidden mt-16">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 btext-white">
          <h2 className="font-semibold text-lg">
            {editingRow ? "Update EB Info" : "Add New Property"}
          </h2>
          <button
            onClick={onClose}
            className="text-xl font-bold hover:scale-110 transition-transform"
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {/* First Row - Property Code & SubMeterDetails */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Property Code
              </label>
              {editingRow ? (
                <input
                  type="text"
                  value={editingRow.PropertyCode || ""}
                  disabled
                  placeholder={
                    propertyCodeOptions.length === 0
                      ? "No new properties available"
                      : "Select Property"
                  }
                  className="w-full bg-gray-100 border-2 border-orange-300 rounded-md px-3 py-2 cursor-not-allowed"
                />
              ) : (
                <Controller
                  control={control}
                  name="PropertyCode"
                  rules={{ required: "Property Code is required" }}
                  render={({ field, fieldState: { error } }) => (
                    <>
                      <Select
                        options={propertyCodeOptions}
                        styles={SelectStyles}
                        isLoading={isLoading}
                        isClearable
                        placeholder={
                          isLoading ? (
                            <LoaderPage size="small" inline />
                          ) : (
                            "Select Property"
                          )
                        }
                        value={
                          propertyCodeOptions.find(
                            (opt) => opt.value === field.value
                          ) || null
                        }
                        onChange={(selected) =>
                          field.onChange(selected ? selected.value : "")
                        }
                      />
                      {error && (
                        <p className="text-red-500 text-sm mt-1">
                          <LoaderPage />
                          {error.message}
                        </p>
                      )}
                    </>
                  )}
                />
              )}
            </div>

            {/* assigne */}
            <div className="">
              <label className="block text-sm font-medium text-black mb-2">
                Assignee
              </label>
              <Controller
                control={control}
                name="Assignee"
                render={({ field }) => (
                  <Select
                    options={assigneeOptions}
                    styles={SelectStyles}
                    isClearable
                    placeholder="Select Assignee"
                    value={
                      assigneeOptions.find(
                        (opt) => opt.value === field.value?.value
                      ) || null
                    }
                    onChange={(selected) => field.onChange(selected)}
                  />
                )}
              />
            </div>
            {/* reviewer */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Reviewer
              </label>
              <Controller
                control={control}
                name="Reviewer"
                render={({ field }) => (
                  <Select
                    {...field}
                    options={reviewerOptions}
                    styles={SelectStyles}
                    isLoading={reviewersLoading}
                    isClearable
                    placeholder={
                      reviewersLoading
                        ? "Loading reviewers..."
                        : "Select Reviewer"
                    }
                  />
                )}
              />
            </div>
          </div>

          {/* Second Row - Assignee & EB Calculation Date */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/*  date  */}
            <div className="">
              <label className="block text-sm font-medium text-black mb-2">
                EB Calculation Date
              </label>

              <Controller
                control={control}
                name="EBCalnDate"
                render={({ field }) => (
                  <DatePicker
                    selected={field.value ? new Date(field.value) : null}
                    onChange={(date) =>
                      field.onChange(
                        date ? date.toISOString().split("T")[0] : ""
                      )
                    }
                    dateFormat="d MMM yyyy"
                    placeholderText="Select date"
                    isClearable
                    wrapperClassName="w-full"
                    className="w-full border-2 border-orange-300 rounded-md px-3 py-2
                   focus:outline-none focus:ring-2 focus:ring-orange-300"
                  />
                )}
              />
            </div>
            {/* flab EB paid  */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Flat EB Paid
              </label>
              <Controller
                control={control}
                name="EBPaidStatus"
                render={({ field }) => (
                  <Select
                    {...field}
                    options={paidOptions}
                    styles={SelectStyles}
                    isClearable
                    placeholder="Select"
                  />
                )}
              />
            </div>
            {/* eb calculation status */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                EB Calculation Status
              </label>
              <Controller
                control={control}
                name="EBCalnStatus"
                render={({ field }) => (
                  <Select
                    {...field}
                    options={statusOptions}
                    styles={SelectStyles}
                    isClearable
                    placeholder="Select"
                  />
                )}
              />
            </div>
          </div>

          {/* Third Row - Flat EB Paid & EB Calculation Status */}
          {/* NEW ROW - Flat EB & Flat Units */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Flat EB */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Flat EB
              </label>
              <Controller
                control={control}
                name="FlatEB"
                // rules={{ required: "Flat EB is required" }}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <input
                      type="number"
                      {...field}
                      placeholder="Enter Flat EB"
                      className="w-full border-2 border-orange-300 rounded-md px-3 py-2
            focus:outline-none focus:ring-2 focus:ring-orange-300"
                    />
                    {error && (
                      <p className="text-red-500 text-sm mt-1">
                        {error.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>

            {/* Flat Units */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Flat Units
              </label>
              <Controller
                control={control}
                name="FlatUnits"
                // rules={{ required: "Flat Units is required" }}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <input
                      type="number"
                      {...field}
                      placeholder="Enter Flat Units"
                      className="w-full border-2 border-orange-300 rounded-md px-3 py-2
            focus:outline-none focus:ring-2 focus:ring-orange-300"
                    />
                    {error && (
                      <p className="text-red-500 text-sm mt-1">
                        {error.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>
            {/* sub meter details */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Sub Meter Details
              </label>
              <Controller
                control={control}
                name="SubMeterDetails"
                render={({ field }) => (
                  <textarea
                    {...field}
                    placeholder="Enter sub meter details"
                    className="w-full  border-2 border-orange-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300"
                    // disabled={editingRow} // Disable when editing
                  />
                )}
              />
            </div>
          </div>

          {/* Fourth Row - Reviewer & Work Logs */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 ">
            {/* work logs */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Work Logs
              </label>
              <Controller
                control={control}
                name="WorkLogHistory"
                render={({ field }) => (
                  <textarea
                    {...field}
                    disabled
                    rows={2}
                    placeholder=""
                    className="w-full   rounded-md px-3 py-2 "
                  />
                )}
              />
            </div>

            {/* work logs */}
            <div className="mt-7">
              <Controller
                control={control}
                name="WorkLogs"
                render={({ field }) => (
                  <textarea
                    {...field}
                    rows={2}
                    placeholder="Add work log entries here..."
                    className="w-full  border-2 border-orange-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300"
                  />
                )}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 justify-end pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-black rounded hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            {/* submit button */}
            <button
              type="submit"
              disabled={
                isSubmitting ||
                updateMutation.isPending ||
                createMutation.isPending
              }
              className="px-5 py-2 min-w-[130px] rounded text-white bg-orange-500
             hover:bg-orange-600 disabled:bg-orange-300
             flex items-center justify-center gap-2"
            >
              {updateMutation.isPending || createMutation.isPending ? (
                <>
                  <LoaderPage size="small" inline />
                  <span>{editingRow ? "Updating..." : "Creating..."}</span>
                </>
              ) : (
                <span>{editingRow ? "Update" : "Create"}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};