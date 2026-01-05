
import React, { useState, useCallback, memo, useEffect, useRef } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import Select from "react-select";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import ConfirmationModel from './ConfirmationModel';
import { useAddBooking, useEmployeeDetails, usePropertyData, usePropertySheetData, useTempPropertySheetData } from './services';
import LoaderPage from './LoaderPage';
import { SECRET_KEY } from '../../Config';
import CryptoJS from 'crypto-js';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";



// Memoized Select Component to prevent unnecessary re-renders
const MemoizedSelect = memo(({ field, options, placeholder, isDisabled, onChange, styles }) => (
  <Select
    {...field}
    value={options?.find((opt) => opt.value === (field.value?.value || field.value))}
    isDisabled={isDisabled}
    options={options}
    placeholder={placeholder}
    styles={styles}
    onChange={onChange}
  />
));

// Memoized Property Form Section
const PropertyFormSection = memo(({
  titlePrefix,
  control,
  errors,
  singleSheetData,
  singleTempSheetData,
  isPropertySheetData,
  isTempPropertySheetData,
  handleTempPropertyCodeChange,
  selectedBedNumber,
  tempSelectedBedNumber,
  handlePropertyCodeChange,
  handleBedNoChange,
  handleTempBedNoChange,
  activeTab,
  register,
  setValue,
  propertyList,
  employeeSelectStyles,
  MONTH_SHORT_NAMES
}) => {
  const inputClass = 'w-full px-3 py-2 mt-1 border-2 border-orange-200 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400';

  const renderError = (field) =>
    errors[field] && <p className="text-red-500 text-sm mt-1">{errors[field]?.message}</p>;

  // Use useWatch for better performance
  const watchStartDate = useWatch({
    control,
    name: `${titlePrefix}BedDOJ`,
  });
  const watchEndDate = useWatch({
    control,
    name: `${titlePrefix}BedLDt`,
  });

  const watchMonthlyRent = useWatch({
    control,
    name: `${titlePrefix}BedMonthlyFixRent`,
  });
  // Auto-calculate Rent Amount with useCallback to prevent recreation
  useEffect(() => {
    if (watchStartDate && watchMonthlyRent) {
      const start = new Date(watchStartDate);
      const end = watchEndDate ? new Date(watchEndDate) : null;

      // Normalize time
      start.setHours(0, 0, 0, 0);
      if (end) end.setHours(0, 0, 0, 0);

      if (isNaN(start.getTime())) {
        setValue(`${titlePrefix}BedRentAmt`, "");
        return;
      }

      const dailyRent = parseFloat(watchMonthlyRent) / 30;
      let totalRent = 0;

      // Custom function to calculate days with 31-day months changed to 30
      // const getCustomDiffDays = (startDate, endDate) => {

      //   // const perDayRent = watchMonthlyRent / 30;

      //   // let rentAmount = 0;
      //   // let rentCalculationStartDate = doj;
      //   // // get month end full date here 
      //   // let rentCalculationLastDate = new Date(doj.getFullYear(), doj.getMonth() + 1, 0);
      //   // let rentCalulatedUpToDate = doj;

      //   // // do {


      //   let current = new Date(startDate);
      //   let totalDays = 0;


      //   while (current <= endDate) {
      //     const year = current.getFullYear();
      //     const month = current.getMonth();
      //     const daysInMonth = new Date(year, month + 1, 0).getDate();
      //     const isFullMonth = current.getDate() === 1 && (new Date(year, month, daysInMonth).getTime() <= endDate.getTime());
      //     if (isFullMonth) {
      //       totalDays += Math.min(30, daysInMonth);
      //       current.setMonth(current.getMonth() + 1);
      //       current.setDate(1);
      //     } else {
      //       totalDays += 1;
      //       current.setDate(current.getDate() + 1);
      //     }
      //   }
      //   // console.log(11111111111, totalDays)
      //   return totalDays;
      // };




      // new code 
      if (end && !isNaN(end.getTime())) {
        // ✅ Case: start to actual end date (inclusive)
        // Always assume each month = 30 days
        const startDay = start.getDate();
        const endDay = end.getDate();
        const monthDiff = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());

        // Days difference assuming 30 days per month
        const diffDays = monthDiff * 30 + (endDay - startDay + 1);
        totalRent = Math.round(dailyRent * diffDays);

      } else {
        // ✅ Case: No end date — assume 30-day month
        const startDay = start.getDate();
        const remainingDays = 30 - startDay + 1; // include start day
        totalRent = Math.round(dailyRent * remainingDays);
      }


      setValue(`${titlePrefix}BedRentAmt`, totalRent);
    } else {
      setValue(`${titlePrefix}BedRentAmt`, "");
    }
  }, [watchStartDate, watchEndDate, watchMonthlyRent, setValue, titlePrefix]);



  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {/* Property Code */}
      {activeTab !== "temporary" && (
        <div className='lg:grid grid-cols-3'>
          <div className=''>
            <label className="block mt-[7px] text-sm font-medium text-gray-700 after:content-['*'] after:ml-1 after:text-red-500">Select Month</label>
            <Controller
              name="selectedPermMonth"
              control={control}
              rules={{ required: "Please select a month" }}
              render={({ field }) => {
                // FIX: Convert "Dec2024" back to a Date object safely
                let selectedDate = null;

                if (field.value) {
                  const monthStr = field.value.slice(0, 3); // "Dec"
                  const yearStr = field.value.slice(3);     // "2024"

                  const monthIndex = MONTH_SHORT_NAMES.indexOf(monthStr);

                  if (monthIndex !== -1) {
                    selectedDate = new Date(Number(yearStr), monthIndex, 1);
                  }
                }

                return (
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date) => {
                      if (!date) return field.onChange("");

                      const month = MONTH_SHORT_NAMES[date.getMonth()];
                      const year = date.getFullYear();
                      const formatted = `${month}${year}`;

                      field.onChange(formatted);
                    }}
                    dateFormat="MMM yyyy"
                    showMonthYearPicker
                    placeholderText="Select month"
                    className=" border-2 focus:ring-1 w-32 focus:ring-orange-300 px-3 py-2 border-orange-300 outline-none rounded-md"
                  />
                );
              }}
            />
          </div>

          <div className='col-span-2'>
            <label className="block text-sm font-medium text-gray-700 after:content-['*'] after:ml-1 after:text-red-500">Property Code</label>
            <Controller
              name={`${titlePrefix}PropCode`}
              control={control}
              defaultValue={null}
              render={({ field }) => {
                const options = propertyList?.data?.map((item) => ({
                  value: `${item["PG Main  Sheet ID"]},${item["Bed Count"]},${item["Property Code"]}`,
                  label: item["Property Code"],
                })) || [];

                return (
                  <MemoizedSelect
                    field={field}
                    options={options}
                    placeholder="Search & Select"
                    styles={employeeSelectStyles}
                    onChange={(selectedOption) => {
                      field.onChange(selectedOption);
                      handlePropertyCodeChange(
                        { target: { value: selectedOption?.value || "" } },
                        titlePrefix
                      );
                    }}
                  />
                );
              }}
            />
            {renderError(`${titlePrefix}PropCode`)}
          </div>


        </div>
      )}

      
      {activeTab == "temporary" && (
        <div className='lg:grid grid-cols-3'>
          <div>
            <label className="block mt-[7px] text-sm font-medium text-gray-700 after:content-['*'] after:ml-1 after:text-red-500">Select Month</label>
            <Controller
              name="selectedTempMonth"
              control={control}
              rules={{ required: "Please select a month" }}
              render={({ field }) => {
                // FIX: Convert "Dec2024" back to a Date object safely
                let selectedDate = null;

                if (field.value) {
                  const monthStr = field.value.slice(0, 3); // "Dec"
                  const yearStr = field.value.slice(3);     // "2024"

                  const monthIndex = MONTH_SHORT_NAMES.indexOf(monthStr);

                  if (monthIndex !== -1) {
                    selectedDate = new Date(Number(yearStr), monthIndex, 1);
                  }
                }

                return (
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date) => {
                      if (!date) return field.onChange("");

                      const month = MONTH_SHORT_NAMES[date.getMonth()];
                      const year = date.getFullYear();
                      const formatted = `${month}${year}`;

                      field.onChange(formatted);
                    }}
                    dateFormat="MMM yyyy"
                    showMonthYearPicker
                    placeholderText="Select month"
                    className="border-2 focus:ring-1 w-32 focus:ring-orange-300 px-3 py-2 border-orange-300 outline-none rounded-md"
                  />
                );
              }}
            />
          </div>


          <div className='col-span-2'>
            <label className="block text-sm font-medium text-gray-700 after:content-['*'] after:ml-1 after:text-red-500"> Temp Property Code</label>
            <Controller
              name={`TempPropCode`}
              control={control}
              defaultValue={null}
              render={({ field }) => {
                const options = propertyList?.data?.map((item) => ({
                  value: `${item["PG Main  Sheet ID"]},${item["Bed Count"]},${item["Property Code"]}`,
                  label: item["Property Code"],
                })) || [];

                return (
                  <MemoizedSelect
                    field={field}
                    options={options}
                    placeholder="Search & Select "
                    styles={employeeSelectStyles}
                    onChange={(selectedOption) => {
                      field.onChange(selectedOption);
                      handleTempPropertyCodeChange(
                        { target: { value: selectedOption?.value || "" } },
                        titlePrefix
                      );
                    }}
                  />
                );
              }}
            />
            {renderError(`${titlePrefix}PropCode`)}

          </div>
          
        </div>
      )}


      {/* Bed No */}
      {activeTab == "permanent" && (
        <div className="relative mt-[-5px]">
          <label className="text-sm font-medium text-gray-700 relative after:content-['*'] after:ml-1 after:text-red-500">
            Bed No
          </label>

          {isPropertySheetData && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 z-10 rounded">
              <LoaderPage />
            </div>
          )}

          <Controller
            name={`PermBedNo`}
            control={control}
            defaultValue={
              tempSelectedBedNumber
                ? { value: tempSelectedBedNumber, label: String(tempSelectedBedNumber) }
                : null
            }
            render={({ field }) => {
              const options = isPropertySheetData
                ? []
                : singleSheetData?.data?.length > 0
                  ? singleSheetData.data.map((ele) => ({
                    value: ele.BedNo,
                    label: ele.BedNo,
                  }))
                  : [{ value: "", label: "No beds available", isDisabled: true }];

              return (
                <MemoizedSelect
                  field={field}
                  options={options}
                  isDisabled={isPropertySheetData}
                  placeholder="Search & Select Bed No"
                  styles={employeeSelectStyles}
                  onChange={(selectedOption) => {
                    field.onChange(selectedOption);
                    handleBedNoChange(
                      { target: { value: selectedOption?.value || "" } },
                      titlePrefix
                    );
                  }}
                />
              );
            }}
          />
          {renderError(`${titlePrefix}BedNo`)}
        </div>
      )}

      {activeTab == "temporary" && (
        <div className="relative mt-[-5px]">
          <label className="text-sm font-medium text-gray-700 relative after:content-['*'] after:ml-1 after:text-red-500">
            Bed No
          </label>

          {isTempPropertySheetData && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 z-10 rounded">
              <LoaderPage />
            </div>
          )}

          <Controller
            name={`TempBedNo`}
            control={control}
            defaultValue={
              selectedBedNumber
                ? { value: selectedBedNumber, label: String(selectedBedNumber) }
                : null
            }


            render={({ field }) => {
              const options = isTempPropertySheetData
                ? []
                : singleTempSheetData?.data?.length > 0
                  ? singleTempSheetData.data.map((ele) => ({
                    value: ele.BedNo,
                    label: ele.BedNo,
                  }))
                  : [{ value: "", label: "No beds available", isDisabled: true }];

              return (
                <MemoizedSelect
                  field={field}
                  options={options}
                  isDisabled={isTempPropertySheetData}
                  placeholder="Search & Select Bed No"
                  styles={employeeSelectStyles}
                  onChange={(selectedOption) => {
                    field.onChange(selectedOption);
                    handleTempBedNoChange(
                      { target: { value: selectedOption?.value || "" } },
                      titlePrefix
                    );
                  }}
                />
              );
            }}
          />
          {renderError(`${titlePrefix}BedNo`)}
        </div>
      )}

      {/* Room No */}
      <div>
        <label className="block text-sm font-medium text-gray-700 after:content-['*'] after:ml-1 after:text-red-500">Room No</label>
        <input
          type='text'
          {...register(`${titlePrefix}RoomNo`)}
          disabled
          className={inputClass}
        />
        {renderError(`${titlePrefix}RoomNo`)}
      </div>

      {/* AC / Non AC */}
      <div>
        <label className="block text-sm font-medium text-gray-700 after:content-['*'] after:ml-1 after:text-red-500"> AC / Non AC</label>
        <input
          type="text"
          {...register(`${titlePrefix}ACRoom`)}
          disabled
          className={inputClass}
        />
        {renderError(`${titlePrefix}ACRoom`)}
      </div>

      {/* Monthly Fixed Rent */}
      <div>
        <label className="block text-sm font-medium text-gray-700 after:content-['*'] after:ml-1 after:text-red-500"> Monthly Fixed Rent ( ₹ )</label>
        <input
          type="number"
          {...register(`${titlePrefix}BedMonthlyFixRent`)}
          disabled
          className={inputClass}
        />
        {renderError(`${titlePrefix}BedMonthlyFixRent`)}
      </div>

      {/* Deposit Amount (only for permanent) */}
      {activeTab !== "temporary" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 after:content-['*'] after:ml-1 after:text-red-500"> Deposit Amount ( ₹ )</label>
          <input
            type="number"
            {...register(`${titlePrefix}BedDepositAmt`)}
            disabled
            className={inputClass}
          />
          {renderError(`${titlePrefix}BedDepositAmt`)}
        </div>
      )}

      {/* Client DOJ */}
      <div>
        <label className="block text-sm font-medium text-gray-700 after:content-['*'] after:ml-1 after:text-red-500">Client DOJ</label>
        <input
          type="date"
          {...register(`${titlePrefix}BedDOJ`)}
          className={inputClass}
        />
        {renderError(`${titlePrefix}BedDOJ`)}
      </div>

      {/* Client Last Date */}
      {activeTab === "temporary" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 after:content-['*'] after:ml-1 after:text-red-500">Client Last Date </label>
          <input
            type="date"
            {...register(`${titlePrefix}BedLDt`)}
            className={inputClass}
          />
          {renderError(`${titlePrefix}BedLDt`)}
        </div>
      )}

      {/* Optional Client Last Date for permanent */}
      {activeTab === "permanent" && (
        <div>
          <label>Client Last Date (Optional)</label>
          <input
            type="date"
            {...register(`${titlePrefix}BedLDt`)}
            className={inputClass}
          />
          {renderError(`${titlePrefix}BedLDt`)}
        </div>
      )}

      {/* Rent Amount */}
      <div>
        <label className="block text-sm font-medium text-gray-700 after:content-['*'] after:ml-1 after:text-red-500"> Rent Amount As Per Client DOJ ( ₹ )</label>
        <input
          type="number"
          {...register(`${titlePrefix}BedRentAmt`)}
          className={inputClass}
          disabled={true}
        />
        {renderError(`${titlePrefix}BedRentAmt`)}
      </div>

      {/* Processing Fees (only for permanent) */}
      {activeTab !== "temporary" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 after:content-['*'] after:ml-1 after:text-red-500">Processing Fees ( ₹ )</label>
          <input
            type="text"
            {...register(`ProcessingFeesAmt`)}
            className={inputClass}
          />
          {renderError(`ProcessingFeesAmt`)}
        </div>
      )}

      {/* Upcoming Rent Hike Date (only for permanent) */}
      {activeTab !== "temporary" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 after:content-['*'] after:ml-1 after:text-red-500">Upcoming Rent Hike Date</label>
          <input
            type="text"
            {...register(`${titlePrefix}UpcomingRentHikeDt`)}
            disabled
            className={inputClass}
          />
          {renderError(`${titlePrefix}UpcomingRentHikeDt`)}
        </div>
      )}

      {/* Upcoming Rent Hike Amount */}
      {activeTab !== "temporary" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 after:content-['*'] after:ml-1 after:text-red-500">Upcoming Rent Hike Ammount ( ₹ )</label>
          <input
            type="text"
            {...register(`${titlePrefix}UpcomingRentHikeAmt`)}
            className={inputClass}
            disabled
          />
          {renderError(`${titlePrefix}UpcomingRentHikeAmt`)}
        </div>
      )}






      {/* Comments */}
      <div>
        <label>Comments</label>
        <textarea
          type="text"
          {...register(`${titlePrefix}Comments`)}
          className={inputClass}
        />
        {renderError(`${titlePrefix}Comments`)}
      </div>
    </div>
  );
});

