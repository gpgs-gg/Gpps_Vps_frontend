
import React, { useMemo, useState, useEffect, useRef, useCallback } from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import { useForm, Controller } from "react-hook-form";
import "react-datepicker/dist/react-datepicker.css";
import { generateWorklog, SelectStyles } from "../../Config";
import { usePropertyData } from "../NewBooking/services";
import { useCreateNotice, useMainSheetData, useUpdateMainSheetData, useUpdateNoticeList } from "./Services";
import { addMonths, subDays, format, parse, isValid } from "date-fns";
import { toast } from "react-toastify";
import LoaderPage from "../NewBooking/LoaderPage";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useApp } from "../TicketSystem/AppProvider";
import { useDynamicDetails } from "../TicketSystem/Services";


/* ================= SKELETON ================= */
const TableSkeleton = ({ columns = 6, rows = 6 }) => {

    return (
        <>
            {[...Array(rows)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                    <td className="p-2 border">
                        <div className="h-4 bg-gray-300 rounded"></div>
                    </td>
                    {[...Array(columns)].map((_, j) => (
                        <td key={j} className="p-2 border">
                            <div className="h-4 bg-gray-300 rounded"></div>
                        </td>
                    ))}
                </tr>
            ))}
        </>
    );
};

/* ================= MAIN ================= */
const schema = yup.object().shape({
    HandoverCheckListStatus: yup.object().nullable(),
    CheckListAttach: yup.mixed().when("HandoverCheckListStatus", {
        is: (val) => val?.value?.toLowerCase() === "yes",
        then: (schema) =>
            schema.test(
                "fileRequired",
                "Check List File is required",
                (value) => value && value.length > 0
            ),
        otherwise: (schema) => schema.notRequired(),
    }),

    FNFStatus: yup.object().nullable(),

    BankDetails: yup.string().when("FNFStatus", {
        is: (val) => val?.value?.toLowerCase() === "bank details received",
        then: (schema) =>
            schema
                .trim()
                .required("Bank Details is required"),
        otherwise: (schema) => schema.notRequired(),
    }),


});

