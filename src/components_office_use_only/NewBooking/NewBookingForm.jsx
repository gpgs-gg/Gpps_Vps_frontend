import React, { useEffect, useState } from "react";
import Select from "react-select";
import { Controller, useForm } from "react-hook-form";
import { useDynamicDetails } from "../Properties_Management/services";
import { SelectStyles } from "../../Config";
import { useUpdateNewBookingTable } from "./services";
import { toast } from "react-toastify";
import { usePropertMasteryData } from "../TicketSystem/Services";
import LoaderPage from "./LoaderPage";
import { useApp } from "../TicketSystem/AppProvider";

function NewBookingForm({ editingClient, setActiveTab }) {
  const {
    control,
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { data: dynamicData } = useDynamicDetails();
  const { mutate: updateNewBooking, isPending: isUpdatingBooking } = useUpdateNewBookingTable();
  const { data: property } = usePropertMasteryData();
  const { decryptedUser } = useApp();
  // ✅ Attachment States
  const [files, setFiles] = useState([]);
  const [existingAttachments, setExistingAttachments] = useState([]);
  console.log("files", files)
  /* =========================
     Build Dynamic Options
  ========================== */
  const ProperyOptions = property?.data?.map((prop) => ({
    value: prop["Property Code"],
    label: prop["Property Code"],
  })) || [];

  const buildOptions = (key) =>
    Array.from(
      new Set(dynamicData?.data?.map((item) => item[key]).filter(Boolean))
    ).map((value) => ({
      value: value.trim(),
      label: value.trim(),
    })) || [];

  const selectOptionTempPropCode = ProperyOptions;
  const selectOptionPermPropCode = ProperyOptions;
  const selectOptionYesNo = buildOptions("YesNo");
  const selectOptionNewBookingStaus = buildOptions("NewBookingStaus");
  const selectOptionAddToWhatsAppGrp = buildOptions("AddToWhatsAppGrp");
  const selectOptionNewBookingBedStaus = buildOptions("NewBookingBedStaus");
  const selectOptionACNonAC = buildOptions("ACNonAC");
  const selectOptionAskForBAOrFA = buildOptions("AskForBAOrFA");

  /* =========================
     Edit Auto Fill
  ========================== */

  const convertToSelect = (value) =>
    value
      ? {
        value: value.trim(),
        label: value.trim(),
      }
      : null;

  useEffect(() => {
    if (editingClient) {
      reset({
        ...editingClient,
        TempPropCode: convertToSelect(editingClient.TempPropCode),
        PermPropCode: convertToSelect(editingClient.PermPropCode),
        TempACRoom: convertToSelect(editingClient.TempACRoom),
        PermACRoom: convertToSelect(editingClient.PermACRoom),
        AskForBAOrFA: convertToSelect(editingClient.AskForBAOrFA),
        BookingStatus: convertToSelect(editingClient.BookingStatus),
        TempPGShtUpdated: convertToSelect(editingClient.TempPGShtUpdated),
        MainPGSheetUpdated: convertToSelect(editingClient.MainPGSheetUpdated),
        AddToWhatsAppGrp: convertToSelect(editingClient.AddToWhatsAppGrp),
        AddedToClientMaster: convertToSelect(
          editingClient.AddedToClientMaster || "No"
        ), Status: convertToSelect(editingClient.Status),
      });

      // ✅ LOAD EXISTING ATTACHMENTS
      if (editingClient.Attachments) {
        const urls = editingClient.Attachments.split(",").map((u) => u.trim());

        const formatted = urls.map((url) => ({
          url,
          name: url.split("/").pop(),
        }));

        setExistingAttachments(formatted);
      }
    } else {
      reset({});
      setExistingAttachments([]);
    }
  }, [editingClient, reset]);
  /* =========================
     Submit Handler
  ========================== */
  const formatDateTime = () => {
    const now = new Date();
    return now.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const normalize = (val) =>
    (val ?? "N/A").toString().trim() || "N/A";


  const generateWorklog = (oldData, newData, userName, empId) => {
    let changes = [];

    Object.keys(newData).forEach((key) => {
      const oldValue = normalize(oldData?.[key]);
      const newValue = normalize(newData?.[key]);

      if (oldValue !== newValue) {
        changes.push(
          `${key} changed from ${oldValue} to ${newValue}`
        );
      }
    });

    if (changes.length === 0) return oldData?.WorkLog || "";

    const logHeader = `[${formatDateTime()} - (${empId}) ${userName}]`;

    return `${logHeader}\n${changes.join("\n")}\n\n${oldData?.WorkLog || ""
      }`;
  };


  //   const onSubmit = (data) => {
  //     const finalPayload = {
  //       ...data,
  //       PermPropCode: data.PermPropCode?.value || "",
  //       TempPropCode: data.TempPropCode?.value || "",
  //       TempACRoom: data.TempACRoom?.value || "",
  //       PermACRoom: data.PermACRoom?.value || "",
  //       AskForBAOrFA: data.AskForBAOrFA?.value || "",
  //       BookingStatus: data.BookingStatus?.value || "",
  //       TempPGShtUpdated: data.TempPGShtUpdated?.value || "",
  //       MainPGSheetUpdated: data.MainPGSheetUpdated?.value || "",
  //       AddToWhatsAppGrp: data.AddToWhatsAppGrp?.value || "",
  //       Status: data.Status?.value || "",
  //     };

  //     // 🔥 ADD WORKLOG HERE
  //   finalPayload.WorkLogs = generateWorklog(
  //   editingClient || {},   // ✅ old record
  //   finalPayload,          // new record
  //   decryptedUser?.employee?.Name,
  //   decryptedUser?.employee?.EmployeeID,
  // );



  //     updateNewBooking(finalPayload, {
  //       onSuccess: () => {
  //         toast.success("Booking updated successfully!");
  //         reset();
  //         setActiveTab("Tab2");
  //       },
  //       onError: () => {
  //         toast.error("Failed to update booking. Please try again.");
  //       },
  //     });
  //   };

  const onSubmit = (data) => {

    // check if TempPropCode exists
    const hasTempPropCode = !!data.TempPropCode?.value;

    const fieldsCheck = {
      // 👇 sirf tab check hoga jab TempPropCode ho
      ...(hasTempPropCode && {
        "Temp PG Sheet Updated": data.TempPGShtUpdated?.value === "Yes",
      }),

      "Main PG Sheet Updated": data.MainPGSheetUpdated?.value === "Yes",

      "Added To WhatsApp Group":
        data.AddToWhatsAppGrp?.value === "Added",

      "Moved To Client Master":
        data.AddedToClientMaster?.value === "Yes",
    };

    // jo complete nahi hain unko find karo
    const pendingFields = Object.entries(fieldsCheck)
      .filter(([_, isCompleted]) => !isCompleted)
      .map(([name]) => name);

    // Closed validation
    if (data.Status?.value === "Closed" && pendingFields.length > 0) {
      toast.dismiss();

      toast.error(
        <div>
          <p className="font-bold mb-1">
            Before closing:
          </p>

          {pendingFields.map((field, index) => (
            <div key={index}>{`• ${field} ?`}</div>
          ))}
        </div>
      );

      return;
    }


    const finalPayload = {
      ...data,
      PermPropCode: data.PermPropCode?.value || "",
      TempPropCode: data.TempPropCode?.value || "",
      TempACRoom: data.TempACRoom?.value || "",
      PermACRoom: data.PermACRoom?.value || "",
      AskForBAOrFA: data.AskForBAOrFA?.value || "",
      BookingStatus: data.BookingStatus?.value || "",
      TempPGShtUpdated: data.TempPGShtUpdated?.value || "",
      MainPGSheetUpdated: data.MainPGSheetUpdated?.value || "",
      AddToWhatsAppGrp: data.AddToWhatsAppGrp?.value || "",
      AddedToClientMaster: data.AddedToClientMaster?.value || "",
      Status: data.Status?.value || "",
    };

    // ✅ Worklog
    finalPayload.WorkLogs = generateWorklog(
      editingClient || {},
      finalPayload,
      decryptedUser?.employee?.Name,
      decryptedUser?.employee?.EmployeeID
    );

    const formData = new FormData();

    // ✅ Normal fields
    Object.keys(finalPayload).forEach((key) => {
      formData.append(key, finalPayload[key] ?? "");
    });

    // ✅ Existing attachments (after delete)
    const existingUrls = existingAttachments.map((file) => file.url);

    formData.append("ExistingAttachments", existingUrls.join(","));

    // ✅ New files
    files.forEach((file) => {
      formData.append("images", file); // MUST match multer
    });

    updateNewBooking(formData, {
      onSuccess: () => {
        toast.success("Booking updated successfully!");
        setFiles([]);
        setExistingAttachments([]);
        reset();
        setActiveTab("Tab2");
      },
      onError: () => {
        toast.error("Failed to update booking.");
      },
    });
  };

  const inputClass =
    "w-full px-3 py-2 mt-1 border border-orange-500 rounded-md shadow focus:outline-none focus:ring-1 focus:ring-orange-400 focus:border-orange-400";
    
  const fieldLabels = {
    ClientFullName: "Client Name",
    WhatsAppNo: "WhatsApp Number",
    CallingNo: "Calling Number",
    EmailId: "Email ID",

    EmgyCont1FullName: "Emergency Contact 1 Name",
    EmgyCont1No: "Emergency Contact 1 Number",
    EmgyCont2FullName: "Emergency Contact 2 Name",
    EmgyCont2No: "Emergency Contact 2 Number",

    PermPropCode: "Permanent Property",
    PermBedNo: "Permanent Bed No",
    PermRoomNo: "Permanent Room No",
    PermBedDOJ: "Permanent Bed DOJ",
    PermBedLDt: "Permanent Bed Last Date",
    PermACRoom: "Permanent Room Type",
    PermBedRentComnt: "Permanent Rent Comment",

    TempPropCode: "Temporary Property",
    TempRoomNo: "Temporary Room No",
    TempBedNo: "Temporary Bed No",
    TempBedDOJ: "Temporary Bed DOJ",
    TempBedLDt: "Temporary Last Date",
    TempBedRentComnt: "Temporary Rent Comment",
    TempACRoom: "Temporary Room Type",
    TempPGShtUpdated: "Temp PG Sheet Updated",

    PermBedMonthlyFixRent: "Permanent Monthly Rent",
    PermBedDepositAmt: "Deposit Amount",
    PermBedRentAmt: "Permanent Rent Amount",

    TempBedMonthlyFixRent: "Temporary Monthly Rent",
    TempBedRentAmt: "Temporary Rent Amount",

    ProcessingFeesAmt: "Processing Fees",
    UpcomingRentHikeDt: "Rent Hike Date",
    UpcomingRentHikeAmt: "Rent Hike Amount",

    BookingAmt: "Booking Amount",
    TotalAmt: "Total Amount",
    BalanceAmt: "Balance Amount",

    AskForBAOrFA: "Ask For BA / FA",

    BookingStatus: "Booking Status",
    MainPGSheetUpdated: "Main PG Sheet Updated",
    AddToWhatsAppGrp: "Add To WhatsApp Group",
    AddedToClientMaster: "Added To Client Master",

    Comments: "Comments",
    Status: "Status",
    ID: "Employee ID",
    EmployeeName: "Employee Name",
  };
  return (
    <div className="overflow-auto border border-gray-200 rounded-lg">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-sm py-5 rounded-b-lg px-10 max-w-8xl w-full"
      >

        {/* 🔥 SECTION WISE FIELD GROUPING */}
        {
          [
            {
              title: "Client Details",
              fields: [
                "ClientFullName",
                "WhatsAppNo",
                "CallingNo",
                "EmailId",
                "EmgyCont1FullName",
                "EmgyCont1No",
                "EmgyCont2FullName",
                "EmgyCont2No",

              ],
            },
            {
              title: "Property Details",
              fields: [
                "PermPropCode",
                "PermBedNo",
                "PermRoomNo",
                "PermBedDOJ",
                "PermBedLDt",
                "PermACRoom",
                "PermBedRentComnt",
                "TempPropCode",
                "TempRoomNo",
                "TempBedNo",
                "TempBedDOJ",
                "TempBedLDt",

                "TempBedRentComnt",

                "TempACRoom",

              ],
            },
            {
              title: "Payments Details",
              fields: [
                "PermBedMonthlyFixRent",
                "PermBedDepositAmt",
                "PermBedRentAmt",
                "TempBedMonthlyFixRent",
                "TempBedRentAmt",
                "ProcessingFeesAmt",
                "UpcomingRentHikeDt",
                "UpcomingRentHikeAmt",
                "AskForBAOrFA",
                "BookingAmt",
                "TotalAmt",
                "BalanceAmt",

              ],
            },
            {
              title: "Other Details",
              fields: [
                "BookingStatus",
                "MainPGSheetUpdated",
                "TempPGShtUpdated",
                "AddToWhatsAppGrp",
                "AddedToClientMaster",
                "Comments",
                "Status",
                "EmployeeName",
                "ID",
                "WorkLogs"

              ],
            },
          ].map((section) => (
            <div key={section.title} className="mb-8">

              {/* ✅ Section Heading */}
              <h2 className="text-xl  font-semibold mb-4 bg-gray-200 border flex justify-start px-5 items-center p-1">
                {section.title}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-5">

                {section.fields.map((field) => {

                  /** 🔥 SELECT CONFIG MATCHING */
                  const selectConfig = {
                    TempPropCode: selectOptionTempPropCode,
                    PermPropCode: selectOptionPermPropCode,
                    TempACRoom: selectOptionACNonAC,
                    PermACRoom: selectOptionACNonAC,
                    AskForBAOrFA: selectOptionAskForBAOrFA,
                    BookingStatus: selectOptionNewBookingBedStaus,
                    TempPGShtUpdated: selectOptionYesNo,
                    MainPGSheetUpdated: selectOptionYesNo,
                    AddToWhatsAppGrp: selectOptionAddToWhatsAppGrp,
                    AddedToClientMaster: selectOptionYesNo,
                    Status: selectOptionNewBookingStaus,
                  };

                  const isSelectField = selectConfig[field];

                  return (
                    <div key={field}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {fieldLabels[field] || field}
                      </label>

                      {isSelectField ? (
                        <Controller
                          name={field}
                          control={control}
                          render={({ field: controllerField }) => (
                            <Select
                              {...controllerField}
                              styles={SelectStyles}
                              options={isSelectField}
                              isClearable
                              isDisabled={field === "AddedToClientMaster"}
                              placeholder={field}
                            />
                          )}
                        />
                      ) : (
                        <input
                          type="text"
                          {...register(field)}
                          className={inputClass}
                          placeholder={field}
                        />
                      )}
                    </div>
                  );
                })}

              </div>
            </div>
          ))}

        {/*start ================= ATTACHMENTS SECTION ================= */}

        <div className="mt-8">
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
                        prev.filter((_, i) => i !== index)
                      )
                    }
                    className="absolute top-1 right-1 z-10 bg-white text-red-600 px-2 rounded text-xs shadow"
                  >
                    ✕
                  </button>

                  {file.url?.toLowerCase().endsWith(".pdf") ? (
                    <div className="flex flex-col items-center justify-center text-center p-2">
                      <i className="fa-solid fa-file-pdf text-red-600 text-3xl"></i>
                      <span className="text-[11px] mt-2 truncate w-full px-1">
                        {file.name}
                      </span>
                    </div>
                  ) : (
                    <img
                      src={file.url}
                      alt={file.name}
                      className="w-full h-full object-cover rounded"
                    />
                  )}
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
                        prev.filter((_, i) => i !== index)
                      )
                    }
                    className="absolute top-1 right-1 z-10 bg-white text-red-600 px-2 rounded text-xs shadow"
                  >
                    ✕
                  </button>

                  {file.type === "application/pdf" ? (
                    <div className="flex flex-col items-center justify-center text-center p-2">
                      <i className="fa-solid fa-file-pdf text-red-600 text-3xl"></i>
                      <span className="text-[11px] mt-2 truncate w-full px-1">
                        {file.name}
                      </span>
                    </div>
                  ) : (
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="w-full h-full object-cover rounded"
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ================= ATTACHMENTS SECTION ================= end */}
        <div className=" flex justify-center items-center mt-6 gap-5 ">
          <button
            type="submit"
            className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
          >
            {isUpdatingBooking ? (

              <div className="flex justify-center items-center gap-2">
                <LoaderPage />
                Updating...
              </div>

            ) : (
              "Update"
            )}
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab("Tab2");
            }}
            className="px-6 py-2  rounded-md border border-gray-300 hover:bg-gray-100"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default NewBookingForm;