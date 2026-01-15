import * as yup from "yup";
import { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import Select from "react-select";
import { useForm, Controller } from "react-hook-form";
import { useWatch } from "react-hook-form";// import Select from "react-select";
import { toast } from "react-toastify";
import { usePostClientDeatails, useUpdateClientDetails } from "./services";
import LoaderPage from "../NewBooking/LoaderPage";
import LeadsTable from "./LeadsTable";
import { useDynamicDetails } from "../TicketSystem/Services";
import { useApp } from "../TicketSystem/AppProvider";
import { useNavigate } from "react-router-dom";
import { sl } from "date-fns/locale";


// ✅ Validation schema
const schema = yup.object({
  /* ================= SINGLE LEAD ================= */

  CallingNo: yup.string().when("$activeLead", {
    is: "CreateSingleLead",
    then: (s) => s.required("Calling No is required"),
    otherwise: (s) => s.notRequired(),
  }),

  WhatsAppNo: yup.string().when("$activeLead", {
    is: "CreateSingleLead",
    then: (s) =>
      s
        .required("WhatsApp No is required")
        .matches(/^[0-9]{10}$/, "Enter 10 digit number"),
    otherwise: (s) => s.notRequired(),
  }),

  /* ================= BULK LEAD ================= */

  BulkOptions: yup
    .mixed()
    .nullable() // ✅ IMPORTANT
    .when("$activeLead", {
      is: "BulkUploadLeads",
      then: (s) => s.required("Select bulk option"),
      otherwise: (s) => s.notRequired(),
    }),

  BulkCallingNo: yup.string().when("$activeLead", {
    is: "BulkUploadLeads",
    then: (s) =>
      s
        .required("Enter bulk data")
        .test(
          "has-value",
          "Bulk data cannot be empty",
          (v) => !!v && v.trim().length > 0
        ),
    otherwise: (s) => s.notRequired(),
  }),

  Comments: yup.string().nullable(),
});





function ClientLeads({ activeLead, setActiveLead, setActiveTab }) {
  const { selectedClient, setSelectedClient, decryptedUser } = useApp()

  const {
    control,
    handleSubmit,
    setValue,
    register,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    key: activeLead, 
    resolver: yupResolver(schema, {
      context: { activeLead },
        // ✅ THIS IS IMPORTANT
    }),
    mode: "onSubmit",       // ❗ required
    reValidateMode: "onChange",
    shouldUnregister: true,
    defaultValues: {
      ClientName: "",
      Gender: null,
      CallingNo: "",
      WhatsAppNo: "",
      BulkCallingNo: "",
      BulkWhatsAppNo: "",
      LeadSource: null,
      WhatsAppMsgs: null,
      PhoneCalls: null,
      interestedLocation: null,
      BookingStatus: null,
      visited: null,
      Comments: "",
      workLogs: "",
      BulkOptions: null,
    },
  });
  useEffect(() => {
    reset({}, { keepErrors: false });
  }, [activeLead, reset]);

  // ===================== ✅ API Hooks =====================
  console.log(1111111111111, errors)
  const { data: dynamicData } = useDynamicDetails();
  const { mutateAsync: createClient } = usePostClientDeatails();
  const { mutateAsync: updateClient } = useUpdateClientDetails();
  // const navigate = useNavigate()
  // const [selectedClient, setSelectedClient] = useState(null);

  const BulkLabeValue = watch("BulkOptions")
  //====================== ✅ Dropdown Options================================
  const selectOptionGender = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
  ];
  const selectOptionBulkData = [
    { value: "CallingNo", label: "Calling No" },
    { value: "ClientName", label: "Client Name" },
  ];

  const selectOptionLeadSource =
    (Array.from(
      new Set(dynamicData?.data?.map((item) => item.LeadSourcee).filter(Boolean))
    ).map((value) => ({ value, label: value }))) || [];

  const selectOptioninterestedLocation =
    (Array.from(
      new Set(dynamicData?.data?.map((item) => item.Location).filter(Boolean))
    ).map((value) => ({ value, label: value }))) || [];

  const selectOptionWhatsAppCommunication =
    (Array.from(
      new Set(dynamicData?.data?.map((item) => item.WhatsAppStatus).filter(Boolean))
    ).map((value) => ({ value, label: value }))) || [];

  const selectOptionPhoneCallCommunication =
    (Array.from(
      new Set(dynamicData?.data?.map((item) => item.CallStatus).filter(Boolean))
    ).map((value) => ({ value, label: value }))) || [];

  const selectOptionYesNo = [
    { value: "Done", label: "Done" },
    { value: "NotDone", label: "Not Done" },
  ];
  const selectOptionBookingStatus = [
    { value: "Done", label: "Done" },
    { value: "NotDone", label: "Not Done" },
  ];

  const employeeSelectStyles = {
    control: (base, state) => ({
      ...base,

      padding: "0.14rem 0.5rem",
      marginTop: "0.09rem",
      borderWidth: "1px",
      borderColor: state.isFocused ? "#fb923c" : "#f97316",
      borderRadius: "0.375rem",
      boxShadow: state.isFocused
        ? "0 0 0 2px rgba(251,146,60,0.5)"
        : "0 1px 2px rgba(0,0,0,0.05)",
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
    menu: (provided) => ({
      ...provided,
      zIndex: 9999,
    }),
  };


  ///////////////// Akash Code //////////////////////


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

  const getChangeText = (oldVal, newVal, label) => {
    if ((oldVal || "") !== (newVal || "")) {
      return `${label} changed from ${oldVal || "N/A"} to ${newVal || "N/A"}`;
    }
    return null;
  };


  ///////////////// Akash Code //////////////////////
  // const splitNumbers = (value = "") =>
  //   value
  //     .split(/[\n,]/)          
  //     .map(v => v.trim())
  //     .filter(v => /^[0-9]{10}$/.test(v)); // valid 10 digit only

  // const onSubmit = async (data) => {
  //   try {
  //     // 1️⃣ Split numbers
  //     const callingArr = splitNumbers(data.CallingNo);
  //     const whatsappArr = splitNumbers(data.WhatsAppNo);

  //     // ❗ CallingNo mandatory
  //     if (callingArr.length === 0) {
  //       alert("Please enter at least one Calling Number");
  //       return;
  //     }
  //     const createdData = {
  //       ClientName: data.ClientName,
  //       CallingNo: data.CallingNo,
  //       WhatsAppNo: data.WhatsAppNo,
  //       Gender: data?.Gender?.value || "",
  //       Location: data?.Location?.value || "",
  //       LeadSource: data?.LeadSource?.value || "",
  //       PhoneCallCommunication: data?.PhoneCallCommunication?.value || "",
  //       WhatsAppCommunication: data?.WhatsAppCommunication?.value || "",
  //       Visited: data?.visited?.value || "",
  //       BookingStatus: data?.BookingStatus?.value || "",
  //       workLogs: `[${formatLogDate()} - ${decryptedUser.name}]\n ${data.Comments || "Lead Created"}`,
  //     };

  //     // 2️⃣ Prepare payload (index-wise mapping)
  //     const payload = callingArr.map((callingNo, index) => ({
  //       ...data,

  //       // ✅ Only Calling field numbers
  //       CallingNo: callingNo,

  //       // ✅ Only WhatsApp field numbers (if available)
  //       WhatsAppNo: whatsappArr[index] || ""
  //     }));

  //     console.log("Final Payload:", payload);

  //     // 3️⃣ API call
  //     await createClient(payload || createdData);

  //     // 4️⃣ Success handling
  //     toast.success("Leads created successfully");

  //   } catch (error) {
  //     console.error("Submit Error:", error);
  //     toast.error("Something went wrong");
  //   }
  // };


  // =====================✅ Submit Handler =========================
  // const onSubmit = async (data) => {
  //   try {
  //     // ================= UPDATE =================
  //     // if (selectedClient) {
  //     //   const changes = [];

  //     //   const phoneChange = getChangeText(
  //     //     selectedClient.PhoneCallCommunication,
  //     //     data?.PhoneCallCommunication?.value,
  //     //     "PC Status"
  //     //   );

  //     //   const whatsappChange = getChangeText(
  //     //     selectedClient.WhatsAppCommunication,
  //     //     data?.WhatsAppCommunication?.value,
  //     //     "WC Status"
  //     //   );
  //     //   const visitedChange = getChangeText(
  //     //     selectedClient.Visited || selectedClient.visited,
  //     //     data?.visited?.value,
  //     //     "Visited"
  //     //   );

  //     //   const bookingStatusChange = getChangeText(
  //     //     selectedClient.BookingStatus,
  //     //     data?.BookingStatus?.value,
  //     //     "BS Status"
  //     //   );
  //     //   if (phoneChange) changes.push(phoneChange);
  //     //   if (whatsappChange) changes.push(whatsappChange);
  //     //   if (visitedChange) changes.push(visitedChange);
  //     //   if (bookingStatusChange) changes.push(bookingStatusChange);

  //     //   const hasComment = data.Comments && data.Comments.trim();

  //     //   let finalComments = selectedClient.workLogs || "";

  //     //   // ✅ ONLY when communication changed AND comment exists

  //     //     const log = `[${formatLogDate()} - ${decryptedUser.name}] ${changes.join(
  //     //       " | "
  //     //     )} \n ${data.Comments}`;

  //     //     finalComments = finalComments
  //     //       ? `${finalComments}\n${log}`
  //     //       : log;

  //     //   console.log("Final Comments:", finalComments);
  //     //   const updatedData = {
  //     //     ClientName: data.ClientName,
  //     //     CallingNo: data.CallingNo,
  //     //     WhatsAppNo: data.WhatsAppNo,
  //     //     Gender: data?.Gender?.value || "",
  //     //     Location: data?.Location?.value || "",
  //     //     LeadSource: data?.LeadSource?.value || "",
  //     //     PhoneCallCommunication: data?.PhoneCallCommunication?.value || "",
  //     //     WhatsAppCommunication: data?.WhatsAppCommunication?.value || "",
  //     //     Visited: data?.visited?.value || "",
  //     //     BookingStatus: data?.BookingStatus?.value || "",
  //     //     LeadNo: selectedClient.LeadNo,
  //     //     workLogs: finalComments,
  //     //   };

  //     //   await updateClient({ data: updatedData });

  //     //   toast.success("Lead updated successfully!");
  //     //   reset();
  //     //   setSelectedClient(null);
  //     //   navigate("/gpgs-actions/leads-list");
  //     //   return;
  //     // }

  //     // ================= CREATE =================
  //     const createdData = {
  //       ClientName: data.ClientName,
  //       CallingNo: data.CallingNo,
  //       WhatsAppNo: data.WhatsAppNo,
  //       Gender: data?.Gender?.value || "",
  //       Location: data?.Location?.value || "",
  //       LeadSource: data?.LeadSource?.value || "",
  //       PhoneCallCommunication: data?.PhoneCallCommunication?.value || "",
  //       WhatsAppCommunication: data?.WhatsAppCommunication?.value || "",
  //       Visited: data?.visited?.value || "",
  //       BookingStatus: data?.BookingStatus?.value || "",
  //       workLogs: `[${formatLogDate()} - ${decryptedUser.name}]\n ${data.Comments || "Lead Created"}`,
  //     };

  //     const BulkData = {
  //       CallingNo: data.BulkCallingNo,
  //       WhatsAppNo: data.BulkWhatsAppNo,
  //     };
  //     await createClient(createdData || BulkData);
  //     toast.success("Lead added successfully!");
  //     reset();
  //     navigate("/gpgs-actions/leads-list");
  //   } catch (error) {
  //     console.error(error);
  //     toast.error("Something went wrong!");
  //   }
  // };
 const onSubmit = async (data) => {
  try {
    /* ===================== UPDATE ===================== */
    if (selectedClient) {
      /* ---------- 1️⃣ Detect ALL normal field changes ---------- */
      const hasAnyFieldChanged =
        selectedClient.ClientName !== data.ClientName ||
        selectedClient.CallingNo !== data.CallingNo ||
        selectedClient.WhatsAppNo !== data.WhatsAppNo ||
        selectedClient.Gender !== data?.Gender?.value ||
        selectedClient.Location !== data?.Location?.value ||
        selectedClient.LeadSource !== data?.LeadSource?.value;

      /* ---------- 2️⃣ Detect ONLY worklog-related changes ---------- */
      const changes = [];

      const phoneChange = getChangeText(
        selectedClient.PhoneCalls,
        data?.PhoneCalls?.value,
        "Phone Call"
      );

      const whatsappChange = getChangeText(
        selectedClient.WhatsAppMsgs,
        data?.WhatsAppMsgs?.value,
        "WhatsApp"
      );

      const visitedChange = getChangeText(
        selectedClient.Visited,
        data?.visited?.value,
        "Visited"
      );

      const bookingStatusChange = getChangeText(
        selectedClient.BookingStatus,
        data?.BookingStatus?.value,
        "Booking Status"
      );

      if (phoneChange) changes.push(phoneChange);
      if (whatsappChange) changes.push(whatsappChange);
      if (visitedChange) changes.push(visitedChange);
      if (bookingStatusChange) changes.push(bookingStatusChange);

      /* ---------- 3️⃣ Block update if NOTHING changed ---------- */
      if (!hasAnyFieldChanged && !changes.length && !data?.Comments?.trim()) {
        toast.warn("No changes to update");
        return;
      }

      /* ---------- 4️⃣ Prepare workLogs (ONLY when needed) ---------- */
      let finalComments = selectedClient.workLogs || "";

      if (changes.length || data?.Comments?.trim()) {
        const log = `[${formatLogDate()} - (${decryptedUser.id}) ${decryptedUser.name}]
${changes.join(" | ")}
${data.Comments || ""}`;

        finalComments = finalComments
          ? `${finalComments}\n${log}`
          : log;
      }

      /* ---------- 5️⃣ Final UPDATE payload ---------- */
      const updatedData = {
        ClientName: data.ClientName,
        CallingNo: data.CallingNo,
        WhatsAppNo: data.WhatsAppNo,
        Gender: data?.Gender?.value || "",
        Location: data?.Location?.value || "",
        LeadSource: data?.LeadSource?.value || "",
        PhoneCalls: data?.PhoneCalls?.value || "",
        WhatsAppMsgs: data?.WhatsAppMsgs?.value || "",
        Visited: data?.visited?.value || "",
        BookingStatus: data?.BookingStatus?.value || "",
        LeadNo: selectedClient.LeadNo,
        workLogs: finalComments,
      };

      await updateClient({ data: updatedData });

      toast.success("Lead updated successfully!");
      setSelectedClient(null);
      reset();
      setActiveTab("leadsList");
      return;
    }

    /* ===================== CREATE ===================== */

    if (
      activeLead === "CreateSingleLead" &&
      (!data.CallingNo || !data.WhatsAppNo)
    ) {
      return;
    }

    if (
      activeLead === "BulkUploadLeads" &&
      (!data.BulkOptions || !data.BulkCallingNo)
    ) {
      return;
    }

    /* ---------- BULK CREATE ---------- */
    if (activeLead === "BulkUploadLeads") {
      const bulkPayload = {
        [data.BulkOptions.value]: data.BulkCallingNo,
        workLogs: `Bulk Created by[${formatLogDate()} - (${decryptedUser.id}) ${decryptedUser.name}]
${data.Comments || "Lead Created"}`,
      };

      await createClient(bulkPayload);
      toast.success("Bulk leads added successfully!");
    }

    /* ---------- SINGLE CREATE ---------- */
    else {
      const createdData = {
        ClientName: data.ClientName,
        CallingNo: data.CallingNo,
        WhatsAppNo: data.WhatsAppNo,
        Gender: data?.Gender?.value || "",
        Location: data?.Location?.value || "",
        LeadSource: data?.LeadSource?.value || "",
        PhoneCalls: data?.PhoneCalls?.value || "",
        WhatsAppMsgs: data?.WhatsAppMsgs?.value || "",
        Visited: data?.visited?.value || "",
        BookingStatus: data?.BookingStatus?.value || "",
        workLogs: `Created by[${formatLogDate()} - (${decryptedUser.id}) ${decryptedUser.name}]
${data.Comments || "Lead Created"}`,
      };

      await createClient(createdData);
      toast.success("Lead added successfully!");
    }

    reset();
    setActiveTab("leadsList");
  } catch (error) {
    console.error(error);
    toast.error("Something went wrong!");
  }
};




  //  Auto-fill when editing
  useEffect(() => {
    if (!selectedClient) {
      reset();
      return;
    }

    reset({
      ClientName: selectedClient.ClientName || "",
      CallingNo: selectedClient.CallingNo || "",
      WhatsAppNo: selectedClient.WhatsAppNo || "",
      // Comments: selectedClient.Comments || "",
    });

    const findOption = (options, val) => {
      if (!options || !val) return null;
      if (typeof val === "object" && val.value) return val;
      return (
        options.find(
          (o) =>
            String(o.value).toLowerCase() === String(val).toLowerCase() ||
            String(o.label).toLowerCase() === String(val).toLowerCase()
        ) || { value: val, label: val }
      );
    };

    setValue("Gender", findOption(selectOptionGender, selectedClient.Gender));
    setValue("LeadSource", findOption(selectOptionLeadSource, selectedClient.LeadSource || selectedClient.LeadSourcee));
    setValue("Location", findOption(selectOptioninterestedLocation, selectedClient.Location || selectedClient.Location));
    setValue("visited", findOption(selectOptionYesNo, selectedClient.Visited || selectedClient.visited));
    setValue("WhatsAppMsgs", findOption(selectOptionWhatsAppCommunication, selectedClient.WhatsAppMsgs));
    setValue("PhoneCalls", findOption(selectOptionPhoneCallCommunication, selectedClient.PhoneCalls));
    setValue("BookingStatus", findOption(selectOptionYesNo, selectedClient.BookingStatus || selectedClient.BookingStatus));
    setValue("WorkLogs", selectedClient.workLogs || "");
  }, [selectedClient, reset, setValue]);


  const handleCancel = () => {
    setSelectedClient("")
    setActiveTab("leadsList")
  }


  //================== Tab Css ============================================== 
  const TabColor = (tab) =>
    `py-2 px-4 rounded-md text-center cursor-pointer font-semibold text-lg w-96
${activeLead === tab ? "bg-orange-400 " : "text-gray-50 bg-orange-200 hover:bg-orange-300"}`
  // =============================================================================================

  return (
    <div className="max-w-7xl mx-auto my-5 bg-white shadow-sm">
      <div className="rounded-xl p-2 border-2">
        {/* Buttons to switch activeLead */}
        <div className="flex justify-center text-xl font-semibold  gap-14 px-3 py-4 rounded-md text-white mb-4">
          <div
            className={`${TabColor("BulkUploadLeads")} ${selectedClient ? "opacity-50 cursor-not-allowed pointer-events-none" : ""
              }`}
            onClick={() => {
              if (!selectedClient) {
                setActiveLead("BulkUploadLeads");
              }
            }}
          >
            <h2>Bulk Upload Leads</h2>
          </div>

          <div
            className={TabColor("CreateSingleLead")}
            onClick={() => setActiveLead("CreateSingleLead")}
          >
            <h2 className="cursor-pointer">
              {selectedClient ? "Update Single Lead" : "Add Single Lead"}
            </h2>
          </div>

        </div>

        {/* Conditional Rendering using if-else */}
        {activeLead === "BulkUploadLeads" ? (


          <div className="max-w-7xl mx-auto my-5 w-">
            <form className="mt-4 sm:p-1 p-3" onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 gap-5">

                {/* ================= BulkOptions (NARROW WIDTH) ================= */}
                <div className="max-w-[220px]">
                  <label className="text-sm text-gray-700">Create Bulk Leads</label>
                  <Controller
                    name="BulkOptions"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        placeholder="Select"
                        isClearable
                        styles={employeeSelectStyles}
                        options={selectOptionBulkData}
                      />
                    )}
                  />
                  {errors.BulkOptions && <p className="text-red-500 text-sm mt-1">{errors.BulkOptions.message}</p>}
                </div>

                {/* ================= Calling No  ================= */}
                <div>
                  <label className="text-sm text-gray-700">
                    <span className="relative after:content-['*'] after:ml-1 after:text-red-500">
                      {BulkLabeValue ? BulkLabeValue.label : "Chooese labe"}
                    </span>
                  </label>
                  <textarea
                    disabled={BulkLabeValue ? false : true}
                    placeholder="Enter Bulk Data"
                    className="w-full px-3 py-[8px] border outline-none border-orange-400 rounded-md focus:ring-2 focus:ring-orange-300"
                    {...register("BulkCallingNo")}
                  />
                  {errors.BulkCallingNo && <p className="text-red-500 text-sm mt-1">{errors.BulkCallingNo.message}</p>}
                </div>

              </div>

              {/* ================= ACTION BUTTONS ================= */}
              <div className="flex justify-center items-center gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`mt-5 px-4 py-2 rounded-md text-[16px] text-white ${isSubmitting
                    ? "bg-orange-300 cursor-not-allowed"
                    : "bg-orange-500 hover:bg-orange-600"
                    }`}
                >
                  {isSubmitting ? <div className="flex gap-2"><LoaderPage /><span>Submitting...</span></div> : "Submit"}
                </button>

                <p
                  onClick={handleCancel}
                  className="mt-5 px-4 py-2 rounded-md text-[16px] cursor-pointer text-black"
                >
                  Cancel
                </p>
              </div>
            </form>
          </div>






          // ========================================================== Single Upload Leads =============================================================================================







        ) : activeLead === "CreateSingleLead" ? (


          <form className="mt-4 sm:p-1 p-3" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5">
              {/* Client Name */}
              <div>
                <label className="text-sm text-gray-700">Client Full Name</label>
                <input
                  type="text"
                  placeholder="Enter full Client Name"
                  className="w-full px-3 py-[8px] border border-orange-400 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-500 shadow-sm hover:border-orange-400"
                  {...register("ClientName")}
                />
              </div>

              {/* Gender */}
              <div>
                <label className="text-sm text-gray-700">Gender</label>
                <Controller
                  name="Gender"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      placeholder="Select Gender"
                      isClearable
                      styles={employeeSelectStyles}
                      options={selectOptionGender}
                    />
                  )}
                />
              </div>

              {/* Calling No */}
              <div>
                <label className="text-sm text-gray-700">
                  <span className="relative after:content-['*'] after:ml-1 after:text-red-500">Calling No</span>
                </label>
                <input
                  placeholder="Enter Phone No"
                  className="w-full px-3 py-[8px] border outline-none border-orange-400 rounded-md focus:ring-2 focus:ring-orange-300"
                  {...register("CallingNo")}
                />
                {errors.CallingNo && <p className="text-red-500 text-sm mt-1">{errors.CallingNo.message}</p>}
              </div>

              {/* WhatsApp No */}
              <div>
                <label className="text-sm text-gray-700">
                  <span className="relative after:content-['*'] after:ml-1 after:text-red-500">WhatsApp No</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter WhatsApp No"
                  className="w-full px-3 py-[8px] border outline-none border-orange-400 rounded-md focus:ring-2 focus:ring-orange-300"
                  {...register("WhatsAppNo")}
                />
                {errors.WhatsAppNo && <p className="text-red-500 text-sm mt-1">{errors.WhatsAppNo.message}</p>}
              </div>

              {/* Lead Source */}
              <div>
                <label className="text-sm text-gray-700">Lead Source</label>
                <Controller
                  name="LeadSource"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      placeholder="Select Lead Source"
                      isClearable
                      styles={employeeSelectStyles}
                      options={selectOptionLeadSource}
                    />
                  )}
                />
              </div>

              {/* Interested Location */}
              <div>
                <label className="text-sm text-gray-700">Interested Location</label>
                <Controller
                  name="Location"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      placeholder="Select Location"
                      isClearable
                      styles={employeeSelectStyles}
                      options={selectOptioninterestedLocation}
                    />
                  )}
                />
              </div>

              {/* WhatsApp Communication */}
              <div>
                <label className="text-sm text-gray-700">WhatsApp Communication</label>
                <Controller
                  name="WhatsAppMsgs"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      placeholder="Select Option"
                      isClearable
                      styles={employeeSelectStyles}
                      options={selectOptionWhatsAppCommunication}
                    />
                  )}
                />
              </div>

              {/* Phone Call Communication */}
              <div>
                <label className="text-sm text-gray-700">Phone Call Communication</label>
                <Controller
                  name="PhoneCalls"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      placeholder="Select Option"
                      isClearable
                      styles={employeeSelectStyles}
                      options={selectOptionPhoneCallCommunication}
                    />
                  )}
                />
              </div>

              {/* Visited */}
              <div>
                <label className="text-sm text-gray-700">Visited</label>
                <Controller
                  name="visited"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      placeholder="Visited?"
                      isClearable
                      styles={employeeSelectStyles}
                      options={selectOptionYesNo}
                    />
                  )}
                />
              </div>

              {/* Booking Status */}
              <div>
                <label className="text-sm text-gray-700">Booking Status</label>
                <Controller
                  name="BookingStatus"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      placeholder="Booking Status"
                      isClearable
                      styles={employeeSelectStyles}
                      options={selectOptionBookingStatus}
                    />
                  )}
                />
              </div>

              {/* Comments */}
              <div>
                <label className={`text-sm text-gray-700 ${selectedClient ? "relative after:content-['*'] after:ml-1 after:text-red-500" : ""}`}>Comments</label>
                <textarea
                  className="w-full px-3 py-[8px] border outline-none border-orange-400 rounded-md focus:ring-2 focus:ring-orange-300"
                  {...register("Comments")}
                />
                {errors.Comments && <p className="text-red-500 text-sm mt-1">{errors.Comments.message}</p>}
              </div>

              {selectedClient && (
                <div className="md:col-span-3 sm:col-span-2 col-span-1">
                  <label className="text-sm text-gray-700">Work Logs</label>
                  <textarea
                    disabled
                    className="w-full px-3 py-[8px] border outline-none rounded-md focus:ring-2 focus:ring-orange-300"
                    {...register("WorkLogs")}
                  />
                </div>
              )}
            </div>

            <div className="flex justify-center items-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`mt-5 px-4 py-2 rounded-md text-[16px] text-white ${isSubmitting ? "bg-orange-300 cursor-not-allowed" : "bg-orange-500 hover:bg-orange-600"}`}
              >
                {isSubmitting ? (
                  <div className="flex justify-center items-center gap-2">
                    <LoaderPage />
                    {selectedClient ? "Updating..." : "Submitting..."}
                  </div>
                ) : selectedClient ? "Update" : "Submit"}
              </button>

              <p onClick={handleCancel} className="mt-5 px-4 py-2 rounded-md text-[16px] cursor-pointer text-black">
                Cancel
              </p>
            </div>
          </form>
        ) : null}
      </div>
    </div>


  );
}

export default ClientLeads;