const NewBooking = () => {
  const [showPermanent, setShowPermanent] = useState(true);
  const [showtemporary, setShowtemporary] = useState(false);
  const [activeTab, setActiveTab] = useState('permanent');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [formPreviewData, setFormPreviewData] = useState(null);
  const [selectedSheetId, setSelctedSheetId] = useState(null);
  const [selectedTempSheetId, setSelctedTempSheetId] = useState(null);
  const [selectedBedNumber, setSelectedBedNumber] = useState(null);
  const [tempSelectedBedNumber, settempSelectedBedNumber] = useState(null);
  const [permanentPropertyFilledChecked, setPermanentPropertyFilledChecked] = useState()
  const [applyPermBedRent, setApplyPermBedRent] = useState(true);
  const decryptedUserRef = useRef(null);

  useEffect(() => {
    const encrypted = localStorage.getItem("user");
    const decrypted = decryptUser(encrypted);
    decryptedUserRef.current = decrypted;
  }, []);

  // 🧩 Decryption Function
  const decryptUser = (encryptedData) => {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decrypted);
    } catch (error) {
      console.error("❌ Failed to decrypt user:", error);
      return null;
    }
  };

  // Validation schema
  const schema = yup.object().shape({
    // Date: yup.date().required('Date is required'),
    ClientFullName: yup.string().required('Client name is required'),
    EmailId: yup
      .string()
      .email('Please enter a valid email address')
      .required('Email Id is required'),

    AskForBAOrFA: yup.string().required('Ask For BA Or FA name is required'),
    WhatsAppNo: yup
      .string()
      .matches(/^[0-9]{10}$/, 'Enter valid 10-digit WhatsApp number')
      .required('WhatsApp number is required'),
    CallingNo: yup
      .string()
      .matches(/^[0-9]{10}$/, 'Enter valid 10-digit calling number')
      .required('Calling number is required'),
    EmgyCont1FullName: yup.string().required('Emergency Contact1 Full Name is required'),
    EmgyCont1No: yup
      .string()
      .matches(/^[0-9]{10}$/, 'Enter valid 10-digit contact number'),
    EmgyCont2FullName: yup.string().required('Emergency Contact2 Full Name is required'),
    EmgyCont2No: yup
      .string()
      .matches(/^[0-9]{10}$/, 'Enter valid 10-digit contact number'),

    // Permanent
    PermPropCode: yup.string().when('$showPermanent', {
      is: true,
      then: schema => schema.required('Property code is required'),
      otherwise: schema => schema,
    }),
    PermBedNo: yup.string().when('$showPermanent', {
      is: true,
      then: schema => schema.required('Bed number is required'),
      otherwise: schema => schema,
    }),
    PermBedDOJ: yup.string().when('$showPermanent', {
      is: true,
      then: schema => schema.required('Rent start date is required'),
      otherwise: schema => schema,
    }),
    PermBedRentAmt: yup.number().when('$showPermanent', {
      is: true,
      then: schema => schema.required('Rent amount is required'),
      otherwise: schema => schema,
    }),
    ProcessingFeesAmt: yup.number().when('$showPermanent', {
      is: true,
      then: schema => schema.required('Processing fee is required'),
      otherwise: schema => schema,
    }),
    // PermUpcomingRentHikeDt: yup.date().when('$showPermanent', {
    //   is: true,
    //   then: schema => schema.required('Revision date is required'),
    //   otherwise: schema => schema,
    // }),

    // temporary
    TempPropCode: yup.string().when('$showtemporary', {
      is: true,
      then: schema => schema.required('Property code is required'),
      otherwise: schema => schema,
    }),
    TempBedNo: yup.string().when('$showtemporary', {
      is: true,
      then: schema => schema.required('Bed number is required'),
      otherwise: schema => schema,
    }),

    TempRoomNo: yup.string().when('$showtemporary', {
      is: true,
      then: schema => schema.required('Room number is required'),
      otherwise: schema => schema,
    }), AskForBAOrFA: yup.string().required('Ask For BA Or FA name is required'),

    TempBedRentAmt: yup.string().when('$showtemporary', {
      is: true,
      then: schema => schema.required('Rent amount is required'),
      otherwise: schema => schema,
    }),
  });





  const MONTH_SHORT_NAMES = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const getPreviousMonthFormatted = () => {
    const date = new Date();
    date.setMonth(date.getMonth()); // go to previous month
    const month = MONTH_SHORT_NAMES[date.getMonth()];
    const year = date.getFullYear();
    return `${month}${year}`; // format like "Nov2025"
  };


  const {
    register,
    handleSubmit,
    setValue,
    resetField,
    reset,
    control,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    context: { showPermanent, showtemporary },
    defaultValues: {
      selectedPermMonth: getPreviousMonthFormatted(),  // previous month as default
      selectedTempMonth: getPreviousMonthFormatted(),  // previous month as default
    },
  });

  const selectedPerm = watch("selectedPermMonth") || ""
  const selectedTemp = watch("selectedTempMonth") || ""

  const { mutate: submitBooking, isPending, isSuccess } = useAddBooking();
  const { data: propertyList, isLoading: isPropertyLoading } = usePropertyData();
  const { data: EmployeeDetails } = useEmployeeDetails();
  const { data: singleSheetData, isLoading: isPropertySheetData } = usePropertySheetData(selectedSheetId , selectedPerm);
  const { data: singleTempSheetData, isLoading: isTempPropertySheetData } = useTempPropertySheetData(selectedTempSheetId ,selectedTemp);

  const formData = watch();

  useEffect(() => {
    if (!formData) return;

    const permCount = Object.entries(formData)
      .filter(([key, value]) =>
        key.startsWith("Perm") &&
        value !== null &&
        value !== undefined &&
        String(value).trim() !== ""
      ).length;
    setPermanentPropertyFilledChecked(permCount)
  }, [formData]);




  // Memoized handlers to prevent recreation on each render
  const resetTabFields = useCallback((prefix) => {
    const fieldsToReset = [
      "PropCode",
      "BedNo",
      "RoomNo",
      "ACRoom",
      "BedMonthlyFixRent",
      "BedDepositAmt",
      "BedDOJ",
      "BedLDt",
      "BedRentAmt",
      "ProcessingFeesAmt",
      "UpcomingRentHikeDt",
      "UpcomingRentHikeAmt",
      "Comments"
    ];

    fieldsToReset.forEach((field) => {
      resetField(`${prefix}${field}`);
    });

  }, [resetField]);

  const AskFor = [
    { value: "Booking_Amount", label: "Booking Amount" },
    { value: "Full_Amount", label: "Full Amount" }
  ];

  const handlePropertyCodeChange = useCallback((e, titlePrefix) => {

    const value = `${e.target.value}`;
 

    setSelctedSheetId(value);
    setValue(`${titlePrefix}PropCode`, value);
    setValue(`${titlePrefix}AcRoom`, "");
    setValue(`${titlePrefix}BedNo`, "");
    setValue(`${titlePrefix}BedRentAmt`, "");
    setValue(`${titlePrefix}roomNo`, "");
    setValue(`${titlePrefix}roomAcNonAc`, "");
    setValue(`${titlePrefix}BedMonthlyFixRent`, "");
    setValue(`${titlePrefix}BedDepositAmt`, "");
    setValue(`${titlePrefix}ProcessingFeesAmount`, "");
    setValue(`${titlePrefix}UpcomingRentHikeDt`, "");
    setValue(`${titlePrefix}RoomNo`, "");

  }, [setValue, selectedPerm]);

  const handleTempPropertyCodeChange = useCallback((e, titlePrefix) => {
    const value = `${e.target.value}`;
    setSelctedTempSheetId(value);


    setValue(`${titlePrefix}PropCode`, value);
    setValue(`${titlePrefix}AcRoom`, "");
    setValue(`${titlePrefix}BedNo`, "");
    setValue(`${titlePrefix}BedRentAmt`, "");
    setValue(`${titlePrefix}roomNo`, "");
    setValue(`${titlePrefix}roomAcNonAc`, "");
    setValue(`${titlePrefix}BedMonthlyFixRent`, "");
    setValue(`${titlePrefix}BedDepositAmt`, "");
    setValue(`${titlePrefix}ProcessingFeesAmount`, "");
    setValue(`${titlePrefix}UpcomingRentHikeDt`, "");
    setValue(`${titlePrefix}RoomNo`, "");
  }, [setValue, selectedTemp]);



