import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import { toast } from "react-toastify";
import {
  useCreateProperty,
  useUpdateProperty,
  useDynamicDetails,
} from "./services";
import LoaderPage from "../NewBooking/LoaderPage";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { SelectStyles } from "../../Config";

/* ================= LABELS ================= */
const COLUMN_LABELS = {
  PropertyCode: "Property Code",
  PropertyLocation: "Location",
  BedCount: "Beds",
  Gender: "Gender",
  ACRoom: "AC / Non-AC",
  InternetUserID: "Internet User ID",
  InternetVendor: "Internet Vendor",
  InternetVendorContactNo1: "Internet Contact 1",
  InternetVendorContactNo2: "Internet Contact 2",
  PropertyAddress: "Address",
  WiFiName: "WiFi Name",
  WiFiPwd: "WiFi Password",
  EBConsumerNo: "EB Consumer No",
  EBBillingUnit: "EB Billing Unit",
  EBPCWebLink: "EB Portal Link",
  PropertyOwner: "Property Owner",
  POContactNo1: "Owner Contact 1",
  POContactNo2: "Owner Contact 2",
  PropertyStartDt: "Start Date",
  PropertyEndDt: "End Date",
  BillStartDate: "EB Start Date",
  BillEndDate: "EB End Date",
  GPGSRegisteredNo: "GPGS Registered No",
  AttachmentsPropertyAgreementANDPropertyPoliceNOC:
    "Attachments (Property Agreement and Property Bill NOC)",

  PropertyDealDetails: "Property Deal Details",
  GPGSTeamComments: "GPGS Team Comments",
  PGMainSheetID: "PG Main Sheet ID",
  PGEBSheetID: "PG EB Sheet ID",
  PGACSheetID: "PG AC Sheet ID",
  ITTeamComments: "IT Team Comments",
  AgreementStartDate: "Agreement Start Date",
  AgreementEndDate: "Agreement End Date",
  PropertyStatus: "Property Status",
};

/* ================= DEFAULT VALUES ================= */
const initialFormData = {
  PropertyCode: "",
  PropertyLocation: "",
  BedCount: "",
  Gender: "",
  ACRoom: "",
  InternetUserID: "",
  InternetVendor: "",
  InternetVendorContactNo1: "",
  InternetVendorContactNo2: "",
  PropertyAddress: "",
  WiFiName: "",
  WiFiPwd: "",
  EBConsumerNo: "",
  EBBillingUnit: "",
  EBPCWebLink: "",
  PropertyOwner: "",
  POContactNo1: "",
  POContactNo2: "",
  PropertyStartDt: "",
  PropertyEndDt: "",
  BillStartDate: "",
  BillEndDate: "",
  GPGSRegisteredNo: "",
  PropertyDealDetails: "",
  GPGSTeamComments: "",
  PGMainSheetID: "",
  PGEBSheetID: "",
  PGACSheetID: "",
  ITTeamComments: "",
  AgreementStartDate: "",
  AgreementEndDate: "",
  PropertyStatus: "",
  AttachmentsPropertyAgreementANDPropertyPoliceNOC: "",
};

/* ================= SELECT OPTIONS ================= */
const GENDER_OPTIONS = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
];

const AC_ROOM_OPTIONS = [
  { value: "AC", label: "AC" },

  { value: "Non-AC", label: "Non-AC" },
  { value: "Both", label: "Both" },
];
const PROPERTY_STATUS_OPTIONS = [
  { value: "Active", label: "Active" },
  { value: "Not Active", label: "Not Active" },
];
/* ================= LOCATION OPTIONS ================= */
// const LOCATION_OPTIONS = [
//   { value: "Nerul West", label: "Nerul West" },
//   { value: "Nerul East", label: "Nerul East" },
//   { value: "CBD Belapur", label: "CBD Belapur" },
//   { value: "Kopar Khairane", label: "Kopar Khairane" },
//   { value: "Ghansoli", label: "Ghansoli" },
//   // add more as needed
// ];

