import React, { useEffect, useState } from 'react'
import { Controller } from 'react-hook-form'
import Select from "react-select";
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup';
import { usePropertMasteryData } from '../TicketSystem/Services';
import { useAcConsumtionSheetData, useCreateEbCalculationForMainSheetData, useCreateEbCalculationSheetData, useCreateTicketSheetData, useMainSheetDataForEb } from '.';
import LoaderPage from '../NewBooking/LoaderPage';
import { toast } from 'react-toastify';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
const EBCalculation = () => {
    // const today = new Date().toISOString().split("T")[0];


    const normalizeDate = (d) => {
        const nd = new Date(d);
        nd.setHours(0, 0, 0, 0);
        return nd;
    };

    const [edCalSheetName, setEdCalSheetName] = useState("");
    const [error, setError] = useState("");
    const [dates, setDates] = useState({});
    const [headerDays, setHeaderDays] = useState([]);
    const [adjustedFreeEB, setAdjustedFreeEB] = useState({});
    const [adjustedEB, setAdjustedEB] = useState({});
    const [electricityAmt, setElectricityAmt] = useState();
    console.log("Electricity Amount:", electricityAmt);
    const [ebToBeRecovered, setEbToBeRecovered] = useState(0);
    const [totalUnits, setTotalUnits] = useState(0)
    const [comments1, setComments1] = useState("")
    const [comments2, setComments2] = useState("")
    const {
        control,
        handleSubmit,
        setValue,
        register,
        watch,
        // formState: { errors, isSubmitting },
        reset,
    } = useForm({
        resolver: yupResolver(),

    });


    // const { data: property } = usePropertMasteryData();

    const propertyCode = watch("PropertyCode");

    const sheetId =
        propertyCode?.value && edCalSheetName
            ? `${propertyCode.value},${edCalSheetName}`
            : null;

    const { data, isLoading } = useMainSheetDataForEb(sheetId);



    const { data: property } = usePropertMasteryData();

    const findProperty = property?.data?.find(
        (prop) =>
            prop["Property Code"] === propertyCode?.label
    );




    const EBMainSheetID = `${findProperty ? findProperty["PG EB  Sheet ID"] : ""},${edCalSheetName}`
    const MainSheetID = `${findProperty ? findProperty["PG Main  Sheet ID"] : ""},${edCalSheetName}`

    const MainPropertySheetData = data?.data?.find(
        (prop) =>
            prop["PropCode"] === propertyCode?.label
    );

    console.log("MainPropertySheetData:", MainPropertySheetData);

    // function convertToISO(dateStr) {
    //     if (!dateStr) return "";

    //     const date = new Date(dateStr);

    //     const year = date.getFullYear();
    //     const month = String(date.getMonth() + 1).padStart(2, "0");
    //     const day = String(date.getDate()).padStart(2, "0");

    //     return `${year}-${month}-${day}`;
    // }

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const formatLocalDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };


    useEffect(() => {
        if (!findProperty?.BillStartDate || !findProperty?.BillEndDate) return;

        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();

        const lastDayOfMonth = (y, m) => new Date(y, m + 1, 0).getDate();

        const startDay = Math.min(
            findProperty.BillStartDate,
            lastDayOfMonth(year, month - 1)
        );

        const endDay = Math.min(
            findProperty.BillEndDate,
            lastDayOfMonth(year, month)
        );

        const start = new Date(year, month - 1, startDay);
        const end = new Date(year, month, endDay);

        setStartDate(formatLocalDate(start));
        setEndDate(formatLocalDate(end));
    }, [findProperty]);




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


    const ProperyOptions = property?.data?.map((prop) => ({
        value: prop["PG Main  Sheet ID"],
        label: prop["Property Code"],
    })) || [];


    const inputClass = 'w-full px-3 py-2 mt-1 border border-orange-500 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400';

    useEffect(() => {
        if (endDate) {
            const date = new Date(endDate);

            // move to next month
            date.setMonth(date.getMonth() + 1);

            const month = date.toLocaleString("en-US", { month: "short" });
            const year = date.getFullYear();

            setEdCalSheetName(`${month}${year}`);
        } else {
            setEdCalSheetName("");
        }
    }, [endDate]);



    useEffect(() => {
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);

            const diffDays = (end - start) / (1000 * 60 * 60 * 24);

            if (diffDays < 15) {
                setError("Date difference must be at least 15 days");
            } else {
                setError("");
            }
        }
    }, [startDate, endDate]);
    //    old  .........
    // useEffect(() => {
    //     if (startDate && endDate) {
    //         const start = new Date(startDate);
    //         const end = new Date(endDate);

    //         // inclusive day count
    //         const totalDays = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;

    //         // check if count is valid (28-31)
    //         if (totalDays < 28 || totalDays > 31) {
    //             toast.error(`Invalid date range. Days count = ${totalDays}. Must be between 28 and 31.`);
    //             setHeaderDays([]);  // clear days if invalid
    //             return;
    //         }

    //         // generate days array
    //         const days = [];
    //         let current = new Date(start);

    //         while (current <= end) {
    //             days.push({ date: new Date(current) });
    //             current.setDate(current.getDate() + 1);
    //         }

    //         setHeaderDays(days);
    //     } else {
    //         setHeaderDays([]);
    //     }
    // }, [startDate, endDate]);

    //  here i calculate total free eb ...........

    useEffect(() => {
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);

            // inclusive day count
            let totalDays = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;

            // limit max days to 31
            totalDays = Math.min(totalDays, 31);
            console.log("Total Days Calculated:", totalDays);
            // validation only for minimum days = 28
            if (totalDays < 28) {
                toast.error(`Invalid date range. Days count = ${totalDays}. Must be greater then 27 , Valid Ranges [28, 29, 30 , 31] .`);
                setHeaderDays([]);  // clear days if invalid
                return;
            }
            if (totalDays > 31) {
                toast.error(`Invalid date range. Days count = ${totalDays}. Must be greater then 27 , Valid Ranges [28, 29, 30 , 31] .`);
                setHeaderDays([]);  // clear days if invalid
                return;
            }
            // generate days array
            const days = [];
            let current = new Date(start);

            // while (current <= end && days.length <= 31) { // stop at 31 days max
            //     days.push({ date: new Date(current) });
            //     current.setDate(current.getDate() + 1);
            // }
            while (current <= end && days.length < totalDays) {
                days.push({ date: new Date(current) });
                current.setDate(current.getDate() + 1);
            }

            setHeaderDays(days);
        } else {
            setHeaderDays([]);
        }
    }, [startDate, endDate]);



    const totalFreeEB = data?.data
        ?.filter(ele => ele.FullName && ele.FullName.trim() !== "")
        .reduce((sum, ele) => {

            const billStart = startDate ? normalizeDate(startDate) : null;
            const billEnd = endDate ? normalizeDate(endDate) : null;

            // DOJ
            const doj = ele.EBDOJ
                ? normalizeDate(
                    new Date(
                        ele.EBDOJ.replace(/(\d+)\s(\w+)\s(\d+)/, "$2 $1, $3")
                    )
                )
                : null;

            // ❌ Joined after billing cycle
            if (doj && billEnd && doj > billEnd) return sum;

            // CVD
            const cvd = ele.CVD
                ? normalizeDate(
                    new Date(new Date(ele.CVD).setDate(new Date(ele.CVD).getDate() + 1))
                )
                : null;

            // ===== Helper function to calculate vacation overlap =====
            const getVacationOverlap = (vsdKey) => {
                const vacStartRaw = dates[`${ele.ClientID}_${ele.RentDOJ}_${vsdKey}`]?.startDate;
                const vacEndRaw = dates[`${ele.ClientID}_${ele.RentDOJ}_${vsdKey}`]?.endDate;

                if (!vacStartRaw || !vacEndRaw) return { overlapStart: null, overlapEnd: null };

                const vacStart = normalizeDate(new Date(new Date(vacStartRaw).getTime() + 86400000));
                const vacEnd = normalizeDate(new Date(new Date(vacEndRaw).getTime() - 86400000));

                const vacationDays = Math.floor((vacEnd - vacStart) / (1000 * 60 * 60 * 24)) + 1;

                if (vacationDays >= 15 && billStart && billEnd) {
                    const overlapStart = vacStart < billStart ? billStart : vacStart;
                    const overlapEnd = vacEnd > billEnd ? billEnd : vacEnd;
                    return { overlapStart, overlapEnd };
                }

                return { overlapStart: null, overlapEnd: null };
            };

            // ===== VSD1 =====
            const { overlapStart, overlapEnd } = getVacationOverlap("VSD1");

            // ===== VSD2 =====
            const { overlapStart: overlapStart2, overlapEnd: overlapEnd2 } = getVacationOverlap("VSD2");

            // 🔹 Count valid days
            const totalDays = headerDays.reduce((total, d) => {
                const currentDate = normalizeDate(d.date);

                // ❌ Before DOJ
                if (doj && currentDate < doj) return total;

                // ❌ On or after CVD
                if (cvd && currentDate >= cvd) return total;

                // ❌ Vacation (VSD1 OR VSD2)
                const isVacation =
                    (overlapStart && overlapEnd && currentDate >= overlapStart && currentDate <= overlapEnd) ||
                    (overlapStart2 && overlapEnd2 && currentDate >= overlapStart2 && currentDate <= overlapEnd2);

                return total + (isVacation ? 0 : 1);
            }, 0);

            const adjusted = adjustedFreeEB[`${ele.ClientID}_${ele.RentDOJ}`] || 0;

            // return sum + totalDays * MainPropertySheetData?.FreeEBPerDay + adjusted;
            return sum + totalDays * ele?.FreeEBPerDay + adjusted;

        }, 0);

    console.log("Total Free EB Calculated:", totalFreeEB);
    // here calculate per head free eb ..........
    const getPerHeadFreeEB = (client) => {
        const billStart = startDate ? normalizeDate(startDate) : null;
        const billEnd = endDate ? normalizeDate(endDate) : null;

        // DOJ
        const doj = client.EBDOJ
            ? normalizeDate(
                new Date(
                    client.EBDOJ.replace(/(\d+)\s(\w+)\s(\d+)/, "$2 $1, $3")
                )
            )
            : null;

        // ❌ Joined after billing cycle
        if (doj && billEnd && doj > billEnd) return 0;

        // CVD
        const cvd = client.CVD
            ? normalizeDate(
                new Date(new Date(client.CVD).setDate(new Date(client.CVD).getDate() + 1))
            )
            : null;

        // ===== VSD1 =====
        const vacStart1 = dates[`${client.ClientID}_${client.RentDOJ}_VSD1`]?.startDate
            ? normalizeDate(new Date(new Date(dates[`${client.ClientID}_${client.RentDOJ}_VSD1`].startDate).getTime() + 86400000))
            : null;

        const vacEnd1 = dates[`${client.ClientID}_${client.RentDOJ}_VSD1`]?.endDate
            ? normalizeDate(new Date(new Date(dates[`${client.ClientID}_${client.RentDOJ}_VSD1`].endDate).getTime() - 86400000))
            : null;

        const vacDays1 = vacStart1 && vacEnd1 ? Math.floor((vacEnd1 - vacStart1) / (1000 * 60 * 60 * 24)) + 1 : 0;
        const isVSD1Applicable = vacDays1 >= 15;

        // ===== VSD2 =====
        const vacStart2 = dates[`${client.ClientID}_${client.RentDOJ}_VSD2`]?.startDate
            ? normalizeDate(new Date(new Date(dates[`${client.ClientID}_${client.RentDOJ}_VSD2`].startDate).getTime() + 86400000))
            : null;

        const vacEnd2 = dates[`${client.ClientID}_${client.RentDOJ}_VSD2`]?.endDate
            ? normalizeDate(new Date(new Date(dates[`${client.ClientID}_${client.RentDOJ}_VSD2`].endDate).getTime() - 86400000))
            : null;

        const vacDays2 = vacStart2 && vacEnd2 ? Math.floor((vacEnd2 - vacStart2) / (1000 * 60 * 60 * 24)) + 1 : 0;
        const isVSD2Applicable = vacDays2 >= 15;

        // 🔹 Calculate overlaps only if vacation is applicable
        let overlapStart1 = null, overlapEnd1 = null;
        if (isVSD1Applicable && vacStart1 && vacEnd1 && billStart && billEnd) {
            overlapStart1 = vacStart1 < billStart ? billStart : vacStart1;
            overlapEnd1 = vacEnd1 > billEnd ? billEnd : vacEnd1;
        }

        let overlapStart2 = null, overlapEnd2 = null;
        if (isVSD2Applicable && vacStart2 && vacEnd2 && billStart && billEnd) {
            overlapStart2 = vacStart2 < billStart ? billStart : vacStart2;
            overlapEnd2 = vacEnd2 > billEnd ? billEnd : vacEnd2;
        }

        // 🔹 Count valid days
        const totalDays = headerDays.reduce((total, d) => {
            const currentDate = normalizeDate(d.date);

            // ❌ Before DOJ
            if (doj && currentDate < doj) return total;

            // ❌ On or after CVD
            if (cvd && currentDate >= cvd) return total;

            // ❌ Vacation (VSD1 OR VSD2)
            const isVacation =
                (isVSD1Applicable && overlapStart1 && overlapEnd1 && currentDate >= overlapStart1 && currentDate <= overlapEnd1) ||
                (isVSD2Applicable && overlapStart2 && overlapEnd2 && currentDate >= overlapStart2 && currentDate <= overlapEnd2);

            return total + (isVacation ? 0 : 1);
        }, 0);

        const adjusted = adjustedFreeEB[`${client.ClientID}_${client.RentDOJ}`] || 0;


        return totalDays * client?.FreeEBPerDay + adjusted;
    };




    const getPresentCountForDate = (date) => {
        if (!data?.data) return 0;

        const normalizeDate = (d) => {
            if (!d) return null;
            const nd = new Date(d);
            nd.setHours(0, 0, 0, 0);
            return nd;
        };

        const currentDate = normalizeDate(date);
        const billStart = startDate ? normalizeDate(startDate) : null;
        const billEnd = endDate ? normalizeDate(endDate) : null;

        return data.data
            .filter(ele => ele.FullName && ele.FullName.trim() !== "")
            .reduce((count, ele) => {

                // DOJ
                const doj = ele.EBDOJ
                    ? normalizeDate(new Date(ele.EBDOJ.replace(/(\d+)\s(\w+)\s(\d+)/, "$2 $1, $3")))
                    : null;
                if (doj && currentDate < doj) return count;

                // CVD
                const cvd = ele.CVD
                    ? normalizeDate(new Date(new Date(ele.CVD).getTime() + 86400000))
                    : null;
                if (cvd && currentDate >= cvd) return count;

                // ===== Vacation Check =====
                const checkVacation = (vsdKey) => {
                    const vac = dates[`${ele.ClientID}_${ele.RentDOJ}_${vsdKey}`];
                    if (!vac || !vac.startDate || !vac.endDate) return false;

                    const vacStart = normalizeDate(new Date(new Date(vac.startDate).getTime() + 86400000));
                    const vacEnd = normalizeDate(new Date(new Date(vac.endDate).getTime() - 86400000));
                    const vacationDays = Math.floor((vacEnd - vacStart) / (1000 * 60 * 60 * 24)) + 1;

                    return vacationDays >= 15 && currentDate >= vacStart && currentDate <= vacEnd;
                };

                const isVacation = checkVacation("VSD1") || checkVacation("VSD2");

                return count + (isVacation ? 0 : 1);

            }, 0);
    };


    const { mutate: createEBCalculationData, isPending: isCreateEbCalcul } = useCreateEbCalculationSheetData(EBMainSheetID);
    const { data: fetchAcConsumtionSheetData, isPending: isAcConsumtion } = useAcConsumtionSheetData(findProperty ? findProperty["PG AC  Sheet ID"] : "", true);
    const { mutate: createEBCalculationForMainSheetData, isPending: isCreateEbMainSheet } = useCreateEbCalculationForMainSheetData(MainSheetID);


    // ===============================
    const sheetData = fetchAcConsumtionSheetData?.data?.[0];


    useEffect(() => {
        const ebToBeRecovered =
            electricityAmt && totalFreeEB
                ? Math.max(electricityAmt - totalFreeEB, 0).toFixed(2)
                : 0;
        setEbToBeRecovered(ebToBeRecovered);
    }, [totalFreeEB, electricityAmt]);




    // per day EB
    // per day EB
    const totalDaysCount = headerDays.length;

    const perDayEB =
        totalDaysCount > 0
            ? (ebToBeRecovered - (sheetData?.ACTotalEB ?? 0)) / totalDaysCount
            : 0;

    // check vacation for client on date
    // Normalize date helper
    // const normalizeDate = (d) => {
    //     if (!d) return null;
    //     const nd = new Date(d);
    //     nd.setHours(0, 0, 0, 0);
    //     return nd;
    // };

    // Check if client is on vacation for a given date
    // Check if client is on vacation for a given date
    // Check if client is on vacation for a given date
    const isClientOnVacation = (client, date) => {
        const currentDate = normalizeDate(date);

        const checkVacation = (vsdKey) => {

            const vacStart = dates[`${client.ClientID}_${client.RentDOJ}_${vsdKey}`]?.startDate
                ? normalizeDate(new Date(new Date(dates[`${client.ClientID}_${client.RentDOJ}_${vsdKey}`].startDate).getTime() + 86400000)) // exclusive start
                : null;

            const vacEnd = dates[`${client.ClientID}_${client.RentDOJ}_${vsdKey}`]?.endDate
                ? normalizeDate(new Date(new Date(dates[`${client.ClientID}_${client.RentDOJ}_${vsdKey}`].endDate).getTime() - 86400000)) // exclusive end
                : null;

            if (!vacStart || !vacEnd) return false;

            const vacationDays = Math.floor((vacEnd - vacStart) / (1000 * 60 * 60 * 24)) + 1;

            // Apply only if vacation >= 15 days
            if (vacationDays >= 15 && currentDate >= vacStart && currentDate <= vacEnd) {
                return true;
            }

            return false;
        };

        // ✅ Check both vacations separately
        return checkVacation("VSD1") || checkVacation("VSD2");
    };

    // Get per-day EB for a client on a given date
    const getClientEBForDate = (client, date) => {
        const currentDate = normalizeDate(date);

        // ✅ Client Vacate Date (CVD)
        const cvd = client.CVD
            ? normalizeDate(new Date(new Date(client.CVD).setDate(new Date(client.CVD).getDate() + 1)))
            : null;
        // ❌ On or after CVD → EB = 0
        if (cvd && currentDate >= cvd) return 0;

        // ❌ Check if client is on vacation
        if (isClientOnVacation(client, date)) return 0;

        // ✅ DOJ check
        const doj = client.EBDOJ ? normalizeDate(new Date(client.EBDOJ)) : null;

        const billStart = startDate ? normalizeDate(startDate) : null;
        const billEnd = endDate ? normalizeDate(endDate) : null;

        // ❌ Client not yet joined in the billing cycle
        if (doj && billEnd && doj > billEnd) return 0;

        let presentFromDate = null;
        if (doj && billStart) {
            presentFromDate = doj <= billStart ? billStart : doj;
        }

        // ❌ If client not yet joined on this date
        if (presentFromDate && currentDate < presentFromDate) return 0;

        // ✅ Count of present clients on this date
        const presentCount = getPresentCountForDate(date);
        if (!presentCount) return 0;

        // ✅ Distribute per-day EB among present clients
        return perDayEB / presentCount;
    };




    const AcConsumtion = {};

    if (sheetData) {
        Object.keys(sheetData).forEach((key) => {
            if (key.startsWith("RoomNo_") && key.endsWith("_ACEB")) {
                const roomKey = key
                    .replace("RoomNo_", "")
                    .replace("_ACEB", "");

                AcConsumtion[roomKey] = sheetData[key];
            }
        });
    }



    const FilterDataForACBeds = data?.data?.filter((ele) => {
        return (ele.ACRoom.toLowerCase() === "yes");
    });

    useEffect(() => {
        if (FilterDataForACBeds && FilterDataForACBeds.length > 0 && sheetData) {
            // setElectricityAmt(sheetData.CommonTotalEB || 0);
            setElectricityAmt(sheetData.FlatTotalEB || 0);
        }
    }, [FilterDataForACBeds, sheetData])








    const getBillingDaysCount = () => {
        if (!startDate || !endDate) return 0;

        const s = normalizeDate(startDate);
        const e = normalizeDate(endDate);

        const days =
            Math.floor((e - s) / (1000 * 60 * 60 * 24)) + 1;

        return Math.min(days, 31); // ✅ max 31 days
    };

    const getPresentCountByRoomForDate = (roomNo, date) => {
        return data?.data?.filter(client => {
            if (String(client.RoomNo) !== String(roomNo)) return false;
            if (client.ACRoom !== "Yes") return false;
            if (client.FullName == "") return false;

            return getClientEBForDate(client, date) > 0; // ✅ present logic reuse
        }).length || 0;
    };



    const getClientACEBForDate = (client, date) => {
        // ❌ AC nahi
        if (client.ACRoom !== "Yes") return 0;

        // ❌ client present nahi
        if (getClientEBForDate(client, date) === 0) return 0;

        const roomNo = client.RoomNo;
        const monthlyRoomAC = Number(AcConsumtion[roomNo] || 0);
        if (!monthlyRoomAC) return 0;

        const billingDays = getBillingDaysCount();
        if (!billingDays) return 0;

        const perDayRoomAC = monthlyRoomAC / billingDays;

        const presentCount = getPresentCountByRoomForDate(roomNo, date);
        if (!presentCount) return 0;

        // ✅ DATE-WISE + PRESENT-WISE distribution
        return perDayRoomAC / presentCount;
    };



    //     const getClientCountByRoom = (roomNo) => {
    //   return data?.data?.filter(
    //     client => String(client.RoomNo) === String(roomNo) && client.ACRoom === "Yes"
    //   ).length || 0;
    // };


    //  const getClientACEBForDate = (client, date) => {
    //   // ❌ AC room nahi hai
    //   if (client.ACRoom !== "Yes") return 0;

    //   const roomNo = client.RoomNo;
    //   const roomAC = Number(AcConsumtion[roomNo] || 0);
    //   if (!roomAC) return 0;

    //   const clientCount = getClientCountByRoom(roomNo);
    //   if (!clientCount) return 0;

    //   // ✅ Equal distribution
    //   return roomAC / clientCount;
    // };


    // bulkupload function here ...........
    // ===============================
    // const normalizeDate = (dt) => {
    //     const nd = new Date(dt);
    //     nd.setHours(0, 0, 0, 0);
    //     return nd;
    // };

    const calculateTotalDays = ({ ele, overlapStart, overlapEnd }) => {
        return headerDays.reduce((total, d) => {
            const normalizeDate = (dt) => {
                const nd = new Date(dt);
                nd.setHours(0, 0, 0, 0);
                return nd;
            };

            const currentDate = normalizeDate(d.date);

            // DOJ
            const doj = ele.EBDOJ
                ? normalizeDate(
                    new Date(
                        ele.EBDOJ.replace(/(\d+)\s(\w+)\s(\d+)/, "$2 $1, $3")
                    )
                )
                : null;

            // ✅ Client Vacate Date (CVD)
            const cvd = ele.CVD
                ? normalizeDate(
                    new Date(new Date(ele.CVD).setDate(new Date(ele.CVD).getDate() + 1))
                )
                : null;

            // Vacation
            const isVacation =
                overlapStart &&
                overlapEnd &&
                currentDate >= normalizeDate(overlapStart) &&
                currentDate <= normalizeDate(overlapEnd);

            // ❌ Before DOJ
            if (doj && currentDate < doj) {
                return total;
            }

            // ❌ On or after CVD
            if (cvd && currentDate >= cvd) {
                return total;
            }

            return total + (isVacation ? 0 : 1);
        }, 0)

    };

    // ===============================
    // MAIN BULK SUBMIT FUNCTION
    // ===============================
    const handleBulkSubmit = () => {
        if (!data?.data) return;

        const bulkData = data.data
            .filter(ele => ele.FullName && ele.FullName.trim() !== "")
            .map(ele => {

                // ===== Vacation Check =====
                const vacationStatus = isClientOnVacation(ele, startDate); // you can also use endDate or loop per day if needed

                // Determine vacation start/end for payload (only if >=15 days)
                const getVacationDate = (vsdKey) => {
                    const vac = dates[`${ele.ClientID}_${ele.RentDOJ}_${vsdKey}`];
                    if (!vac || !vac.startDate || !vac.endDate) return null;
                    const vacStart = normalizeDate(new Date(new Date(vac.startDate).getTime() + 86400000));
                    const vacEnd = normalizeDate(new Date(new Date(vac.endDate).getTime() - 86400000));
                    const vacationDays = Math.floor((vacEnd - vacStart) / (1000 * 60 * 60 * 24)) + 1;
                    return vacationDays >= 15 ? { start: vacStart, end: vacEnd } : null;
                };

                const vsd1Dates = getVacationDate("VSD1");
                const vsd2Dates = getVacationDate("VSD2");

                // Clamp vacation dates to EB billing period
                const clampDate = (date, min, max) => {
                    if (!date) return null;
                    if (min && date < min) return min;
                    if (max && date > max) return max;
                    return date;
                };

                const vacStart = vsd1Dates?.start || vsd2Dates?.start || null;
                const vacEnd = vsd1Dates?.end || vsd2Dates?.end || null;

                const overlapStart = clampDate(vacStart, startDate, endDate);
                const overlapEnd = clampDate(vacEnd, startDate, endDate);

                // ===== Total Days =====
                const totalDays = calculateTotalDays({
                    overlapStart,
                    overlapEnd,
                    ele,
                });

                // ===== Total EB calculation =====
                const totalEB = headerDays.reduce((sum, d) => {
                    const value = getClientEBForDate(ele, d.date);
                    return sum + value;
                }, 0);
                const totalACEB = headerDays.reduce((sum, d) => {
                    const value = getClientACEBForDate(ele, d.date);
                    return sum + value;
                }, 0);

                // ===== Format Dates =====
                const formatDate = (date) => {
                    if (!date) return "";
                    return new Date(date).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                    });
                };
                // ===== Final Payload =====
                return {
                    PropertyCode: propertyCode?.label || "",
                    FlatEB: sheetData?.FlatTotalEB ?? electricityAmt,
                    EBStartDate: formatDate(startDate) || "",
                    EBEndDate: formatDate(endDate) || "",
                    ClientName: ele.FullName,
                    ClientID: `${ele.ClientID}`,
                    vacationStart: overlapStart || "",
                    vacationEnd: overlapEnd || "",
                    CEB: totalEB.toFixed(2),
                    ACEB: totalACEB.toFixed(2),
                    TotalDays: totalDays,
                    AdjFreeEB: adjustedFreeEB[`${ele.ClientID}_${ele.RentDOJ}`] || 0,
                    AdjEB: adjustedEB[`${ele.ClientID}_${ele.RentDOJ}`] || 0,
                    FreeEB: getPerHeadFreeEB(ele),
                    PropertyFreeEB: totalFreeEB || 0,
                    EBToBeRecovered: ebToBeRecovered || 0,
                    PropertyEBUnits: totalUnits,
                    VSD1: formatDate(dates[`${ele.ClientID}_${ele.RentDOJ}_VSD1`]?.startDate),
                    VED1: formatDate(dates[`${ele.ClientID}_${ele.RentDOJ}_VSD1`]?.endDate),
                    VSD2: formatDate(dates[`${ele.ClientID}_${ele.RentDOJ}_VSD2`]?.startDate),
                    VED2: formatDate(dates[`${ele.ClientID}_${ele.RentDOJ}_VSD2`]?.endDate),
                    TotalClientEB: (
                        totalEB + (adjustedEB[`${ele.ClientID}_${ele.RentDOJ}`] || 0) + totalACEB
                    ).toFixed(2),
                    EBAmt: (
                        totalEB + (adjustedEB[`${ele.ClientID}_${ele.RentDOJ}`] || 0) + totalACEB
                    ).toFixed(2),

                    Comments1: comments1[`${ele.ClientID}_${ele.RentDOJ}`] || "N/A",
                    Comments2: comments2[`${ele.ClientID}_${ele.RentDOJ}`] || "N/A",
                    FlatTotalEB: sheetData?.FlatTotalEB ?? electricityAmt,
                    FlatTotalUnits: sheetData?.FlatTotalUnits ?? 0,
                    PerUnitCost: sheetData?.PerUnitCost ?? 0,
                    ACTotalUnits: sheetData?.ACTotalUnits ?? 0,
                    ACTotalEB: sheetData?.ACTotalEB ?? 0,
                    CommonEB: sheetData?.CommonTotalEB ?? electricityAmt
                };
            });

        // ===============================
        // API CALL
        // ===============================
        createEBCalculationData(bulkData, {
            onSuccess: () => {
                toast.success("Data Successfully Saved For EB Sheet!");
            },
            onError: (response) => {
                toast.error(
                    response?.response?.data?.error || "Failed to submit"
                );
            },
        });

        createEBCalculationForMainSheetData({ bulkData, totalFreeEB }, {
            onSuccess: () => {
                toast.success("Data Successfully Saved For Main Sheet");
            },
            onError: (response) => {
                toast.error(
                    response?.response?.data?.error || "Failed to submit"
                );
            },
        });




    };



    //     fetch("/api/submit-eb", {
    //         method: "POST",
    //         headers: { "Content-Type": "application/json" },
    //         body: JSON.stringify({ sheetName: edCalSheetName, data: bulkData }),
    //     })
    //         .then(res => res.json())
    //         .then(() => toast.success("EB data submitted successfully!"))
    //         .catch(() => toast.error("Failed to submit EB data."));
    // };



    const formatDateForInput = (date) => {
        if (!date) return "";
        const d = new Date(date);
        const year = d.getFullYear();
        const month = (d.getMonth() + 1).toString().padStart(2, "0");
        const day = d.getDate().toString().padStart(2, "0");
        return `${year}-${month}-${day}`;
    };


    // useEffect(() => {
    //     if (data?.data && data.data.length) {
    //         const newDates = {};
    //         data.data
    //             .filter(ele => ele.FullName && ele.FullName.trim() !== "")
    //             .forEach(client => {
    //                 newDates[`${client.ClientID}_${client.RentDOJ}`] = {
    //                     startDate: formatDateForInput(client.VSD1 || client.VacationSD || ""),  // Adjust the field if needed
    //                     endDate: formatDateForInput(client.VED1 || client.VacationLD || ""),      // Adjust the field if needed
    //                 };
    //             });
    //         setDates(newDates);
    //     }
    // }, [data]);

    useEffect(() => {
        if (data?.data && data.data.length) {
            const newDates = {};

            data.data
                .filter(ele => ele.FullName && ele.FullName.trim() !== "")
                .forEach(client => {

                    if (client.VSD1 || client.VED1) {
                        newDates[`${client.ClientID}_${client.RentDOJ}_VSD1`] = {
                            startDate: formatDateForInput(client.VSD1 || ""),
                            endDate: formatDateForInput(client.VED1 || ""),
                        };
                    }

                    if (client.VSD2 || client.VED2) {
                        newDates[`${client.ClientID}_${client.RentDOJ}_VSD2`] = {
                            startDate: formatDateForInput(client.VSD2 || ""),
                            endDate: formatDateForInput(client.VED2 || ""),
                        };
                    }
                });

            setDates(newDates);
        }
    }, [data]);



    return (
        <>
            <div className='h-screen w-full  mt-52'>
                <div className="flex justify-between items-center m-2">
                    <h1 className="text-xl font-bold">
                        Electricity Bill Calculation
                    </h1>
                    <button
                        onClick={handleBulkSubmit}
                        className="px-4 py-2 bg-orange-300 font-bold rounded hover:bg-orange-400"
                    >
                        {isCreateEbCalcul ? <span className="flex gap-2 justify-center items-center">
                            <LoaderPage /> Submiting...
                        </span> : "Submit All EB Data"}

                    </button>
                </div>
                {/* <h1 className='text-3xl font-bold text-center underline mt-20'>Electricity Bill Calculation</h1> */}
                <div className='flex gap-5 p-2 top-24 z-[9999] bg-white fixed border-2  overflow-x-auto flex-nowrap'>
                    <div className="flex-shrink-0">
                        <label className="block text-sm font-medium text-gray-700 after:content-['*'] after:ml-1 after:text-red-500">
                            Property Code
                        </label>

                        <Controller
                            name="PropertyCode"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    placeholder="Select Property Code"
                                    isClearable
                                    styles={employeeSelectStyles}
                                    options={ProperyOptions}
                                    menuPosition="fixed"
                                    onChange={(selectedOption) => {
                                        field.onChange(selectedOption);   // RHF value update
                                        setElectricityAmt(0);              // 🔥 RESET HERE
                                    }}
                                />
                            )}
                        />
                    </div>

                    <div className="flex-shrink-0">
                        <label className="block text-sm font-medium text-gray-700 after:content-['*'] after:ml-1 after:text-red-500">
                            Bill Start Date
                        </label>
                        <DatePicker
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            dateFormat="d MMM yyyy"
                            className={inputClass}
                            placeholderText="Select Start date"
                            isClearable
                            popperPlacement="bottom-start"
                            withPortal
                            popperClassName="custom-datepicker-popper z-[9999]"

                        />
                    </div>

                    <div className="flex-shrink-0">
                        <label className="block text-sm font-medium text-gray-700 after:content-['*'] after:ml-1 after:text-red-500">
                            Bill End Date
                        </label>
                        {/* <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className={inputClass}
                           
                        // disabled
                        /> */}
                        <DatePicker
                            selected={endDate}
                            onChange={(date) => setEndDate(date)}
                            dateFormat="d MMM yyyy"
                            placeholderText="Select end date"
                            className={inputClass}
                            isClearable
                            popperPlacement="bottom-start"
                            withPortal
                            popperClassName="custom-datepicker-popper z-[9999]"

                        />
                    </div>

                    <div className="flex-shrink-0">
                        <label className="block text-sm font-medium whitespace-nowrap text-gray-700 after:content-['*'] after:ml-1 after:text-red-500">
                            ED CalCulation Sheet Name
                        </label>
                        <input
                            type="text"
                            value={edCalSheetName ?? ""}
                            disabled
                            className={inputClass}
                        />
                    </div>

                    <div className="flex-shrink-0">
                        <label className="block text-sm font-medium text-gray-700 after:content-['*'] after:ml-1 after:text-red-500">EB To Be Recovered</label>
                        <input type="number"
                            name=""
                            id=""
                            value={ebToBeRecovered ?? 0}
                            placeholder='Enter Total Units'
                            className={inputClass}
                            disabled
                        />
                    </div>


                    <div className="flex-shrink-0">
                        <label className="block text-sm font-medium text-gray-700 after:content-['*'] after:ml-1 after:text-red-500">Common Total EB</label>
                        <input
                            type="text"
                            placeholder="Enter EB Amount"
                            className={inputClass}
                            disabled={FilterDataForACBeds && FilterDataForACBeds.length > 0}
                            value={(
                                Number(electricityAmt) - Number(sheetData?.ACTotalEB ?? 0)
                            ).toFixed(0)}

                            onChange={(e) =>
                                setElectricityAmt(e.target.value === "" ? "" : Number(e.target.value))
                            }
                        />
                    </div>
                    {/* Ac Consumtion */}
                    {FilterDataForACBeds && FilterDataForACBeds.length > 0 && (

                        <div className='flex flex-shrink-0 gap-5'>
                            <div className="flex-shrink-0">
                                <label className="block text-sm font-medium text-gray-700 after:content-['*'] after:ml-1 after:text-red-500">Flat Total EB</label>
                                <input type="number"
                                    name=""
                                    id=""
                                    value={sheetData?.FlatTotalEB ?? 0}
                                    placeholder='Enter Total Units'
                                    className={inputClass}
                                    disabled
                                />
                            </div>  <div className="flex-shrink-0">
                                <label className="block text-sm font-medium text-gray-700 after:content-['*'] after:ml-1 after:text-red-500">Flat Total Units</label>
                                <input type="number"
                                    name=""
                                    id=""
                                    value={sheetData?.FlatTotalUnits ?? 0}
                                    placeholder='Enter Total Units'
                                    className={inputClass}
                                    disabled
                                />
                            </div>  <div className="flex-shrink-0">
                                <label className="block text-sm font-medium text-gray-700 after:content-['*'] after:ml-1 after:text-red-500">Per Unit Cost</label>
                                <input type="number"
                                    name=""
                                    id=""
                                    value={sheetData?.PerUnitCost ?? 0}
                                    placeholder='Enter Total Units'
                                    className={inputClass}
                                    disabled
                                />
                            </div>
                            <div className="flex-shrink-0">
                                <label className="block text-sm font-medium text-gray-700 after:content-['*'] after:ml-1 after:text-red-500">AC Total Units</label>
                                <input type="number"
                                    name=""
                                    id=""
                                    value={sheetData?.ACTotalUnits ?? 0}
                                    placeholder='Enter Total Units'
                                    className={inputClass}
                                    disabled
                                />
                            </div>

                            <div className="flex-shrink-0">
                                <label className="block text-sm font-medium text-gray-700 after:content-['*'] after:ml-1 after:text-red-500">AC Total EB</label>
                                <input type="number"
                                    name=""
                                    id=""
                                    value={sheetData?.ACTotalEB ?? 0}
                                    placeholder='Enter Total Units'
                                    className={inputClass}
                                    disabled
                                />
                            </div>
                            {/* <div className="flex-shrink-0">
                                <label className="block text-sm font-medium text-gray-700 after:content-['*'] after:ml-1 after:text-red-500">Flat Total Units</label>
                                <input type="text"
                                    name=""
                                    id=""
                                    disabled={true}
                                    placeholder='Enter Total Units'
                                    value={sheetData?.FlatTotalUnits ?? 0}
                                    onChange={(e) =>
                                        setTotalUnits(e.target.value === "" ? "" : Number(e.target.value))
                                    }
                                    className={inputClass}
                                />
                            </div> */}
                        </div>
                    )}
                    {/* Ac Consumtion */}


                    <div className="flex-shrink-0">
                        <label className="block text-sm font-medium text-gray-700 after:content-['*'] after:ml-1 after:text-red-500">Total Free EB</label>
                        <input type="number"
                            name=""
                            id=""
                            value={totalFreeEB || 0}
                            placeholder='Enter Total Units'
                            className={inputClass}
                            disabled
                        />
                    </div>


                </div>



                {/* ================= CLIENT WISE EB TABLE ================= */}
                <div className="overflow-auto max-h-[600px] ">
                    {/* <h2 className="text-xl font-bold text-center underline text-Black">
                        Client Wise EB Distribution
                    </h2> */}

                    <table className="min-w-max border  text-lg border-gray-400 text-center">
                        <thead className="bg-orange-300 sticky z-50 top-0 font-bold text-gray-800">
                            <tr>
                                <th className="border text-start px-3 py-2 sticky left-0 bg-orange-300">
                                    Client Name &#8595;  Date &#8594;
                                </th>

                                {headerDays.map((d, i) => (
                                    <th key={i} className="border px-3 py-2">
                                        {d.date.getDate()}
                                    </th>
                                ))}
                                <th className="border px-3 py-2 sticky left-0 bg-orange-300">
                                    C EB
                                </th>

                                <th className="border px-3 py-2 sticky left-0 bg-orange-300">
                                    AC EB
                                </th>

                                <th className="border px-3 py-2 sticky left-0 bg-orange-300">
                                    Adj EB
                                </th>
                                <th className="border px-3 py-2 sticky left-0 bg-orange-300">
                                    Total Client EB
                                </th>


                                <th className="border whitespace-nowrap font-bold border-gray-300 w-48 px-2 py-2">Comments2</th>
                            </tr>
                        </thead>

                        <tbody>
                            {data?.data
                                ?.filter(ele => ele.FullName && ele.FullName.trim() !== "")
                                .map(client => {
                                    const adjusted = adjustedEB[`${client.ClientID}_${client.RentDOJ}`] || 0;

                                    // Total EB for client across all dates
                                    const totalEB = headerDays.reduce((sum, d) => {
                                        const value = getClientEBForDate(client, d.date);
                                        return sum + value;
                                    }, 0);

                                    const totalACEB = headerDays.reduce((sum, d) => {
                                        return sum + getClientACEBForDate(client, d.date);
                                    }, 0);
                                    return (
                                        <tr key={`${client.ClientID}_${client.RentDOJ}`}>
                                            {/* Client Name */}
                                            <td className="border px-3 py-2 font-bold sticky left-0 bg-orange-300  text-left z-40">
                                                {client.FullName} <sup className='text-[12px] text-gray-500'>{client.ACRoom.toLowerCase() === "yes" ? `ACRoomNo-${client.RoomNo}` : ""}</sup>
                                            </td>

                                            {/* Date-wise EB */}
                                            {headerDays.map((d, i) => {
                                                const value = getClientEBForDate(client, d.date);
                                                const Acvalue = getClientACEBForDate(client, d.date);

                                                return (
                                                    <td
                                                        key={i}
                                                        className={`border px-2 py-1  ${value === 0
                                                            ? "bg-red-100 text-red-500"
                                                            : "bg-white text-black"
                                                            }`}
                                                    >
                                                        {value.toFixed(2)} <sup className="text-gray-600">
                                                            {Acvalue !== 0 ? ` ${Acvalue.toFixed(2)}` : ""}
                                                        </sup>
                                                    </td>
                                                );
                                            })}


                                            {/* C EB PP Total */}
                                            <td className="border px-3 py-2 font-bold bg-orange-100">
                                                {totalEB.toFixed(2)}
                                            </td>
                                            <td className="border px-3 py-2 font-bold bg-orange-100">
                                                {totalACEB.toFixed(2)}

                                            </td>
                                            <td className="border">
                                                <input
                                                placeholder='Enter Amt'
                                                    type="text"
                                                    value={adjustedEB[`${client.ClientID}_${client.RentDOJ}`] ?? ""}
                                                    onChange={(e) => {
                                                        const val = e.target.value;

                                                        // allow empty, -, numbers, negative numbers
                                                        if (/^-?\d*$/.test(val)) {
                                                            setAdjustedEB((prev) => ({
                                                                ...prev,
                                                                [`${client.ClientID}_${client.RentDOJ}`]:
                                                                    val === "" || val === "-" ? val : Number(val),
                                                            }));
                                                        }
                                                    }}
                                                    className="border border-none outline-none px-1 py-1 w-16"
                                                />


                                            </td>
                                            <td className="border px-3 py-2 font-bold bg-orange-100">
                                                {(
                                                    Number(totalEB || 0) +
                                                    Number(adjusted || 0) +
                                                    Number(totalACEB || 0)
                                                ).toFixed(2)}
                                            </td>

                                            <td className="border">
                                                <input
                                                    type="text"
                                                    defaultValue={comments2[`${client.ClientID}_${client.RentDOJ}`] ?? ""} // default 0 if undefined
                                                    onBlur={(e) => {
                                                        const val = e.target.value;
                                                        setComments2((prev) => ({
                                                            ...prev,
                                                            [`${client.ClientID}_${client.RentDOJ}`]: val === "" ? "" : val, // default 0 if empty
                                                        }));
                                                    }}
                                                    placeholder='comment here'
                                                    className="border  border-none outline-none px-1 py-1 w-full"
                                                />

                                            </td>

                                        </tr>

                                    );
                                })}
                        </tbody>
                        <tfoot>
                            <tr className="bg-orange-300 font-bold text-center">

                                <td className="border px-2 text-xl sticky left-0  font-bold bg-orange-300  text-left">
                                    {/* Total EB To Be Recovered */}
                                </td>
                                {/* Per-date present count */}
                                {headerDays.map((d, i) => (
                                    <td key={i} className="border px-1 py-1">
                                        {/* {getPresentCountForDate(d.date)} */}
                                    </td>
                                ))}
                                {/* Free EB */}
                                <td className="border">
                                    {data?.data
                                        ?.filter(ele => ele.FullName && ele.FullName.trim() !== "")
                                        .reduce((sumClients, client) => {
                                            const clientTotal = headerDays.reduce((sum, d) => {
                                                const value = getClientEBForDate(client, d.date);
                                                return sum + (Number(value) || 0);
                                            }, 0);

                                            return sumClients + clientTotal;
                                        }, 0)
                                        .toFixed(0)}

                                </td>
                                <td className="border px-2 text-xl sticky left-0  font-bold bg-orange-300  text-left">
                                    {/* Total AC EB To Be Recovered */}
                                    {data?.data
                                        ?.filter(ele => ele.FullName && ele.FullName.trim() !== "")
                                        .reduce((sumClients, client) => {
                                            const clientTotal = headerDays.reduce((sum, d) => {
                                                const value = getClientACEBForDate(client, d.date);
                                                return sum + (Number(value) || 0);
                                            }, 0);

                                            return sumClients + clientTotal;
                                        }, 0)
                                        .toFixed(0)}
                                </td>    <td className="border px-2 text-xl sticky left-0  font-bold bg-orange-300  text-left">
                                    {/* Total Adjusted EB To Be Recovered */}
                                    {data?.data
                                        ?.filter(client => client.FullName && client.FullName.trim() !== "")
                                        .reduce((grandTotal, client) => {

                                            const adjusted =
                                                Number(adjustedEB[`${client.ClientID}_${client.RentDOJ}`]) || 0;

                                            return grandTotal + adjusted;
                                        }, 0)
                                        .toFixed(0)}
                                </td>
                                <td className="border px-2 text-xl sticky left-0 font-bold bg-orange-300 text-left">
                                    {data?.data
                                        ?.filter(client => client.FullName && client.FullName.trim() !== "")
                                        .reduce((grandTotal, client) => {
                                            const clientEBTotal = headerDays.reduce((sum, d) => {
                                                const value = getClientEBForDate(client, d.date);
                                                return sum + (Number(value) || 0);
                                            }, 0);

                                            const totalACEB = headerDays.reduce((sum, d) => {
                                                return sum + getClientACEBForDate(client, d.date);
                                            }, 0);

                                            const adjusted =
                                                Number(adjustedEB[`${client.ClientID}_${client.RentDOJ}`]) || 0;

                                            return grandTotal + clientEBTotal + adjusted + totalACEB;
                                        }, 0)
                                        .toFixed(0)}
                                </td>
                            </tr>
                        </tfoot>

                    </table>
                </div>
                {isLoading ? <div><LoaderPage /></div> :
                    <div className='overflow-auto max-h-[600px] border'>
                        <table className="min-w-auto mt-10   border-red-500">
                            <thead className="bg-orange-300 shadow-sm text-lg font-bold text-gray-700 sticky top-[-1px] ">
                                <tr>
                                    {/* <th className="border font-bold whitespace-nowrap px-2 py-2 sticky left-0 z-50 bg-orange-300">Client Id</th> */}
                                    <th className="border border-gray-300 whitespace-nowrap font-bold  px-2 py-2 sticky left-0  z-50 bg-orange-300 text-left">Client Name &#8595;  Date &#8594; </th>
                                    <th className="border hidden border-gray-300 whitespace-nowrap font-bold  px-2 py-2 sticky left-0 z-30 bg-orange-300 text-left">Vacation SD</th>
                                    <th className="border hidden border-gray-300 whitespace-nowrap font-bold  px-2 py-2 sticky left-0 z-30 bg-orange-300 text-left">Vacation LD</th>
                                    {headerDays.map((d, i) => (
                                        <th
                                            key={i}
                                            className="border border-gray-300 p-3"
                                        >
                                            {d.date.getDate()}
                                        </th>
                                    ))}
                                    <th className="border whitespace-nowrap font-bold  border-gray-300 px-2 py-2 w-[100px]">Total Days</th>
                                    <th className="border whitespace-nowrap font-bold border-gray-300 px-2 py-2">Adj Free EB</th>
                                    <th className="border whitespace-nowrap font-bold border-gray-300 px-2 py-2">Free EB</th>
                                    <th className="border whitespace-nowrap font-bold border-gray-300 w-48 px-2 py-2">Comments1</th>

                                    {/* <th className="border whitespace-nowrap font-bold border-gray-300 px-2 py-2">Fix Salary</th>
                                <th className="border whitespace-nowrap font-bold border-gray-300 px-2 py-2">Per Day</th>
                                <th className="border whitespace-nowrap font-bold border-gray-300 px-2 py-2">Adjusted Amt</th>
                                <th className="border whitespace-nowrap font-bold border-gray-300 px-2 py-2">Paid Leaves</th>
                                <th className="border whitespace-nowrap font-bold border-gray-300 px-2 py-2">Payable Salary</th>
                                <th className="border whitespace-nowrap font-bold border-gray-300 px-2 py-2">Paid Amt</th>
                                <th className="border whitespace-nowrap font-bold border-gray-300 px-2 py-2">Current Due</th>
                                <th className="border whitespace-nowrap font-bold border-gray-300 px-2 py-2">Previous Due</th>  
                                <th className="border whitespace-nowrap font-bold border-gray-300 px-2 py-2">Actions</th> */}

                                </tr>
                            </thead>

                            <tbody>

                                {data?.data?.filter(ele => ele.FullName && ele.FullName.trim() !== "")?.map((ele) => {
                                    const billStart = startDate ? new Date(startDate) : null;
                                    const billEnd = endDate ? new Date(endDate) : null;

                                    // const normalizeDate = (d) => {
                                    //     const nd = new Date(d);
                                    //     nd.setHours(0, 0, 0, 0);
                                    //     return nd;
                                    // };
                                    // ===== Existing (VSD1) =====
                                    const vacStart = dates[`${ele.ClientID}_${ele.RentDOJ}_VSD1`]?.startDate
                                        ? normalizeDate(
                                            new Date(
                                                new Date(dates[`${ele.ClientID}_${ele.RentDOJ}_VSD1`].startDate).getTime() +
                                                1 * 24 * 60 * 60 * 1000
                                            )
                                        )
                                        : null;

                                    const vacEnd = dates[`${ele.ClientID}_${ele.RentDOJ}_VSD1`]?.endDate
                                        ? normalizeDate(
                                            new Date(
                                                new Date(dates[`${ele.ClientID}_${ele.RentDOJ}_VSD1`].endDate).getTime() -
                                                1 * 24 * 60 * 60 * 1000
                                            )
                                        )
                                        : null;


                                    // ===== NEW (VSD2) — same logic =====
                                    const vacStart2 = dates[`${ele.ClientID}_${ele.RentDOJ}_VSD2`]?.startDate
                                        ? normalizeDate(
                                            new Date(
                                                new Date(dates[`${ele.ClientID}_${ele.RentDOJ}_VSD2`].startDate).getTime() +
                                                1 * 24 * 60 * 60 * 1000
                                            )
                                        )
                                        : null;

                                    const vacEnd2 = dates[`${ele.ClientID}_${ele.RentDOJ}_VSD2`]?.endDate
                                        ? normalizeDate(
                                            new Date(
                                                new Date(dates[`${ele.ClientID}_${ele.RentDOJ}_VSD2`].endDate).getTime() -
                                                1 * 24 * 60 * 60 * 1000
                                            )
                                        )
                                        : null;



                                    // 🔹 Calculate vacation length
                                    let vacationDays1 = 0;
                                    if (vacStart && vacEnd) {
                                        vacationDays1 =
                                            Math.floor((vacEnd - vacStart) / (1000 * 60 * 60 * 24)) + 1;
                                    }

                                    let vacationDays2 = 0;
                                    if (vacStart2 && vacEnd2) {
                                        vacationDays2 =
                                            Math.floor((vacEnd2 - vacStart2) / (1000 * 60 * 60 * 24)) + 1;
                                    }

                                    // 🔹 Apply vacation ONLY if >= 15 days
                                    let overlapStart1 = null;
                                    let overlapEnd1 = null;

                                    if (
                                        vacationDays1 >= 15 &&
                                        billStart &&
                                        billEnd &&
                                        vacStart &&
                                        vacEnd
                                    ) {
                                        overlapStart1 = vacStart < billStart ? billStart : vacStart;
                                        overlapEnd1 = vacEnd > billEnd ? billEnd : vacEnd;
                                    }

                                    let overlapStart2 = null;
                                    let overlapEnd2 = null;

                                    if (
                                        vacationDays2 >= 15 &&
                                        billStart &&
                                        billEnd &&
                                        vacStart2 &&
                                        vacEnd2
                                    ) {
                                        overlapStart2 = vacStart2 < billStart ? billStart : vacStart2;
                                        overlapEnd2 = vacEnd2 > billEnd ? billEnd : vacEnd2;
                                    }

                                    return (
                                        <tr key={`${ele.ClientID}_${ele.RentDOJ}`} className={`text-lg text-gray-800 text-center `}>
                                            <td className="border border-gray-300 px-2 sticky left-0 whitespace-nowrap bg-orange-300 font-bold  text-left">
                                                {`${ele.FullName.slice(0, 18)}..`}
                                            </td>
                                            <td className='border-2 hidden p-2'>
                                                <input
                                                    type="date"
                                                    className="border-none"
                                                    value={dates[`${ele.ClientID}_${ele.RentDOJ}`]?.startDate || ""}
                                                    onChange={(e) =>
                                                        setDates(prev => ({
                                                            ...prev,
                                                            [`${ele.ClientID}_${ele.RentDOJ}`]: {
                                                                ...prev[`${ele.ClientID}_${ele.RentDOJ}`],
                                                                startDate: e.target.value
                                                            }
                                                        }))
                                                    }
                                                />
                                            </td>
                                            <td className='border-2 hidden p-2'>
                                                <input
                                                    type="date"
                                                    className="border-none"
                                                    value={dates[`${ele.ClientID}_${ele.RentDOJ}`]?.endDate || ""}
                                                    onChange={(e) =>
                                                        setDates(prev => ({
                                                            ...prev,
                                                            [`${ele.ClientID}_${ele.RentDOJ}`]: {
                                                                ...prev[`${ele.ClientID}_${ele.RentDOJ}`],
                                                                endDate: e.target.value
                                                            }
                                                        }))
                                                    }
                                                />
                                            </td>

                                            {headerDays.map((d, i) => {
                                                const normalizeDate = (dt) => {
                                                    const nd = new Date(dt);
                                                    nd.setHours(0, 0, 0, 0);
                                                    return nd;
                                                };

                                                const currentDate = normalizeDate(d.date);

                                                // DOJ
                                                const doj = ele.EBDOJ
                                                    ? normalizeDate(
                                                        new Date(
                                                            ele.EBDOJ.replace(/(\d+)\s(\w+)\s(\d+)/, "$2 $1, $3")
                                                        )
                                                    )
                                                    : null;

                                                // Client Vacate Date
                                                const cvd = ele.CVD
                                                    ? normalizeDate(
                                                        new Date(new Date(ele.CVD).setDate(new Date(ele.CVD).getDate() + 1))
                                                    )
                                                    : null;

                                                // ✅ Vacation check (VSD1 OR VSD2)
                                                const isVacation =
                                                    (
                                                        overlapStart1 &&
                                                        overlapEnd1 &&
                                                        currentDate >= normalizeDate(overlapStart1) &&
                                                        currentDate <= normalizeDate(overlapEnd1)
                                                    ) ||
                                                    (
                                                        overlapStart2 &&
                                                        overlapEnd2 &&
                                                        currentDate >= normalizeDate(overlapStart2) &&
                                                        currentDate <= normalizeDate(overlapEnd2)
                                                    );

                                                // ❌ Before DOJ
                                                if (doj && currentDate < doj) {
                                                    return (
                                                        <td key={i} className="border px-1 py-1  bg-red-100 text-red-700">
                                                            0
                                                        </td>
                                                    );
                                                }

                                                // ❌ On or after CVD
                                                if (cvd && currentDate >= cvd) {
                                                    return (
                                                        <td key={i} className="border px-1 py-1  bg-red-100 text-red-700">
                                                            0
                                                        </td>
                                                    );
                                                }

                                                // ❌ Vacation
                                                if (isVacation) {
                                                    return (
                                                        <td key={i} className="border px-1 py-1  bg-red-100 text-red-700">
                                                            0
                                                        </td>
                                                    );
                                                }

                                                // ✅ Present
                                                return (
                                                    <td key={i} className="border px-1 py-1  bg-white text-black">
                                                        1
                                                    </td>
                                                );
                                            })}



                                            <td className="border px-2 py-1 font-semibold bg-orange-100">
                                                {
                                                    headerDays.reduce((total, d) => {
                                                        const normalizeDate = (dt) => {
                                                            const nd = new Date(dt);
                                                            nd.setHours(0, 0, 0, 0);
                                                            return nd;
                                                        };

                                                        const currentDate = normalizeDate(d.date);

                                                        // DOJ
                                                        const doj = ele.EBDOJ
                                                            ? normalizeDate(
                                                                new Date(
                                                                    ele.EBDOJ.replace(/(\d+)\s(\w+)\s(\d+)/, "$2 $1, $3")
                                                                )
                                                            )
                                                            : null;

                                                        // Client Vacate Date (CVD)
                                                        const cvd = ele.CVD
                                                            ? normalizeDate(
                                                                new Date(
                                                                    new Date(ele.CVD).setDate(new Date(ele.CVD).getDate() + 1)
                                                                )
                                                            )
                                                            : null;

                                                        // ✅ Vacation check (VSD1 OR VSD2)
                                                        const isVacation =
                                                            (
                                                                overlapStart1 &&
                                                                overlapEnd1 &&
                                                                currentDate >= normalizeDate(overlapStart1) &&
                                                                currentDate <= normalizeDate(overlapEnd1)
                                                            ) ||
                                                            (
                                                                overlapStart2 &&
                                                                overlapEnd2 &&
                                                                currentDate >= normalizeDate(overlapStart2) &&
                                                                currentDate <= normalizeDate(overlapEnd2)
                                                            );

                                                        // ❌ Before DOJ
                                                        if (doj && currentDate < doj) {
                                                            return total;
                                                        }

                                                        // ❌ On or after CVD
                                                        if (cvd && currentDate >= cvd) {
                                                            return total;
                                                        }

                                                        // ➕ Count present (vacation = 0)
                                                        return total + (isVacation ? 0 : 1);
                                                    }, 0)
                                                }
                                            </td>


                                            <td className="border ">
                                                <input
                                                placeholder='Enter Amt'
                                                    type="text"
                                                    value={adjustedFreeEB[`${ele.ClientID}_${ele.RentDOJ}`] ?? ""} // default 0 if undefined
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        // allow empty, -, numbers, negative numbers
                                                      if (/^-?\d*$/.test(val)) {
                                                            setAdjustedFreeEB((prev) => ({
                                                                ...prev,
                                                                [`${ele.ClientID}_${ele.RentDOJ}`]:
                                                                    val === "" || val === "-" ? val : Number(val),
                                                            }));
                                                        }
                                                    }}
                                                    className="border  border-none outline-none px-1 py-1 w-full"
                                                />

                                            </td>

                                            <td className="border bg-orange-100">
                                                {/* {per head free eb} */}
                                                {getPerHeadFreeEB(ele)}
                                            </td>

                                            <td className="border">
                                                <input
                                                    type="text"
                                                    defaultValue={comments1[`${ele.ClientID}_${ele.RentDOJ}`] ?? ""}
                                                    onBlur={(e) => {
                                                        const val = e.target.value;
                                                        setComments1((prev) => ({
                                                            ...prev,
                                                            [`${ele.ClientID}_${ele.RentDOJ}`]: val,
                                                        }));
                                                    }}
                                                    placeholder='Enter comment here'
                                                    className="border border-none outline-none px-1 py-1 w-full"
                                                />
                                            </td>


                                        </tr>
                                    );
                                })}



                            </tbody>

                            <tfoot>
                                <tr className="bg-orange-300 font-bold text-center">
                                    {/* Client Name column */}
                                    <td className="border px-2 text-xl sticky left-0  font-bold bg-orange-300  text-left">
                                        Total Present
                                    </td>

                                    {/* Vacation SD */}
                                    {/* <td className="border"></td> */}

                                    {/* Vacation LD */}
                                    {/* <td className="border"></td> */}

                                    {/* Per-date present count */}
                                    {headerDays.map((d, i) => (
                                        <td key={i} className="border px-1 py-1">
                                            {getPresentCountForDate(d.date)}
                                        </td>
                                    ))}

                                    {/* Total Days column (optional) */}
                                    <td className="border"></td>

                                    {/* Adj EB */}
                                    <td className="border"></td>

                                    {/* Free EB */}
                                    <td className="border"></td>
                                    <td className="border"></td>
                                </tr>
                            </tfoot>

                        </table>
                    </div>
                }
            </div>

        </>
    )
}

export default EBCalculation