// Handle bed number change — only updates state
const handleBedNoChange = useCallback((e) => {
  const selectedBedNo = e.target.value;
  setSelectedBedNumber(selectedBedNo);
  // settempSelectedBedNumber(selectedBedNo);
}, []);

// useEffect to update form values whenever selectedBedNumber changes
useEffect(() => {
  if (!selectedBedNumber) return;
  const matchedRow = singleSheetData?.data?.find(
    (row) => row["BedNo"]?.trim() === selectedBedNumber
  );

  if (matchedRow) {
    const acNonAc = matchedRow["ACRoom"]?.trim() || "";
    const rentAmt = matchedRow["MFR"] || "";
   
    setValue(`PermACRoom`, acNonAc);
    setValue(`PermBedNo`, selectedBedNumber);
    setValue(`PermBedMonthlyFixRent`, rentAmt);
    setValue(`PermBedDepositAmt`, matchedRow["DA"]?.trim() || "");
    setValue(`PermUpcomingRentHikeDt`, matchedRow["URHD"]?.trim() || "");
    setValue(`PermUpcomingRentHikeAmt`, matchedRow["URHA"]?.trim() || "");
    setValue(`PermRoomNo`, matchedRow["RoomNo"]?.trim() || "");
  } else {
    // reset values if no match
    setValue(`PermAcRoom`, "");
    setValue(`PermBedRentAmt`, "");
    setValue(`PermroomNo`, "");
    setValue(`PermroomAcNonAc`, "");
    setValue(`PermBedMonthlyFixRent`, "");
    setValue(`PermBedDepositAmt`, "");
    setValue(`PermUpcomingRentHikeAmt`, "");
    setValue(`PermrevisionAmount`, "");
    setValue(`PermRoomNo`, "");
    setValue(`PermBedNo`, selectedBedNumber);
  }
}, [selectedBedNumber, singleSheetData, setValue]);


  const handleTempBedNoChange = useCallback((e, titlePrefix) => {
    const selectedTempBedNo = e.target.value;
    // setSelectedBedNumber(selectedBedNo);
    settempSelectedBedNumber(selectedTempBedNo) 
  },[])

  useEffect(()=>{
      if (!tempSelectedBedNumber) return;
  const matchedRow = singleTempSheetData?.data?.find(
      (row) => row["BedNo"]?.trim() === tempSelectedBedNumber
    );

    if (matchedRow) {
      const acNonAc = matchedRow["ACRoom"]?.trim() || "";
      const rentAmt = matchedRow["MFR"] || "";

      setValue(`TempACRoom`, acNonAc);
      setValue(`TempBedNo`, tempSelectedBedNumber);
      setValue(`TempBedMonthlyFixRent`, rentAmt);
      setValue(`TempBedDepositAmt`, matchedRow["DA"]?.trim() || "");
      setValue(`TempUpcomingRentHikeDt`, matchedRow["URHD"]?.trim() || "");
      setValue(`TempUpcomingRentHikeAmt`, matchedRow["URHA"]?.trim() || "");
      setValue(`TempRoomNo`, matchedRow["RoomNo"]?.trim() || "");
    } else {
      setValue(`TempAcRoom`, "");
      setValue(`TempBedRentAmt`, "");
      setValue(`TemproomNo`, "");
      setValue(`TemproomAcNonAc`, "");
      setValue(`TempBedMonthlyFixRent`, "");
      setValue(`TempBedDepositAmt`, "");
      setValue(`TempUpcomingRentHikeAmt`, "");
      setValue(`TemprevisionAmount`, "");
      setValue(`TempRoomNo`, "");
      setValue(`TempBedNo`, tempSelectedBedNumber);
    }
  },[tempSelectedBedNumber, singleTempSheetData, setValue])
  


  const handlePermanentCheckbox = useCallback((checked) => {
    if (!checked) {
      resetTabFields("Perm");
    }
    setShowPermanent(checked);
    if (!checked && activeTab === 'permanent') {
      if (showtemporary) setActiveTab('temporary');
      else setActiveTab('');
    } else if (checked && !activeTab) {
      setActiveTab('permanent');
    }
  }, [resetTabFields, activeTab, showtemporary]);


  const handletemporaryCheckbox = useCallback((checked) => {
    if (!checked) {
      resetTabFields("Temp");
    }
    setShowtemporary(checked);
    setSelectedBedNumber("")
    if (!checked && activeTab === 'temporary') {
      if (showPermanent) setActiveTab('permanent');
      else setActiveTab('');
    } else if (checked && !activeTab) {
      setActiveTab('temporary');
    }
  }, [resetTabFields, activeTab, showPermanent]);

  const onSubmit = useCallback((data) => {
    // Always include client info

    if (!decryptedUserRef.current) {
      alert("User info not loaded yet.");
      return;
    }

    const TotalAmt =
      (applyPermBedRent ? Number(data.PermBedRentAmt || 0) : 0) +
      Number(data.PermBedDepositAmt || 0) +
      Number(data.ProcessingFeesAmt || 0) +
      Number(data.TempBedRentAmt || 0);

    const filteredData = {
      Date: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      ID: decryptedUserRef.current?.id,
      EmployeeName: decryptedUserRef.current?.name,
      ClientFullName: data.ClientFullName,
      WhatsAppNo: data.WhatsAppNo,
      CallingNo: data.CallingNo,
      EmgyCont1FullName: data.EmgyCont1FullName,
      EmgyCont1No: data.EmgyCont1No,
      EmgyCont2FullName: data.EmgyCont2FullName,
      EmgyCont2No: data.EmgyCont2No,
      AskForBAOrFA: data.AskForBAOrFA,
      EmailId: data.EmailId,
      ProcessingFeesAmt: data.ProcessingFeesAmt,
      UpcomingRentHikeDt: data.PermUpcomingRentHikeDt,
      UpcomingRentHikeAmt: data.PermUpcomingRentHikeAmt,
      TotalAmt: TotalAmt,
      BookingAmt:
        data.AskForBAOrFA === "Full_Amount "
          ? TotalAmt
          : Number(data.PermBedMonthlyFixRent),
      BalanceAmt:
        data.AskForBAOrFA === "Full_Amount "
          ? 0
          : TotalAmt - Number(data.PermBedMonthlyFixRent),
    };


    // Include ONLY active tab fields
    const dateFields = ["PermBedDOJ", "PermBedLDt", "TempBedDOJ", "TempBedLDt"];
    if (showPermanent) {
      Object.keys(data)
        .filter((key) => key.startsWith("Perm"))
        .forEach((key) => {
          if (key === "PermPropCode" && data[key]) {
            const parts = data[key].split(",");
            filteredData[key] = parts[2] || "";
          } else if (dateFields.includes(key) && data[key]) {
            const date = new Date(data[key]);
            filteredData[key] = !isNaN(date)
              ? date.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
              : data[key];
          } else {
            filteredData[key] = data[key];
          }
        });
    }

    if (showtemporary) {
      Object.keys(data)
        .filter((key) => key.startsWith("Temp"))
        .forEach((key) => {
          if (key === "TempPropCode" && data[key]) {
            const parts = data[key].split(",");
            filteredData[key] = parts[2] || "";
          } else if (dateFields.includes(key) && data[key]) {
            const date = new Date(data[key]);
            filteredData[key] = !isNaN(date)
              ? date.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
              : data[key];
          } else {
            filteredData[key] = data[key];
          }
        });
    }


    setFormPreviewData(filteredData);
    setShowConfirmModal(true);
  }, [showPermanent, showtemporary]);

  const handleFinalSubmit = useCallback(() => {
    submitBooking(formPreviewData, {
      onSuccess: () => {
        // alert("✅ Data successfully sent to Google Sheet!");
        toast.success("Data successfully sent to Google Sheet!")
        setShowConfirmModal(false);

        // Reset the entire form
        reset({
          Date: new Date().toISOString().split('T')[0],
          SalesMember: "",
          ClientFullName: "",
          WhatsAppNo: "",
          CallingNo: "",
          EmgyCont1FullName: "",
          EmgyCont1No: "",
          EmgyCont2FullName: "",
          EmgyCont2No: "",
          AskForBAOrFA: "",
          // Reset all permanent fields
          PermPropCode: "",
          PermBedNo: "",
          PermRoomNo: "",
          PermACRoom: "",
          PermBedMonthlyFixRent: "",
          PermBedDepositAmt: "",
          PermBedDOJ: "",
          PermBedLDt: "",
          PermBedRentAmt: "",
          ProcessingFeesAmt: "",
          PermUpcomingRentHikeDt: "",
          PermUpcomingRentHikeAmt: "",
          PermComments: "",
          // Reset all temporary fields
          TempPropCode: "",
          TempBedNo: "",
          TempRoomNo: "",
          TempACRoom: "",
          TempBedMonthlyFixRent: "",
          TempBedDepositAmt: "",
          TempBedDOJ: "",
          TempBedLDt: "",
          TempBedRentAmt: "",
          ProcessingFeesAmt: "",
          TempUpcomingRentHikeDt: "",
          TempUpcomingRentHikeAmt: "",
          TempComments: "",
          EmailId: "",
        });
        setValue(`SalesMemeber`, "Search & Select Employee");
        setValue(`AskForBAOrFA`, "SelectAskFor");

        // Reset checkboxes and tabs
        setShowtemporary(false);
        // setActiveTab('');
        setSelctedSheetId(null);
        setSelectedBedNumber(null);
        // window.location.reload()
      },
      onError: () => {
        // alert("❌ Failed to submit. Try again.");
        toast.error("❌ Failed to submit. Wait & Try again you have reached the limits.")
      },
    });
  }, [submitBooking, formPreviewData, reset]);

  const inputClass = 'w-full px-3 py-2 mt-1 border-2 border-orange-200 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400';

  const renderError = (field) =>
    errors[field] && <p className="text-red-500 text-sm mt-1">{errors[field]?.message}</p>;

  // Employee select styles
  const employeeSelectStyles = {
    control: (base, state) => ({
      ...base,
      width: "100%",
      paddingTop: "0.25rem",
      paddingBottom: "0.10rem",
      paddingLeft: "0.75rem",
      paddingRight: "0.50rem",
      marginTop: "0.30rem",
      borderWidth: "2px",
      borderStyle: "solid",
      borderColor: state.isFocused ? "#fb923c" : "#fdba74",
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
      "&:hover": { backgroundColor: "#fed7aa" }
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999
    })
  };

  return (
    <div className="max-w-8xl mx-auto bg-[#F8F9FB] min-h-screen">
      <div className="bg-[#F8F9FB] shadow-lg rounded-xl  p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-10 mt-20">
          {/* === CLIENT DETAILS === */}
          <section className="bg-white border border-gray-200 rounded-lg p-2 shadow-sm">
            <h3 className="text-xl font-semibold mb-4 border-b pb-2 bg-orange-300 text-black p-2 rounded-sm">Client Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { name: 'ClientFullName', label: 'Full Name' },
                { name: 'WhatsAppNo', label: 'WhatsApp No' },
                { name: 'CallingNo', label: 'Calling No', type: "number" },
                { name: 'EmgyCont1FullName', label: 'Emergency Contact1 Full Name' },
                { name: 'EmgyCont1No', label: 'Emergency Contact1 No' },
                { name: 'EmgyCont2FullName', label: 'Emergency Contact2 Full Name' },
                { name: 'EmgyCont2No', label: 'Emergency Contact2 No' },
                { name: 'EmailId', label: 'Email Id' },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-gray-700 after:content-['*'] after:ml-1 after:text-red-500"
                  >{field.label}</label>
                  <input
                    type={field.type || 'text'}
                    {...register(field.name)}
                    placeholder={`Enter ${field.label}`}
                    className={inputClass}
                  />
                  {renderError(field.name)}
                </div>
              ))}

              <div>
                <label className="block text-sm font-medium text-gray-700 after:content-['*'] after:ml-1 after:text-red-500">AskFor ₹</label>
                <Controller
                  name="AskForBAOrFA"
                  control={control}
                  defaultValue={null}
                  render={({ field }) => {
                    const options = AskFor?.map((ele) => ({
                      value: `${ele.value} `,
                      label: `${ele.label}`,
                    }));

                    return (
                      <MemoizedSelect
                        field={field}
                        options={options}
                        placeholder="Search & Select Ask For"
                        styles={employeeSelectStyles}
                        onChange={(selectedOption) => field.onChange(selectedOption ? selectedOption.value : "")}
                      />
                    );
                  }}
                />
                {renderError('AskForBAOrFA')}
              </div>
            </div>

          </section>

          {/* === CHECKBOXES === */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center ">
            {/* Permanent Property Card */}
            <label
              className={`group cursor-pointer flex items-center gap-4 w-full sm:w-80 p-4 border rounded-xl transition-all duration-300 shadow-sm
      ${showPermanent ? ' border-orange-200 ring-2 ring-orange-200' : 'bg-white hover:shadow-lg'}`}
            >
              <input
                type="checkbox"
                className="accent-orange-200 w-5 h-5"
                checked={showPermanent}
                disabled={true}
                onChange={(e) => handlePermanentCheckbox(e.target.checked)}
              />
              <span className="text-lg font-medium text-gray-800 group-hover:text-orange-600">
                Permanent Property Details
              </span>
            </label>

            {/* temporary Property Card */}


            <label
              className={`group cursor-pointer flex items-center gap-4 w-full sm:w-80 p-4 border rounded-xl transition-all duration-300 shadow-sm
      ${showtemporary ? ' border-orange-200 ring-2 ring-orange-200' : 'bg-white hover:shadow-lg'}`}
            >
              <input
                type="checkbox"
                className="accent-orange-200 w-5 h-5"
                checked={showtemporary}
                onChange={(e) => handletemporaryCheckbox(e.target.checked)}
              />
              <span className="text-lg font-medium text-gray-800 group-hover:text-orange-600">
                Temporary Property Details
              </span>
            </label>
          </div>

          {/* === TABS === */}
          {(showPermanent || showtemporary) && (
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="mb-4 border-b border-gray-300 flex space-x-4">
                {showPermanent && (
                  <button
                    type="button"
                    className={`px-4 text-[20px] md:text-[20px] py-2 ${activeTab === 'permanent' ? 'bg-orange-300 text-black rounded-t-lg' : ''
                      }`}
                    onClick={() => setActiveTab('permanent')}
                  >
                    Permanent Property Details
                  </button>
                )}
                {showtemporary && (
                  <button
                    type="button"
                    className={`px-4 text-[20px] py-2 ${activeTab === 'temporary' ? 'bg-orange-300 text-black rounded-t-lg' : ''
                      }`}
                    onClick={() => setActiveTab('temporary')}
                  >
                    Temporary Property Details
                  </button>
                )}
              </div>

              {activeTab === 'permanent' && showPermanent && (
                <PropertyFormSection
                  titlePrefix="Perm"
                  control={control}
                  errors={errors}
                  singleSheetData={singleSheetData}
                  isPropertySheetData={isPropertySheetData}
                  selectedBedNumber={selectedBedNumber}
                  handlePropertyCodeChange={handlePropertyCodeChange}
                  handleTempPropertyCodeChange={handleTempPropertyCodeChange}
                  handleBedNoChange={handleBedNoChange}
                  activeTab={activeTab}
                  register={register}
                  setValue={setValue}
                  propertyList={propertyList}
                  employeeSelectStyles={employeeSelectStyles}
                  MONTH_SHORT_NAMES={MONTH_SHORT_NAMES}
                />
              )}
              {activeTab === 'temporary' && showtemporary && (
                <PropertyFormSection
                  titlePrefix="Temp"
                  control={control}
                  errors={errors}
                  singleTempSheetData={singleTempSheetData}
                  isTempPropertySheetData={isTempPropertySheetData}
                  selectedBedNumber={selectedBedNumber}
                  handlePropertyCodeChange={handlePropertyCodeChange}
                  handleTempPropertyCodeChange={handleTempPropertyCodeChange}
                  handleTempBedNoChange={handleTempBedNoChange}
                  activeTab={activeTab}
                  register={register}
                  setValue={setValue}
                  propertyList={propertyList}
                  employeeSelectStyles={employeeSelectStyles}
                  MONTH_SHORT_NAMES={MONTH_SHORT_NAMES}


                />
              )}
            </div>
          )}


          <div className='flex px-2 justify-center'>
            <button
              type="submit"
              className="px-5 py-2 text-lg bg-orange-300 text-black rounded-lg hover:bg-orange-400 transition-all shadow-md"
            >
              Submit Booking
            </button>
          </div>

        </form>
      </div>

      <ConfirmationModel
        showConfirmModal={showConfirmModal}
        setShowConfirmModal={setShowConfirmModal}
        handleFinalSubmit={handleFinalSubmit}
        setApplyPermBedRent={setApplyPermBedRent}
        applyPermBedRent={applyPermBedRent}
        isBookingLoading={isSuccess}
        isPending={isPending}
        formPreviewData={formPreviewData}
      />
    </div>
  );
};

export default NewBooking;