/* ================= BED COUNT OPTIONS (1–99) ================= */
const BED_COUNT_OPTIONS = Array.from({ length: 99 }, (_, i) => ({
  value: i + 1,
  label: String(i + 1),
}));

/* ================= COMPONENT ================= */
const CreateAndEditProperty = ({ editingRow, onClose, existingProperties }) => {
  const isEdit = Boolean(editingRow);

  const createMutation = useCreateProperty();
  const updateMutation = useUpdateProperty();
  const { data: DynamicValuesDetails } = useDynamicDetails();
  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: initialFormData,
  });
  const [files, setFiles] = useState([]);
  const [existingAttachments, setExistingAttachments] = useState([]);

  /* ================= PREFILL ================= */
  useEffect(() => {
    if (editingRow) {
      const data = {};
      Object.keys(initialFormData).forEach((key) => {
        data[key] = editingRow[key] ?? "";
      });
      if (editingRow.AttachmentsPropertyAgreementANDPropertyPoliceNOC) {
        setExistingAttachments(
          editingRow.AttachmentsPropertyAgreementANDPropertyPoliceNOC.split(
            ",",
          ).map((url) => ({
            url,
            name: url.split("/").pop(),
            existing: true,
          })),
        );
      }

      reset(data);
    } else {
      reset(initialFormData);
      setExistingAttachments([]);
      setFiles([]);
    }
  }, [editingRow, reset]);

  // for updating status of property
  const propertyStatus = watch("PropertyStatus");

  useEffect(() => {
    if (propertyStatus === "Active") {
      setValue("PropertyEndDt", "NA");
      setValue("BillEndDate", "NA");
    } else {
      if (watch("PropertyEndDt") === "NA") {
        setValue("PropertyEndDt", "");
      }
      if (watch("BillEndDate") === "NA") {
        setValue("BillEndDate", "");
      }
    }
  }, [propertyStatus, setValue]);

  /* ================= HELPERS ================= */
  const toISODate = (date) => (date ? date.toISOString().split("T")[0] : "");

  const fromISODate = (value) => (value ? new Date(value) : null);

  const validatePropertyCode = (value) => {
    if (!value?.trim()) return "Property Code is required";

    if (!isEdit) {
      const entered = value.trim().toLowerCase();
      const duplicate = existingProperties?.some(
        (p) => p.PropertyCode?.trim().toLowerCase() === entered,
      );

      if (duplicate) {
        toast.warning("Property already exists with this Property Code");
        return "Duplicate Property Code";
      }
    }
    return true;
  };
  const buildFormData = (data) => {
    const formData = new FormData();

    // Append normal fields
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value ?? "");
    });

    // Append new files
    files.forEach((file) => {
      formData.append("files", file);
    });

    // Existing attachments (edit mode)
    formData.append(
      "existingAttachments",
      JSON.stringify(existingAttachments.map((f) => f.url)),
    );

    return formData;
  };

  /* ================= SUBMIT ================= */
  const onSubmit = (data) => {
    const payload = {
      ...data,
      PropertyCode: data.PropertyCode.trim().toUpperCase(),
    };

    const formData = buildFormData(payload);

    if (isEdit) {
      formData.append("__rowNumber", editingRow.__rowNumber);

      updateMutation.mutate(formData, {
        onSuccess: () => {
          toast.success("Property updated successfully");
          onClose();
        },
        onError: () => toast.error("Failed to update property"),
      });
    } else {
      createMutation.mutate(formData, {
        onSuccess: () => {
          toast.success("New property created successfully");
          onClose();
        },
        onError: () => toast.error("Failed to create property"),
      });
    }
  };

  // property location options from dynamic sheet
  const LOCATION_OPTIONS = [
    ...Array.from(
      new Set(
        DynamicValuesDetails?.data
          ?.map((prop) => prop.PGLocation?.trim())
          .filter(Boolean),
      ),
    ).map((location) => ({
      value: location,
      label: location,
    })),
  ];

  //console.log(11111111111, PGLocationOptions);

  /* ================= UI ================= */
  return (
    <div className="w-full bg-white">
      <div className="bg-white w-fulL lg:mt-32 mt-24">
        {/* header */}
        <div className="flex justify-between items-center px-6 mb-0">
          <h3 className="text-2xl font-bold text-gray-900">
            {isEdit ? "Update Property Details" : "Add Property"}
          </h3>
          {/* <button
            onClick={onClose}
            className="text-xl font-bold hover:scale-110 transition-transform"
          >
            ✕
          </button> */}
        </div>
        {/* form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6"
        >
          {/* PROPERTY CODE */}
          <div>
            <label className="text-sm font-medium">
              Property Code <span className="text-red-500">*</span>
            </label>
            <Controller
              control={control}
              name="PropertyCode"
              rules={{ validate: validatePropertyCode }}
              render={({ field, fieldState }) => (
                <>
                  <input
                    {...field}
                    disabled={isEdit}
                    placeholder="Enter Property Code"
                    className={`w-full border-2 border-orange-300 rounded-md px-3 py-2
                      ${
                        isEdit
                          ? "bg-gray-100 cursor-not-allowed"
                          : "focus:outline-none focus:ring-2 focus:ring-orange-300"
                      }`}
                  />
                  {fieldState.error && (
                    <p className="text-xs text-red-500 mt-1">
                      {fieldState.error.message}
                    </p>
                  )}
                </>
              )}
            />
          </div>

          {/* DYNAMIC FIELDS */}
          {Object.keys(initialFormData)
            .filter(
              (k) =>
                k !== "PropertyCode" &&
                k !== "AttachmentsPropertyAgreementANDPropertyPoliceNOC",
            )
            .map((key) => {
              const dateFields = [
                "PropertyStartDt",
                "PropertyEndDt",
                "BillStartDate",
                "BillEndDate",
                "AgreementStartDate",
                "AgreementEndDate",
              ];

              const isGender = key === "Gender";
              const isACRoom = key === "ACRoom";
              const isLocation = key === "PropertyLocation";
              const isBedCount = key === "BedCount";
              const isPropertyStatus = key === "PropertyStatus";

              return (
                <div key={key}>
                  <label className="text-sm font-medium block mb-1">
                    {COLUMN_LABELS[key] || key}
                  </label>

                  {/* DATE */}
                  {dateFields.includes(key) && (
                    <Controller
                      control={control}
                      name={key}
                      render={({ field }) => (
                        <DatePicker
                          selected={
                            field.value === "NA"
                              ? null
                              : fromISODate(field.value)
                          }
                          onChange={(d) => field.onChange(toISODate(d))}
                          dateFormat="d MMM yyyy"
                          isClearable
                          disabled={
                            propertyStatus === "Active" &&
                            (key === "PropertyEndDt" || key === "BillEndDate")
                          }
                          placeholderText={
                            propertyStatus === "Active" &&
                            (key === "PropertyEndDt" || key === "BillEndDate")
                              ? "NA"
                              : "Select date"
                          }
                          className={`w-full border-2 rounded-md px-3 py-2
    ${
      propertyStatus === "Active" &&
      (key === "PropertyEndDt" || key === "BillEndDate")
        ? "bg-gray-100 cursor-not-allowed"
        : "border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-300"
    }`}
                        />
                      )}
                    />
                  )}

                  {/* GENDER */}
                  {isGender && (
                    <Controller
                      control={control}
                      name={key}
                      render={({ field }) => (
                        <Select
                          styles={SelectStyles}
                          options={GENDER_OPTIONS}
                          isClearable
                          placeholder="Select Gender"
                          value={
                            GENDER_OPTIONS.find(
                              (o) => o.value === field.value,
                            ) || null
                          }
                          onChange={(opt) => field.onChange(opt?.value || "")}
                        />
                      )}
                    />
                  )}

                  {/* AC ROOM */}
                  {isACRoom && (
                    <Controller
                      control={control}
                      name={key}
                      render={({ field }) => (
                        <Select
                          styles={SelectStyles}
                          options={AC_ROOM_OPTIONS}
                          isClearable
                          placeholder="Select AC Type"
                          value={
                            AC_ROOM_OPTIONS.find(
                              (o) => o.value === field.value,
                            ) || null
                          }
                          onChange={(opt) => field.onChange(opt?.value || "")}
                        />
                      )}
                    />
                  )}
                  {/* locatin dropdown */}
                  {isLocation && (
                    <Controller
                      control={control}
                      name={key}
                      render={({ field }) => (
                        <Select
                          styles={SelectStyles}
                          options={LOCATION_OPTIONS}
                          isClearable
                          placeholder="Select Location"
                          value={
                            LOCATION_OPTIONS.find(
                              (o) => o.value === field.value,
                            ) || null
                          }
                          onChange={(opt) => field.onChange(opt?.value || "")}
                        />
                      )}
                    />
                  )}
                  {/* Bed Cound  */}
                  {isBedCount && (
                    <Controller
                      control={control}
                      name={key}
                      render={({ field }) => (
                        <Select
                          styles={SelectStyles}
                          options={BED_COUNT_OPTIONS}
                          isClearable
                          placeholder="Select Bed Count"
                          value={
                            BED_COUNT_OPTIONS.find(
                              (o) => String(o.value) === String(field.value),
                            ) || null
                          }
                          onChange={(opt) => field.onChange(opt?.value || "")}
                        />
                      )}
                    />
                  )}
                  {/* isPropertyStatus */}
                  {isPropertyStatus && (
                    <Controller
                      control={control}
                      name={key}
                      render={({ field }) => (
                        <Select
                          styles={SelectStyles}
                          options={PROPERTY_STATUS_OPTIONS}
                          isClearable
                          placeholder="Select Property Status"
                          value={
                            PROPERTY_STATUS_OPTIONS.find(
                              (o) => String(o.value) === String(field.value),
                            ) || null
                          }
                          onChange={(opt) => field.onChange(opt?.value || "")}
                        />
                      )}
                    />
                  )}

                  {/* TEXT / NUMBER */}
                  {!dateFields.includes(key) &&
                    !isGender &&
                    !isACRoom &&
                    !isLocation &&
                    !isBedCount &&
                    !isPropertyStatus && (
                      <Controller
                        control={control}
                        name={key}
                        render={({ field }) => (
                          <input
                            {...field}
                            placeholder={`Enter ${COLUMN_LABELS[key] || key}`}
                            className="w-full border-2 border-orange-300 rounded-md px-3 py-2
                              focus:outline-none focus:ring-2 focus:ring-orange-300 "
                          />
                        )}
                      />
                    )}
                </div>
              );
            })}
          {/* PROPERTY ATTACHMENTS */}
          <div className="col-span-full">
            <label className="text-sm font-medium block mb-2">
              Attachments (Property Agreement & Property Bill NOC)
            </label>

            <input
              type="file"
              multiple
              accept="image/*,application/pdf"
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
                    className="relative w-32 h-28 border rounded bg-gray-100"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setExistingAttachments((prev) =>
                          prev.filter((_, i) => i !== index),
                        )
                      }
                      className="absolute top-1 right-1 bg-white text-red-600 px-2 rounded text-xs"
                    >
                      ✕
                    </button>

                    <img
                      src={file.url}
                      alt={file.name}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                ))}

                {/* NEW FILES */}
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="relative w-32 h-28 border rounded bg-gray-100"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setFiles((prev) => prev.filter((_, i) => i !== index))
                      }
                      className="absolute top-1 right-1 bg-white text-red-600 px-2 rounded text-xs"
                    >
                      ✕
                    </button>

                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ACTIONS */}
          <div className="col-span-full flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 min-w-[130px] rounded text-white bg-orange-500
                hover:bg-orange-600 disabled:bg-orange-300
                flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <LoaderPage size="small" inline />
                  <span>{isEdit ? "Updating..." : "Saving..."}</span>
                </>
              ) : (
                <span>{isEdit ? "Update" : "Save"}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAndEditProperty;