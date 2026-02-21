import { useMemo, useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { pdfjs } from "react-pdf";
import Select from "react-select";
import { toast } from "react-toastify";
import { useApp } from "../TicketSystem/AppProvider";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import LoaderPage from "../NewBooking/LoaderPage";
import {
  useUpdateEbCalculationRow,
  useCreateEbCalculationRow,
  useReviewerOptions,
  useDynamicValuesEBStatuses,
  usePropertyCodes,
} from "./services/index";
import { SelectStyles } from "../../Config";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

export const CreateAndEdit = ({
  editingRow,
  sheetName,
  existingPropertyCodes = [],
  onClose,
  onSuccess,
}) => {
  /* ======================================================
     HOOKS & DATA
  ====================================================== */
  const [files, setFiles] = useState([]);
  const [existingAttachments, setExistingAttachments] = useState([]);
  // console.log(11111111, files);
  const { decryptedUser } = useApp();
  const LOGGED_IN_USER = `${decryptedUser?.employee?.Name}` || "Unknow User";
  const { data: reviewerOptions = [], isLoading: reviewersLoading } =
    useReviewerOptions();
  const { data: ebStatuses } = useDynamicValuesEBStatuses();

  //console.log("all property codes from table : ", existingPropertyCodes);

  const { data: propertyCodes = [], isLoading } = usePropertyCodes();

  //console.log("all propertycode from master table ", propertyCodes);

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
    watch,
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
      Attachment: [],
    },
  });

  //  for updating images

  //  api data int selector options for ebpaid and ebcalculation status
  const watchedEBPaidStatus = watch("EBPaidStatus");
  const ebPaidOptions = useMemo(() => {
    const list = ebStatuses?.ebPaidStatus ?? [];
    return list.map((status) => ({
      value: status,
      label: status,
    }));
  }, [ebStatuses]);
  // console.log(ebStatuses, 111111111111);
  const ebCalculationStatusOptions = useMemo(() => {
    const list =
      watch("EBPaidStatus")?.value === "Paid"
        ? ebStatuses?.ebCalculationStatusPaid
        : (ebStatuses?.ebCalculationStatus ?? []);
    return list?.map((status) => ({
      value: status,
      label: status,
    }));
  }, [ebStatuses, watchedEBPaidStatus]);
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
      // ✅ LOAD EXISTING ATTACHMENTS
      if (editingRow.Attachments) {
        setExistingAttachments(
          editingRow.Attachments.split(",").map((url) => ({
            url,
            name: url.split("/").pop(),
            existing: true,
          })),
        );
      }
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
      setExistingAttachments([]);
    }
  }, [editingRow, reset]);

  //  all properties
  useEffect(() => {
    //  console.log("from master table", propertyCodes);
  }, [propertyCodes]);

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
  //console.log("property code options : ", propertyCodeOptions);
  const assigneeOptions = reviewerOptions;

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
      .replace(",", "")
      .replace(",", "")
      .replace(/\bam\b/, "AM")
      .replace(/\bpm\b/, "PM");
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
          }),
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
          }),
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
          }),
        );
      }

      // ✅ Combine all logs
      if (autoLogs.length > 0) {
        finalWorkLogs = finalWorkLogs
          ? `${autoLogs.join("\n")}\n\n${finalWorkLogs}`
          : autoLogs.join("\n");
      }
      // 🚨 Attachment validation for Approved / Closed status
      const ebCalStatus = formData.EBCalnStatus?.value;

      const hasExistingAttachments = existingAttachments.length > 0;
      const hasNewFiles = files.length > 0;

      if (
        ["Approved", "Closed"].includes(ebCalStatus) &&
        !hasExistingAttachments &&
        !hasNewFiles
      ) {
        toast.error(
          "Attachment is mandatory when EB Calculation Status is Approved or Closed ",
        );
        return; // ⛔ STOP SUBMIT
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
      const multipartData = new FormData();

      multipartData.append("updates", JSON.stringify(payload.updates));
      multipartData.append("propertyCode", selectedPropertyCode);

      // 1️⃣ Old attachment URLs
      const oldUrls = existingAttachments.map((f) => f.url);
      console.log("oldurl of image : ", oldUrls);

      // 2️⃣ Append new files
      files.forEach((file) => {
        multipartData.append("files", file);
      });

      // 3️⃣ Send old URLs to backend
      multipartData.append("existingAttachments", JSON.stringify(oldUrls));
      console.log("multipartData : ", multipartData);

      if (editingRow) {
        await updateMutation.mutateAsync({
          sheetName,
          formData: multipartData,
        });

        toast.success("EB record updated ");
      } else {
        multipartData.set(
          "updates",
          JSON.stringify([
            {
              ...payload.updates[0],
              columns: [
                ...payload.updates[0].columns,
                { columnName: "CreatedBy", value: buildAuditEntry() },
              ],
            },
          ]),
        );

        await createMutation.mutateAsync({
          sheetName,
          formData: multipartData,
        });

        toast.success("EB record created ");
      }

      onSuccess?.();
      onClose?.();
    } catch (err) {
      //  console.error(err);
      toast.error("Operation failed ❌");
    }
  };

  return (
    <div className="w-full bg-white">
      <div className="bg-white w-full">
        {/* Header */}
        <div className="flex justify-between items-center px-6  py-4 "></div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 ">
          {/* First Row - Property Code & SubMeterDetails */}
          <div className="lg:grid  lg:grid-cols-3 gap-5">
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
                            (opt) => opt.value === field.value,
                          ) || null
                        }
                        onChange={(selected) =>
                          field.onChange(selected ? selected.value : "")
                        }
                      />
                      {error && (
                        <p className="text-red-500 text-sm mt-1">
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
                        (opt) => opt.value === field.value?.value,
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
                        date ? date.toISOString().split("T")[0] : "",
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
            {/* flat eb */}
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
                  <input
                    {...field}
                    placeholder="Enter sub meter details"
                    className="w-full  border-2 border-orange-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300"
                    // disabled={editingRow} // Disable when editing
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
                    options={ebPaidOptions}
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
                    options={ebCalculationStatusOptions}
                    styles={SelectStyles}
                    isClearable
                    placeholder="Select"
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
            {/* work logs */}
            <div className="col-span-2">
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
          </div>

          <div>
            {/* fourth row*/}
            {/* attachments */}
            <div>
              {/* Attachments */}
              <div className="">
                <label className="block text-sm font-medium text-black mb-2">
                  Attachments
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*,application/pdf"
                  onChange={(e) => {
                    const selected = Array.from(e.target.files);
                    setFiles((prev) => [...prev, ...selected]);
                  }}
                  className="w-full max-w-[300px] border-2 border-orange-300 rounded-md px-3 py-2"
                />
                {(existingAttachments.length > 0 || files.length > 0) && (
                  <div className="flex flex-wrap gap-4 mt-4">
                    {/* EXISTING FILES */}
                    {existingAttachments.map((file, index) => (
                      <div
                        key={file.url}
                        className="relative w-32 h-28 border rounded bg-gray-100 overflow-hidden flex items-center justify-center"
                      >
                        <button
                          type="button"
                          onClick={() =>
                            setExistingAttachments((prev) =>
                              prev.filter((_, i) => i !== index),
                            )
                          }
                          className="absolute top-1 right-1 z-10 bg-white text-red-600 px-2 rounded text-xs shadow"
                        >
                          ✕
                        </button>

                        {(() => {
                          const isPdf =
                            file.type === "application/pdf" ||
                            file.url?.toLowerCase().endsWith(".pdf");

                          return isPdf ? (
                            <div className="relative group w-full h-full flex flex-col items-center justify-center text-center p-2 bg-gray-50">
                              <i className="fa-solid fa-file-pdf text-red-600 text-3xl"></i>

                              <span
                                className="text-[11px] mt-2 truncate w-full px-1"
                                title={file.name}
                              >
                                {file.name}
                              </span>

                              {/* Custom Tooltip */}
                              <div className="absolute bottom-full mb-2 hidden group-hover:block bg-black text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap z-50">
                                {file.name}
                              </div>
                            </div>
                          ) : (
                            <img
                              src={file.url}
                              alt={file.name}
                              className="w-full h-full object-cover rounded"
                            />
                          );
                        })()}
                      </div>
                    ))}

                    {/* NEW FILES */}
                    {files.map((file, index) => (
                      <div
                        key={index}
                        className="relative w-32 h-28 border rounded bg-gray-100 overflow-hidden flex items-center justify-center"
                      >
                        <button
                          type="button"
                          onClick={() =>
                            setFiles((prev) =>
                              prev.filter((_, i) => i !== index),
                            )
                          }
                          className="absolute top-1 right-1 z-10 bg-white text-red-600 px-2 rounded text-xs shadow"
                        >
                          ✕
                        </button>

                        {(() => {
                          const isPdf =
                            file.type === "application/pdf" ||
                            file.url?.toLowerCase().endsWith(".pdf");

                          return isPdf ? (
                            <div className="relative group w-full h-full flex flex-col items-center justify-center text-center p-2 bg-gray-50">
                              <i className="fa-solid fa-file-pdf text-red-600 text-3xl"></i>

                              <span
                                className="text-[11px] mt-2 truncate w-full px-1"
                                title={file.name}
                              >
                                {file.name}
                              </span>

                              {/* Custom Tooltip */}
                              <div className="absolute bottom-full mb-2 hidden group-hover:block bg-black text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap z-50">
                                {file.name}
                              </div>
                            </div>
                          ) : (
                            <img
                              src={URL.createObjectURL(file)}
                              alt={file.name}
                              className="w-full h-full object-cover rounded"
                            />
                          );
                        })()}
                      </div>
                    ))}
                  </div>
                )}
              </div>
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
          {/* Second Row - Assignee & EB Calculation Date */}
        </form>
      </div>
    </div>
  );
};