const FNFForm = ({ setActiveTab, editingClient }) => {

    const MONTH_SHORT_NAMES = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const getPreviousMonthFormatted = () => {
        const date = new Date();
        const month = MONTH_SHORT_NAMES[date.getMonth()];
        const year = date.getFullYear();
        return `${month}${year}`;
    };
    const { decryptedUser } = useApp();
    // ✅ 2. useForm
    const {
        handleSubmit,
        control,
        watch,
        setValue,
        register,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            selectedMonth: getPreviousMonthFormatted(),
            NoticeReason: null,
            NoticeCancel: false,
            NoticeCancelReason: "",
        },
    });



    // ✅ 3. watch after useForm
    const HandoverCheckListStatus = watch("HandoverCheckListStatus")?.value;
    const FNFStatus = watch("FNFStatus")?.value;
    // const HandoverCheckListStatus = watch("HandoverCheckListStatus")?.value;
    const DA = watch("DA") || 0;
    const CurDueAmt = watch("CurDueAmt") || 0;
    const PreDueAmt = watch("PreDueAmt") || 0;
    const AdjEB = watch("AdjEB") || 0;
    const DeducAmt = watch("DeducAmt") || 0;

    useEffect(() => {
        const refundableAmt =
            Number(DA) -
            (
                Number(CurDueAmt) +
                Number(PreDueAmt) +
                Number(AdjEB) +
                Number(DeducAmt)
            );

        const TotalDueAmt = Math.max(
            (+CurDueAmt || 0) +
            ((+PreDueAmt || 0) > 0 ? (+PreDueAmt || 0) : 0) +
            (+AdjEB || 0) +
            (+DeducAmt || 0),
            0
        );


        setValue("FNFSettlementRefundableAmt", refundableAmt);
        setValue("TotalDueAmt", TotalDueAmt);
    }, [DA, CurDueAmt, PreDueAmt, AdjEB, DeducAmt, setValue]);

    const [search, setSearch] = useState("");
    const [selectedRows, setSelectedRows] = useState([]);
    const [warning, setWarning] = useState("");
    const [preview, setPreview] = useState(null);
    const [showWarningPopup, setShowWarningPopup] = useState(false);
    const [dateRange, setDateRange] = useState({ from: null, to: null });


    useEffect(() => {
        if (warning && warning.trim() !== "") {
            setShowWarningPopup(true);
        }
    }, [warning]);
    /* ================= PROPERTY ================= */

    const { data: propertyList, isPending: isPropertyList } = usePropertyData();
    const { data: dynamicData } = useDynamicDetails();

    const buildOptions = (key) =>
        Array.from(
            new Set(dynamicData?.data?.map((item) => item[key]).filter(Boolean))
        ).map((value) => ({
            value: value.trim(),
            label: value.trim(),
        })) || [];

    const selectOptionYesNo = buildOptions("YesNo");
    const selectOptionFNFStatus = buildOptions("FNFStatus");



    const propertyListOption = useMemo(() =>
        propertyList?.data?.map((item) => ({
            value: `${item["PG Main  Sheet ID"]}`,
            label: item["Property Code"],
        })) || [],
        [propertyList]
    );

    const propertyCode = watch("PropertyCode");
    const selectedMonth = watch("selectedMonth") || "";

    const sheetId = useMemo(() => {
        return propertyCode?.value || "";
    }, [propertyCode]);

    const combinedParam = useMemo(() => {
        if (!sheetId || !selectedMonth) return "";
        return `${sheetId},${selectedMonth}`;
    }, [sheetId, selectedMonth]);



    // API calls
    const { data: PropertyData, isLoading } = useMainSheetData(combinedParam);
    const { mutate: CreateNotice, isPending: isCreateNotice } = useCreateNotice();
    const { mutate: UpdateMainSheetData, isPending: isUpdateMainSheetData } = useUpdateMainSheetData(combinedParam);
    const { mutate: UpdateNoticeEntry, isPending: isUpdateNotice } = useUpdateNoticeList();
    const tableData = useMemo(() => {
        if (!PropertyData?.data) return [];
        return PropertyData.data.filter((ele) => ele?.ClientID === editingClient.ClientID);
    }, [PropertyData]);

    const tableColumns = useMemo(() => {
        if (!tableData.length) return [];
        return Object.keys(tableData[0]);
    }, [tableData]);

    /* ================= SEARCH ================= */

    const filteredData = useMemo(() => {
        if (!search) return tableData;
        return tableData.filter((row) =>
            Object.values(row).some((val) =>
                String(val).toLowerCase().includes(search.toLowerCase())
            )
        );
    }, [tableData, search]);

    // ..............................................................................................................
    /* ================= PARSE DATE SAFELY (memoized) ================= */
    const parseDateSafely = useMemo(() => (dateStr) => {
        if (!dateStr) return null;
        const formats = ["dd MMM yyyy", "dd-MMM-yyyy", "dd/MMM/yyyy", "yyyy-MM-dd"];
        for (let fmt of formats) {
            try {
                const d = parse(dateStr, fmt, new Date());
                if (isValid(d)) return d;
            } catch (e) { }
        }
        return null;
    }, []);

    const populatedClientIdRef = useRef(null);

    /* ================= EDITING CLIENT EFFECT ================= */
    useEffect(() => {

        /* ================= RESET ================= */
        if (!editingClient) {
            populatedClientIdRef.current = null;
            setSelectedRows([]);
            reset({
                selectedMonth: getPreviousMonthFormatted(),
                NoticeReason: null,
            });
            return;
        }

        // wait until options loaded
        if (!propertyListOption?.length) return;
        // stop only if already FULLY populated
        if (editingClient.ClientID === populatedClientIdRef.current) return;
        /* -------- Dates -------- */
        ["NSD", "NLD", "CVD"].forEach((field) => {
            if (editingClient[field]) {
                const d = parseDateSafely(editingClient[field]);
                if (d) setValue(field, d);
            }
        });

        if (editingClient.NoticeReason) {
            setValue("NoticeReason", editingClient.NoticeReason);
        }
        /* ================= PROPERTY SELECT FIX ================= */
        let propertyMatched = false;
        if (editingClient.PropCode) {
            const matchedOption = propertyListOption.find(
                (opt) =>
                    opt.label?.trim().toLowerCase() ===
                    editingClient.PropCode?.trim().toLowerCase()
            );

            if (matchedOption) {
                setValue("PropertyCode", matchedOption);
                propertyMatched = true;
            }
        }
        /* -------- Month -------- */
        if (editingClient.NSD) {
            const d = parseDateSafely(editingClient.NSD);
            if (d && isValid(d)) {
                const month = MONTH_SHORT_NAMES[d.getMonth()];
                setValue("selectedMonth", `${month}${d.getFullYear()}`);
            }
        } else if (editingClient.Month) {
            setValue("selectedMonth", editingClient.Month);
        }

        /* ✅ MARK POPULATED ONLY AFTER SUCCESS */
        if (propertyMatched) {
            populatedClientIdRef.current = editingClient.ClientID;
        }

    }, [
        editingClient,
        propertyListOption,
        setValue,
        reset,
        parseDateSafely,
        tableData
    ]);



    useEffect(() => {
        if (tableData?.length) {
            setValue("ClientID", tableData[0].ClientID);
            setValue("FullName", tableData[0].FullName);
            setValue("RoomNo", tableData[0].RoomNo);
            setValue("BedNo", tableData[0].BedNo);
            setValue("RentDOJ", tableData[0].RentDOJ);
            setValue("MFR", tableData[0].MFR);
            setValue("DA", tableData[0].DA);
            setValue("EBAmt", tableData[0].EBAmt);
            setValue("CurDueAmt", tableData[0].CurDueAmt);
            setValue("PreDueAmt", tableData[0].PreDueAmt);
            setValue("RentAmt", tableData[0].RentAmt);

        }
    }, [tableData, setValue]);





    /* ================= FIND CLIENT IN CURRENT DATA ================= */
    useEffect(() => {
        if (editingClient && tableData.length > 0) {
            const foundClient = tableData.find(row => row.ClientID === editingClient.ClientID);
            if (foundClient) {
                // Only update if the found client is not already selected
                setSelectedRows(prev => {
                    if (prev.length === 1 && prev[0]?.ClientID === foundClient.ClientID) {
                        return prev; // already selected
                    }
                    return [foundClient];
                });
                setWarning("");
            } else {
                setSelectedRows([]);
                setWarning("⚠The client you are editing is not found in the current property/month data. Please adjust property/month or cancel edit.");
            }
        }
    }, [tableData, editingClient]);

    // ..............................................................................................................

    const handleRowSelect = useCallback((row) => {
        if (editingClient) {
            if (row.ClientID === editingClient.ClientID) {
                toast.info("Editing mode: selection cannot be changed.");
            }
            return;
        }
        const selectedName = (row.FullName || "").trim().toLowerCase();
        const sameNameCount = tableData.filter(
            (r) => (r.FullName || "").trim().toLowerCase() === selectedName
        ).length;
        if (sameNameCount > 1) {
            setWarning(`${row.FullName} appears ${sameNameCount} times. Please confirm correct client.`);
        }

        setSelectedRows((prev) => {
            const exists = prev.includes(row);
            return exists ? prev.filter((item) => item !== row) : [...prev, row];
        });
    }, [editingClient, tableData]);

    const handleSelectAll = useCallback((checked) => {
        if (editingClient) {
            toast.info("Editing mode: select all is disabled.");
            return;
        }
        setSelectedRows(checked ? filteredData : []);
    }, [editingClient, filteredData]);


    const onSubmit = useCallback((formData) => {

        const fieldsCheck = {
            "Main PG Sheet Updated": formData.PGMainSheetUpdated?.value === "Yes",
            "Removed From WhatsApp":
                formData.RemovedFromWhatsAppGrp?.value === "yes",
            "Deactivated The Client":
                formData.DeactivatedTheClient?.value === "Yes",
        };

        const pendingFields = Object.entries(fieldsCheck)
            .filter(([_, isCompleted]) => !isCompleted)
            .map(([name]) => name);

        // Closed validation
        if (formData?.FNFStatus?.value === "Closed" && pendingFields.length > 0) {
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


        const payload = {
            /* Checklist */
            HandoverCheckListStatus: formData.HandoverCheckListStatus?.value || "",
            CheckListAttach: formData.CheckListAttach?.[0] || null,

            /* Settlement */
            AdjEB: formData.AdjEB || 0,
            DeducAmt: formData.DeducAmt || 0,
            AdjAmt: formData.DeducAmt || 0,
            DeducAmtComment: formData.DeducAmtComment || "",
            TotalDueAmt: formData.TotalDueAmt || "",
            FNFSettlementRefundableAmt: formData.FNFSettlementRefundableAmt || "",
            BankDetails: formData.BankDetails || "",
            ToRcvedAmt: formData.DA - formData.FNFSettlementRefundableAmt || "",

            /* Other */
            PGMainSheetUpdated: formData.PGMainSheetUpdated?.value || "",
            RemovedFromWhatsAppGrp: formData.RemovedFromWhatsAppGrp?.value || "",
            DeactivatedTheClient: formData.DeactivatedTheClient?.value || "",
            FNFStatus: formData.FNFStatus?.value || (editingClient ? editingClient.FNFStatus : "Open"),

            ClientID: editingClient
                ? [editingClient.ClientID]
                : selectedRows.map((row) => row.ClientID),
        };

        console.log("payload", formData.DA)
        /* ===== UPDATE MODE ===== */
        if (editingClient) {

            UpdateNoticeEntry(
                {
                    ...payload,
                    TicketNo: editingClient.TicketNo,
                },
                {
                    onSuccess: () => {
                        toast.success("Notice updated successfully!");

                        UpdateMainSheetData(
                            { sheetId, data: payload },
                            {
                                onSuccess: () => {
                                    toast.success("Main Sheet Updated successfully!");
                                    reset();
                                    setActiveTab("Tab2");
                                },
                                onError: (error) => {
                                    toast.error(
                                        error?.response?.data?.message ||
                                        "Failed to update main sheet"
                                    );
                                },
                            }
                        );
                    },
                    onError: (error) => {
                        toast.error(error?.response?.data?.message || "Update failed");
                    },
                }
            );

            return;
        }


        /* ===== CREATE MODE ===== */

        if (selectedRows.length === 0) {
            toast.error("Please select at least one client.");
            return;
        }

        // CreateNotice(
        //     {
        //         ...payload,
        //         selectedRows,
        //     },
        //     {
        //         onSuccess: () => {
        //             toast.success("Notice created successfully!");
        //             reset();
        //             setActiveTab("Tab2");
        //         },
        //         onError: (error) => {
        //             toast.error(error?.response?.data?.message || "Create failed");
        //         },
        //     }
        // );

    }, [
        editingClient,
        selectedRows,
        CreateNotice,
        UpdateNoticeEntry,
        reset,
        setActiveTab
    ]);

    const handleFNFMsg = () => {

    }






    /* ================= UI ================= */

    return (
        <div>
            {/* FILTER SECTION */}
            <form onSubmit={handleSubmit(onSubmit)}>
                {/* property and Client Details  start*/}
                <div >
                    <h1 className="bg-gray-200 m-2 text-lg font-bold px-5 py-2">
                        Property & Client Details
                    </h1>

                    <div className="grid md:grid-cols-6 sm:grid-cols-2 grid-cols-1 gap-5 p-3">


                        {/* MONTH */}
                        <div>
                            <label className="text-sm font-medium text-gray-600">Select Month</label>
                            <Controller
                                name="selectedMonth"
                                control={control}
                                render={({ field }) => {
                                    let selectedDate = null;
                                    if (field.value) {
                                        const monthStr = field.value.slice(0, 3);
                                        const yearStr = field.value.slice(3);
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
                                                field.onChange(`${month}${year}`);
                                            }}
                                            dateFormat="MMM yyyy"
                                            showMonthYearPicker
                                            isClearable
                                            placeholderText="Select month"
                                            wrapperClassName="w-full"
                                            className="border w-full px-3 py-2 border-orange-500 rounded-md outline-none"
                                        />
                                    );
                                }}
                            />
                        </div>

                        <div>
                            <label className="text-sm text-gray-700">Property Code</label>

                            {isPropertyList ? (
                                /* ---------- LOADER ---------- */
                                <div className="h-[38px] flex items-center px-3 border rounded-md bg-gray-50">
                                    <span className="text-sm text-gray-500 flex justify-center items-center gap-2 animate-pulse">
                                        <LoaderPage /> Loading properties...
                                    </span>
                                </div>
                            ) : (
                                /* ---------- SELECT ---------- */
                                <Controller
                                    name="PropertyCode"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            placeholder="Select Property"
                                            isClearable
                                            isDisabled
                                            styles={SelectStyles}
                                            options={propertyListOption}
                                        />
                                    )}
                                />
                            )}
                        </div>

                        <div className="flex flex-col justify-end">
                            <label className="text-sm text-gray-700">Client ID</label>
                            <input
                                {...register("ClientID")}
                                placeholder="ClientID"
                                disabled
                                className="border border-orange-500 px-3 py-2 rounded-md w-full outline-none"
                            />
                        </div>
                        <div className="flex flex-col justify-end">
                            <label className="text-sm text-gray-700">Full Name</label>
                            <input
                                {...register("FullName")}
                                placeholder="FullName"
                                disabled
                                className="border border-orange-500 px-3 py-2 rounded-md w-full outline-none"
                            />
                        </div>
                        <div className="flex flex-col justify-end">
                            <label className="text-sm text-gray-700">Room No</label>
                            <input
                                {...register("RoomNo")}
                                placeholder="RoomNo"
                                disabled
                                className="border border-orange-500 px-3 py-2 rounded-md w-full outline-none"
                            />
                        </div>
                        <div className="flex flex-col justify-end">
                            <label className="text-sm text-gray-700">Bed No</label>
                            <input
                                {...register("BedNo")}
                                placeholder="BedNo"
                                disabled
                                className="border border-orange-500 px-3 py-2 rounded-md w-full outline-none"
                            />
                        </div>
                        <div className="flex flex-col justify-end">
                            <label className="text-sm text-gray-700">DOJ</label>
                            <input
                                {...register("RentDOJ")}
                                placeholder="RentDOJ"
                                disabled
                                className="border border-orange-500 px-3 py-2 rounded-md w-full outline-none"
                            />
                        </div>
                        <div>
                            <label className="text-sm text-gray-700 after:content-['*'] after:ml-1 after:text-red-500">
                                Notice Start Date
                            </label>

                            <Controller
                                name="NSD"
                                control={control}
                                render={({ field }) => (
                                    <DatePicker
                                        selected={field.value ? new Date(field.value) : null}
                                        onChange={(date) => {
                                            field.onChange(date);

                                            if (date) {
                                                const nextMonth = addMonths(date, 1);
                                                const lastDate = subDays(nextMonth, 1);

                                                setValue("NLD", lastDate, {
                                                    shouldValidate: true,
                                                    shouldDirty: true
                                                });

                                                setValue("CVD", lastDate, {
                                                    shouldValidate: true,
                                                    shouldDirty: true
                                                });
                                            }
                                        }}
                                        dateFormat="dd MMM yyyy"
                                        placeholderText="Select Start Date"
                                        wrapperClassName="w-full"
                                        disabled
                                        className="border w-full px-3 py-2 border-orange-500 rounded-md outline-none"
                                    />
                                )}
                            />

                            {errors.NSD && (
                                <p className="text-red-500 text-sm">{errors.NSD.message}</p>
                            )}
                        </div>
                        <div>
                            <label className="text-sm text-gray-700 after:content-['*'] after:ml-1 after:text-red-500">Notice Last Date</label>
                            <Controller
                                name="NLD"
                                control={control}
                                isDisabled
                                render={({ field }) => (
                                    <DatePicker
                                        selected={field.value ? new Date(field.value) : null}
                                        onChange={(date) => field.onChange(date)}
                                        dateFormat="d MMM yyyy"
                                        placeholderText="Select Last Date"
                                        wrapperClassName="w-full"
                                        disabled
                                        className="border w-full px-3 py-2 border-orange-500 rounded-md outline-none"
                                    />
                                )}
                            />
                            {errors.NLD && <p className="text-red-500 text-sm">{errors.NLD.message}</p>}
                        </div>
                        <div>
                            <label className="text-sm text-gray-700 after:content-['*'] after:ml-1 after:text-red-500">Client Vacating Date</label>
                            <Controller
                                name="CVD"
                                control={control}
                                render={({ field }) => (
                                    <DatePicker
                                        selected={field.value ? new Date(field.value) : null}
                                        onChange={field.onChange}
                                        dateFormat="d MMM yyyy"
                                        placeholderText="Select Vacating Date"
                                        wrapperClassName="w-full"
                                        disabled
                                        className="border w-full px-3 py-2 border-orange-500 rounded-md outline-none"
                                    />
                                )}
                            />
                            {errors.CVD && <p className="text-red-500 text-sm">{errors.CVD.message}</p>}
                        </div>
                        <div>
                            <label className="text-sm text-gray-700">Handover Check List & Status</label>
                            <Controller
                                name="HandoverCheckListStatus"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        placeholder="CheckListStatus"
                                        isClearable
                                        styles={SelectStyles}
                                        options={selectOptionYesNo}
                                    />
                                )}
                            />

                        </div>

                        {HandoverCheckListStatus?.toLowerCase()?.trim() === "yes" && (
                            <div className="flex flex-col gap-2">
                                <label className="text-sm text-gray-700">Check List Attach</label>

                                <div className="flex items-center gap-3">
                                    <input
                                        type="file"
                                        {...register("CheckListAttach")}
                                        className="border border-orange-500 px-2 py-1 rounded-md w-48 outline-none text-lg"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                setPreview(URL.createObjectURL(file));
                                            }
                                        }}
                                    />

                                    {preview && (
                                        <a
                                            href={preview}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-orange-600 text-sm font-medium underline cursor-pointer"
                                        >
                                            <i class="fa-solid fa-image"></i>
                                        </a>
                                    )}
                                </div>
                                {errors.CheckListAttach && <p className="text-red-500 text-sm">{errors.CheckListAttach.message}</p>}
                            </div>
                        )}

                    </div>
                </div>
                {/* property and Client Details  end*/}

                {/* f&f settlement details start */}

                <div >
                    <h1 className="bg-gray-200 m-2 text-lg font-bold px-5 py-2">
                        F&F Settlement Details
                    </h1>

                    <div className="grid md:grid-cols-6 sm:grid-cols-2 grid-cols-1 gap-5 p-3">
                        {/* <div className="flex flex-col justify-end">
                            <label className="text-sm text-gray-700">MFR</label>
                            <input
                                {...register("MFR")}
                                placeholder="MFR"
                                disabled
                                className="border border-orange-500 px-3 py-2 rounded-md w-full outline-none"
                            />
                        </div> */}

                        <div className="flex flex-col justify-end">
                            <label className="text-sm text-gray-700">Rent Amt</label>
                            <input
                                {...register("RentAmt")}
                                placeholder="RentAmt"
                                disabled
                                className="border border-orange-500 px-3 py-2 rounded-md w-full outline-none"
                            />
                        </div>
                        <div className="flex flex-col justify-end">
                            <label className="text-sm text-gray-700">Rent Amt (Dates)</label>
                            <div className="flex h-10 items-center justify-center bg-white border border-orange-400 z-30 rounded-md shadow">
                                {/* <span className="text-sm text-orange-600 font-medium">From</span> */}
                                <DatePicker
                                    selected={dateRange.from}
                                    onChange={(date) => {
                                        setDateRange((p) => ({ ...p, from: date }));
                                        //    setIsDefaultMode(false);
                                    }}
                                    selectsStart
                                    startDate={dateRange.from}
                                    endDate={dateRange.to}
                                    dateFormat="dd MMM yyyy"
                                    isClearable
                                    placeholderText="From Date"
                                    className="w-24 sm:w-28 text-center outline-none text-sm"
                                />
                                {/* <span className="text-sm text-orange-600 font-medium">To</span> */}
                                <DatePicker
                                    selected={dateRange.to}
                                    onChange={(date) => {
                                        setDateRange((p) => ({ ...p, to: date }));
                                        //    setIsDefaultMode(false);
                                    }}
                                    selectsEnd
                                    startDate={dateRange.from}
                                    endDate={dateRange.to}
                                    minDate={dateRange.from}
                                    isClearable
                                    dateFormat="dd MMM yyyy"
                                    placeholderText="To Date"
                                    className="w-24 sm:w-28 text-center outline-none text-sm"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col justify-end">
                            <label className="text-sm text-gray-700">Current EB</label>
                            <input
                                {...register("EBAmt")}
                                placeholder="EBAmt"
                                disabled
                                className="border border-orange-500 px-3 py-2 rounded-md w-full outline-none"
                            />
                        </div>
                         <div className="flex flex-col justify-end">
                            <label className="text-sm text-gray-700">Current EB (Dates)</label>
                            <div className="flex h-10 items-center justify-center bg-white border border-orange-400 z-30 rounded-md shadow">
                                {/* <span className="text-sm text-orange-600 font-medium">From</span> */}
                                <DatePicker
                                    selected={dateRange.from}
                                    onChange={(date) => {
                                        setDateRange((p) => ({ ...p, from: date }));
                                        //    setIsDefaultMode(false);
                                    }}
                                    selectsStart
                                    startDate={dateRange.from}
                                    endDate={dateRange.to}
                                    dateFormat="dd MMM yyyy"
                                    isClearable
                                    placeholderText="From Date"
                                    className="w-24 sm:w-28 text-center outline-none text-sm"
                                />
                                {/* <span className="text-sm text-orange-600 font-medium">To</span> */}
                                <DatePicker
                                    selected={dateRange.to}
                                    onChange={(date) => {
                                        setDateRange((p) => ({ ...p, to: date }));
                                        //    setIsDefaultMode(false);
                                    }}
                                    selectsEnd
                                    startDate={dateRange.from}
                                    endDate={dateRange.to}
                                    minDate={dateRange.from}
                                    isClearable
                                    dateFormat="dd MMM yyyy"
                                    placeholderText="To Date"
                                    className="w-24 sm:w-28 text-center outline-none text-sm"
                                />
                            </div>
                        </div>
                           <div className="flex flex-col justify-end">
                            <label className="text-sm text-gray-700">Approx. EB</label>
                            <input
                                type="number"
                                {...register("AdjEB")}
                                placeholder="AdjEB"
                                // disabled
                                className="border border-orange-500 px-3 py-2 rounded-md w-full outline-none"
                            />
                        </div>

                            <div className="flex flex-col justify-end">
                            <label className="text-sm text-gray-700">Approx. EB (Dates)</label>
                            <div className="flex h-10 items-center justify-center bg-white border border-orange-400 z-30 rounded-md shadow">
                                {/* <span className="text-sm text-orange-600 font-medium">From</span> */}
                                <DatePicker
                                    selected={dateRange.from}
                                    onChange={(date) => {
                                        setDateRange((p) => ({ ...p, from: date }));
                                        //    setIsDefaultMode(false);
                                    }}
                                    selectsStart
                                    startDate={dateRange.from}
                                    endDate={dateRange.to}
                                    dateFormat="dd MMM yyyy"
                                    isClearable
                                    placeholderText="From Date"
                                    className="w-24 sm:w-28 text-center outline-none text-sm"
                                />
                                {/* <span className="text-sm text-orange-600 font-medium">To</span> */}
                                <DatePicker
                                    selected={dateRange.to}
                                    onChange={(date) => {
                                        setDateRange((p) => ({ ...p, to: date }));
                                        //    setIsDefaultMode(false);
                                    }}
                                    selectsEnd
                                    startDate={dateRange.from}
                                    endDate={dateRange.to}
                                    minDate={dateRange.from}
                                    isClearable
                                    dateFormat="dd MMM yyyy"
                                    placeholderText="To Date"
                                    className="w-24 sm:w-28 text-center outline-none text-sm"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col justify-end">
                            <label className="text-sm text-gray-700">Current Due Amt</label>
                            <input
                                {...register("CurDueAmt")}
                                placeholder="CurDueAmt"
                                disabled
                                className="border border-orange-500 px-3 py-2 rounded-md w-full outline-none"
                            />
                        </div>

                     
                        {/* <div className="flex flex-col justify-end">
                            <label className="text-sm text-gray-700">Current Due Amt</label>
                            <input
                                {...register("CurDueAmt")}
                                placeholder="CurDueAmt"
                                disabled
                                className="border border-orange-500 px-3 py-2 rounded-md w-full outline-none"
                            />
                        </div> */}
                        <div className="flex flex-col justify-end">
                            <label className="text-sm text-gray-700">Previous Due Amt</label>
                            <input
                                {...register("PreDueAmt")}
                                placeholder="PreDueAmt"
                                disabled
                                className="border border-orange-500 px-3 py-2 rounded-md w-full outline-none"
                            />
                        </div>
                        <div className="flex flex-col justify-end">
                            <label className="text-sm text-gray-700">Previous Due Amt Comments</label>
                            <input
                                {...register("PreviousDueAmtComments")}
                                placeholder="Previous Due Amt Comments"
                                // disabled
                                className="border border-orange-500 px-3 py-2 rounded-md w-full outline-none"
                            />
                        </div>


                        <div className="flex flex-col justify-end">
                            <label className="text-sm text-gray-700">Deduction Amt</label>
                            <input
                                type="number"
                                {...register("DeducAmt")}
                                placeholder="DeducAmt"
                                disabled={HandoverCheckListStatus?.toLowerCase()?.trim() !== "yes"}
                                className="border border-orange-500 px-3 py-2 rounded-md w-full outline-none"
                            />
                        </div>
                        <div className="flex flex-col justify-end">
                            <label className="text-sm text-gray-700">Deduction Amt Comments</label>
                            <input
                                type="text"
                                {...register("DeducAmtComment")}
                                placeholder="DeducAmt Comment"
                                className="border border-orange-500 px-3 py-2 rounded-md w-full outline-none"
                            />
                        </div>
                        <div className="flex flex-col justify-end">
                            <label className="text-sm text-gray-700">Total Due Amt</label>
                            <input
                                type="number"
                                {...register("TotalDueAmt")}
                                placeholder="TotalDueAmt"
                                disabled
                                className="border border-orange-500 px-3 py-2 rounded-md w-full outline-none"
                            />
                        </div>
                        <div className="flex flex-col justify-end">
                            <label className="text-sm text-gray-700">DA</label>
                            <input
                                {...register("DA")}
                                placeholder="DA"
                                disabled
                                className="border border-orange-500 px-3 py-2 rounded-md w-full outline-none"
                            />
                        </div>
                        <div className="flex flex-col justify-end">
                            <label className="text-sm text-gray-700">F&F Refundable Amt
                                <span
                                    onClick={handleFNFMsg}
                                    className="text-orange-600 hover:underline ml-1 hover:cursor-pointer"> <i
                                        className="fa fa-paper-plane"
                                    ></i> F&F Msg</span>

                            </label>
                            <input
                                type="number"
                                {...register("FNFSettlementRefundableAmt")}
                                placeholder="F&F Settlement Refundable Amt"
                                disabled
                                className="border border-orange-500 px-3 py-2 rounded-md w-full outline-none"
                            />


                        </div>


                        <div className="flex flex-col justify-end">
                            <label className="text-sm text-gray-700">Bank Details</label>
                            <textarea
                                type="text"
                                {...register("BankDetails")}
                                placeholder="BankDetails"
                                className="border border-orange-500 px-3 py-2 rounded-md w-full outline-none"
                            />
                            {errors.BankDetails && <p className="text-red-500 text-sm">{errors.BankDetails.message}</p>}

                        </div>




                    </div>
                </div>
                {/* f&f settlement details end */}



                {/* others details start */}

                <div >
                    <h1 className="bg-gray-200 m-2 text-lg font-bold px-5 py-2">
                        Other Details
                    </h1>

                    <div className="grid md:grid-cols-6 sm:grid-cols-2 grid-cols-1 gap-5 p-3">


                        <div>
                            <label className="text-sm text-gray-700">PG Main Sheet Updated</label>
                            <Controller
                                name="PGMainSheetUpdated"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        placeholder="Select Property"
                                        isClearable
                                        styles={SelectStyles}
                                        options={selectOptionYesNo}

                                    />
                                )}
                            />

                        </div>
                        <div>
                            <label className="text-sm text-gray-700">Removed From Whatsapp Grp</label>
                            <Controller
                                name="RemovedFromWhatsAppGrp"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        placeholder="Select Property"
                                        isClearable
                                        styles={SelectStyles}
                                        options={selectOptionYesNo}

                                    />
                                )}
                            />

                        </div>
                        <div>
                            <label className="text-sm text-gray-700">Deactivated The Client</label>
                            <Controller
                                name="DeactivatedTheClient"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        placeholder="Select Property"
                                        isClearable
                                        styles={SelectStyles}
                                        options={selectOptionYesNo}

                                    />
                                )}
                            />

                        </div>
                        <div>
                            <label className="text-sm text-gray-700">FNF Status</label>
                            <Controller
                                name="FNFStatus"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        placeholder="Select Property"
                                        isClearable
                                        styles={SelectStyles}
                                        options={selectOptionFNFStatus}
                                    />
                                )}
                            />

                        </div>

                    </div>
                </div>
                {/* other details end */}


                {/* SUBMIT BUTTON */}
                <div className="flex justify-center items-center">
                    <button
                        type="submit"
                        className="bg-orange-500 w-fit text-white px-4 py-2 rounded-md flex items-center gap-2 justify-center"
                        disabled={
                            isCreateNotice ||
                            isUpdateNotice ||
                            isUpdateMainSheetData ||
                            (editingClient && selectedRows.length === 0)
                        }
                    >
                        {isCreateNotice || isUpdateNotice || isUpdateMainSheetData ? (
                            <>
                                <LoaderPage />
                                {editingClient ? "Updating FNF..." : "Creating FNF..."}
                            </>
                        ) : (
                            editingClient ? "Update FNF" : "Create FNF"
                        )}
                    </button>
                </div>


            </form>
            <div className="mt-4 px-5 rounded-md overflow-auto max-h-[250px]">
                <table className="min-w-full border border-gray-300 text-sm">
                    <thead className="bg-black text-white sticky top-0">
                        <tr>
                            <th className="p-2 border">
                                <input
                                    type="checkbox"
                                    onChange={(e) => handleSelectAll(e.target.checked)}
                                    disabled={!!editingClient}
                                    checked={editingClient ? selectedRows.length > 0 : false}
                                />
                            </th>
                            <th className="p-2 border">Month</th>
                            {tableColumns.map((col) => (
                                <th key={col} className="p-2 border whitespace-nowrap">
                                    {col}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading && <TableSkeleton columns={tableColumns.length + 1} rows={6} />}
                        {!isLoading &&
                            filteredData.map((row, index) => {
                                const isEditingThisRow = editingClient && row.ClientID === editingClient.ClientID;
                                const isChecked = selectedRows.includes(row) || isEditingThisRow;
                                return (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="p-2 border text-center">
                                            <input
                                                type="checkbox"
                                                checked={isChecked}
                                                onChange={() => handleRowSelect(row)}
                                                disabled={!!editingClient && !isEditingThisRow}
                                            />
                                        </td>
                                        <td className="p-2 border text-center font-medium">{selectedMonth}</td>
                                        {tableColumns.map((col) => (
                                            <td key={col} className="p-2 border whitespace-nowrap">
                                                {row[col]}
                                            </td>
                                        ))}
                                    </tr>
                                );
                            })}
                    </tbody>
                </table>
                {showWarningPopup && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
                        onClick={() => setShowWarningPopup(false)}
                    >
                        <div
                            className="bg-white rounded-lg shadow-lg p-6 w-[400px]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h2 className="text-lg font-semibold text-red-600 mb-3">
                                ⚠ Warning
                            </h2>

                            <p className="text-gray-700">{warning}</p>

                            <div className="flex justify-end mt-5">
                                <button
                                    onClick={() => setShowWarningPopup(false)}
                                    className="px-4 py-2 bg-black text-white rounded"
                                >
                                    OK
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

        </div>
    );
};

export default FNFForm;