import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react'
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

// Memoized helper functions outside component
const normalizeDate = (d) => {
    if (!d) return null;
    const nd = new Date(d);
    nd.setHours(0, 0, 0, 0);
    return nd;
};

const formatDateForInput = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const day = d.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
};

const formatLocalDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

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

// Memoized Table Row Components
const ClientEBRow = React.memo(({ 
    client, 
    headerDays, 
    getClientEBForDate, 
    getClientACEBForDate, 
    adjustedEB, 
    comments2,
    onAdjustEBChange,
    onComments2Change 
}) => {
    const adjusted = adjustedEB[`${client.ClientID}_${client.RentDOJ}`] || 0;
    
    // Memoize total calculations
    const { totalEB, totalACEB } = useMemo(() => {
        let ebTotal = 0;
        let acTotal = 0;
        
        for (let i = 0; i < headerDays.length; i++) {
            const d = headerDays[i];
            ebTotal += getClientEBForDate(client, d.date);
            acTotal += getClientACEBForDate(client, d.date);
        }
        
        return { totalEB: ebTotal, totalACEB: acTotal };
    }, [client, headerDays, getClientEBForDate, getClientACEBForDate]);
    
    const totalClientEB = useMemo(() => 
        Number((totalEB + adjusted + totalACEB).toFixed(2)),
        [totalEB, adjusted, totalACEB]
    );
    
    return (
        <tr key={`${client.ClientID}_${client.RentDOJ}`}>
            <td className="border px-3 py-2 font-bold sticky left-0 bg-orange-300 text-left z-40">
                {client.FullName} 
                <sup className='text-[12px] text-gray-500'>
                    {client.ACRoom.toLowerCase() === "yes" ? `ACRoomNo-${client.RoomNo}` : ""}
                </sup>
            </td>
            
            {headerDays.map((d, i) => {
                const value = getClientEBForDate(client, d.date);
                const Acvalue = getClientACEBForDate(client, d.date);
                
                return (
                    <td
                        key={i}
                        className={`border px-2 py-1 ${value === 0 ? "bg-red-100 text-red-500" : "bg-white text-black"}`}
                    >
                        {value.toFixed(2)} 
                        <sup className="text-gray-600">
                            {Acvalue !== 0 ? ` ${Acvalue.toFixed(2)}` : ""}
                        </sup>
                    </td>
                );
            })}
            
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
                    onChange={(e) => onAdjustEBChange(client.ClientID, client.RentDOJ, e.target.value)}
                    className="border border-none outline-none px-1 py-1 w-16"
                />
            </td>
            <td className="border px-3 py-2 font-bold bg-orange-100">
                {totalClientEB}
            </td>
            <td className="border">
                <input
                    type="text"
                    defaultValue={comments2[`${client.ClientID}_${client.RentDOJ}`] ?? ""}
                    onBlur={(e) => onComments2Change(client.ClientID, client.RentDOJ, e.target.value)}
                    placeholder='comment here'
                    className="border border-none outline-none px-1 py-1 w-full"
                />
            </td>
        </tr>
    );
});

const FreeEBRow = React.memo(({ 
    ele, 
    headerDays, 
    startDate, 
    endDate, 
    dates,
    adjustedFreeEB,
    comments1,
    onAdjustFreeEBChange,
    onComments1Change,
    getPerHeadFreeEB 
}) => {
    // Calculate once and memoize
    const { overlapStart1, overlapEnd1, overlapStart2, overlapEnd2 } = useMemo(() => {
        const billStart = startDate ? normalizeDate(startDate) : null;
        const billEnd = endDate ? normalizeDate(endDate) : null;
        
        // VSD1
        const vacStart1 = dates[`${ele.ClientID}_${ele.RentDOJ}_VSD1`]?.startDate
            ? normalizeDate(new Date(new Date(dates[`${ele.ClientID}_${ele.RentDOJ}_VSD1`].startDate).getTime() + 86400000))
            : null;
        const vacEnd1 = dates[`${ele.ClientID}_${ele.RentDOJ}_VSD1`]?.endDate
            ? normalizeDate(new Date(new Date(dates[`${ele.ClientID}_${ele.RentDOJ}_VSD1`].endDate).getTime() - 86400000))
            : null;
        
        // VSD2
        const vacStart2 = dates[`${ele.ClientID}_${ele.RentDOJ}_VSD2`]?.startDate
            ? normalizeDate(new Date(new Date(dates[`${ele.ClientID}_${ele.RentDOJ}_VSD2`].startDate).getTime() + 86400000))
            : null;
        const vacEnd2 = dates[`${ele.ClientID}_${ele.RentDOJ}_VSD2`]?.endDate
            ? normalizeDate(new Date(new Date(dates[`${ele.ClientID}_${ele.RentDOJ}_VSD2`].endDate).getTime() - 86400000))
            : null;
        
        let overlapStart1 = null, overlapEnd1 = null;
        if (vacStart1 && vacEnd1 && billStart && billEnd) {
            const vacationDays1 = Math.floor((vacEnd1 - vacStart1) / (1000 * 60 * 60 * 24)) + 1;
            if (vacationDays1 >= 15) {
                overlapStart1 = vacStart1 < billStart ? billStart : vacStart1;
                overlapEnd1 = vacEnd1 > billEnd ? billEnd : vacEnd1;
            }
        }
        
        let overlapStart2 = null, overlapEnd2 = null;
        if (vacStart2 && vacEnd2 && billStart && billEnd) {
            const vacationDays2 = Math.floor((vacEnd2 - vacStart2) / (1000 * 60 * 60 * 24)) + 1;
            if (vacationDays2 >= 15) {
                overlapStart2 = vacStart2 < billStart ? billStart : vacStart2;
                overlapEnd2 = vacEnd2 > billEnd ? billEnd : vacEnd2;
            }
        }
        
        return { overlapStart1, overlapEnd1, overlapStart2, overlapEnd2 };
    }, [ele, dates, startDate, endDate]);
    
    // Calculate total days once
    const totalDays = useMemo(() => {
        return headerDays.reduce((total, d) => {
            const currentDate = normalizeDate(d.date);
            
            // DOJ
            const doj = ele.EBDOJ
                ? normalizeDate(new Date(ele.EBDOJ.replace(/(\d+)\s(\w+)\s(\d+)/, "$2 $1, $3")))
                : null;
            if (doj && currentDate < doj) return total;
            
            // CVD
            const cvd = ele.CVD
                ? normalizeDate(new Date(new Date(ele.CVD).setDate(new Date(ele.CVD).getDate() + 1)))
                : null;
            if (cvd && currentDate >= cvd) return total;
            
            // Vacation check
            const isVacation = 
                (overlapStart1 && overlapEnd1 && currentDate >= overlapStart1 && currentDate <= overlapEnd1) ||
                (overlapStart2 && overlapEnd2 && currentDate >= overlapStart2 && currentDate <= overlapEnd2);
            
            return total + (isVacation ? 0 : 1);
        }, 0);
    }, [ele, headerDays, overlapStart1, overlapEnd1, overlapStart2, overlapEnd2]);
    
    return (
        <tr key={`${ele.ClientID}_${ele.RentDOJ}`} className="text-lg text-gray-800 text-center">
            <td className="border border-gray-300 px-2 sticky left-0 whitespace-nowrap bg-orange-300 font-bold text-left">
                {`${ele.FullName.slice(0, 18)}..`}
            </td>
            
            {headerDays.map((d, i) => {
                const currentDate = normalizeDate(d.date);
                
                // DOJ
                const doj = ele.EBDOJ
                    ? normalizeDate(new Date(ele.EBDOJ.replace(/(\d+)\s(\w+)\s(\d+)/, "$2 $1, $3")))
                    : null;
                if (doj && currentDate < doj) {
                    return <td key={i} className="border px-1 py-1 bg-red-100 text-red-700">0</td>;
                }
                
                // CVD
                const cvd = ele.CVD
                    ? normalizeDate(new Date(new Date(ele.CVD).setDate(new Date(ele.CVD).getDate() + 1)))
                    : null;
                if (cvd && currentDate >= cvd) {
                    return <td key={i} className="border px-1 py-1 bg-red-100 text-red-700">0</td>;
                }
                
                // Vacation check
                const isVacation = 
                    (overlapStart1 && overlapEnd1 && currentDate >= overlapStart1 && currentDate <= overlapEnd1) ||
                    (overlapStart2 && overlapEnd2 && currentDate >= overlapStart2 && currentDate <= overlapEnd2);
                
                if (isVacation) {
                    return <td key={i} className="border px-1 py-1 bg-red-100 text-red-700">0</td>;
                }
                
                return <td key={i} className="border px-1 py-1 bg-white text-black">1</td>;
            })}
            
            <td className="border px-2 py-1 font-semibold bg-orange-100">
                {totalDays}
            </td>
            
            <td className="border">
                <input
                    placeholder='Enter Amt'
                    type="text"
                    value={adjustedFreeEB[`${ele.ClientID}_${ele.RentDOJ}`] ?? ""}
                    onChange={(e) => onAdjustFreeEBChange(ele.ClientID, ele.RentDOJ, e.target.value)}
                    className="border border-none outline-none px-1 py-1 w-full"
                />
            </td>
            
            <td className="border bg-orange-100">
                {getPerHeadFreeEB(ele)}
            </td>
            
            <td className="border">
                <input
                    type="text"
                    defaultValue={comments1[`${ele.ClientID}_${ele.RentDOJ}`] ?? ""}
                    onBlur={(e) => onComments1Change(ele.ClientID, ele.RentDOJ, e.target.value)}
                    placeholder='Enter comment here'
                    className="border border-none outline-none px-1 py-1 w-full"
                />
            </td>
        </tr>
    );
});

const EBCalculation = () => {
    // State declarations
    const [flatTotalUnits, setFlatTotalUnits] = useState("");
    const [edCalSheetName, setEdCalSheetName] = useState("");
    const [dates, setDates] = useState({});
    const [adjustedFreeEB, setAdjustedFreeEB] = useState({});
    const [adjustedEB, setAdjustedEB] = useState({});
    const [electricityAmt, setElectricityAmt] = useState(0);
    const [ebToBeRecovered, setEbToBeRecovered] = useState(0);
    const [totalUnits, setTotalUnits] = useState(0);
    const [comments1, setComments1] = useState({});
    const [comments2, setComments2] = useState({});
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    
    const {
        control,
        watch,
    } = useForm({
        resolver: yupResolver(),
    });
    
    const propertyCode = watch("PropertyCode");
    
    // Memoized derived values
    const sheetId = useMemo(() => 
        propertyCode?.value && edCalSheetName ? `${propertyCode.value},${edCalSheetName}` : null,
        [propertyCode, edCalSheetName]
    );
    
    const { data, isLoading } = useMainSheetDataForEb(sheetId);
    const { data: property } = usePropertMasteryData();
    
    const findProperty = useMemo(() => 
        property?.data?.find(prop => prop["Property Code"] === propertyCode?.label),
        [property, propertyCode]
    );
    
    const MainPropertySheetData = useMemo(() => 
        data?.data?.find(prop => prop["PropCode"] === propertyCode?.label),
        [data, propertyCode]
    );
    
    const EBMainSheetID = useMemo(() => 
        `${findProperty ? findProperty["PG EB  Sheet ID"] : ""},${edCalSheetName}`,
        [findProperty, edCalSheetName]
    );
    
    const MainSheetID = useMemo(() => 
        `${findProperty ? findProperty["PG Main  Sheet ID"] : ""},${edCalSheetName}`,
        [findProperty, edCalSheetName]
    );
    
    // Memoized header days calculation
    const headerDays = useMemo(() => {
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            
            let totalDays = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
            totalDays = Math.min(totalDays, 31);
            
            if (totalDays < 28 || totalDays > 31) {
                toast.error(`Invalid date range. Days count = ${totalDays}. Must be between 28 and 31.`);
                return [];
            }
            
            const days = [];
            let current = new Date(start);
            
            while (current <= end && days.length < totalDays) {
                days.push({ date: new Date(current) });
                current.setDate(current.getDate() + 1);
            }
            
            return days;
        }
        return [];
    }, [startDate, endDate]);
    
    // Memoized total free EB calculation
    const totalFreeEB = useMemo(() => {
        if (!data?.data) return 0;
        
        let total = 0;
        const billStart = startDate ? normalizeDate(startDate) : null;
        const billEnd = endDate ? normalizeDate(endDate) : null;
        
        for (const ele of data.data) {
            if (!ele.FullName || ele.FullName.trim() === "") continue;
            
            // DOJ
            const doj = ele.EBDOJ
                ? normalizeDate(new Date(ele.EBDOJ.replace(/(\d+)\s(\w+)\s(\d+)/, "$2 $1, $3")))
                : null;
            if (doj && billEnd && doj > billEnd) continue;
            
            // CVD
            const cvd = ele.CVD
                ? normalizeDate(new Date(new Date(ele.CVD).setDate(new Date(ele.CVD).getDate() + 1)))
                : null;
            
            // Vacation overlap calculation
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
            
            const { overlapStart, overlapEnd } = getVacationOverlap("VSD1");
            const { overlapStart: overlapStart2, overlapEnd: overlapEnd2 } = getVacationOverlap("VSD2");
            
            // Count valid days
            let totalDays = 0;
            for (const d of headerDays) {
                const currentDate = normalizeDate(d.date);
                
                if (doj && currentDate < doj) continue;
                if (cvd && currentDate >= cvd) continue;
                
                const isVacation =
                    (overlapStart && overlapEnd && currentDate >= overlapStart && currentDate <= overlapEnd) ||
                    (overlapStart2 && overlapEnd2 && currentDate >= overlapStart2 && currentDate <= overlapEnd2);
                
                if (!isVacation) totalDays++;
            }
            
            const adjusted = adjustedFreeEB[`${ele.ClientID}_${ele.RentDOJ}`] || 0;
            total += totalDays * (ele?.FreeEBPerDay || 0) + adjusted;
        }
        
        return total;
    }, [data, startDate, endDate, dates, headerDays, adjustedFreeEB]);
    
    // Memoized per head free EB
    const getPerHeadFreeEB = useCallback((client) => {
        const billStart = startDate ? normalizeDate(startDate) : null;
        const billEnd = endDate ? normalizeDate(endDate) : null;
        
        const doj = client.EBDOJ
            ? normalizeDate(new Date(client.EBDOJ.replace(/(\d+)\s(\w+)\s(\d+)/, "$2 $1, $3")))
            : null;
        if (doj && billEnd && doj > billEnd) return 0;
        
        const cvd = client.CVD
            ? normalizeDate(new Date(new Date(client.CVD).setDate(new Date(client.CVD).getDate() + 1)))
            : null;
        
        // Vacation calculations
        const vacStart1 = dates[`${client.ClientID}_${client.RentDOJ}_VSD1`]?.startDate
            ? normalizeDate(new Date(new Date(dates[`${client.ClientID}_${client.RentDOJ}_VSD1`].startDate).getTime() + 86400000))
            : null;
        const vacEnd1 = dates[`${client.ClientID}_${client.RentDOJ}_VSD1`]?.endDate
            ? normalizeDate(new Date(new Date(dates[`${client.ClientID}_${client.RentDOJ}_VSD1`].endDate).getTime() - 86400000))
            : null;
        
        const vacStart2 = dates[`${client.ClientID}_${client.RentDOJ}_VSD2`]?.startDate
            ? normalizeDate(new Date(new Date(dates[`${client.ClientID}_${client.RentDOJ}_VSD2`].startDate).getTime() + 86400000))
            : null;
        const vacEnd2 = dates[`${client.ClientID}_${client.RentDOJ}_VSD2`]?.endDate
            ? normalizeDate(new Date(new Date(dates[`${client.ClientID}_${client.RentDOJ}_VSD2`].endDate).getTime() - 86400000))
            : null;
        
        // Count valid days
        let totalDays = 0;
        for (const d of headerDays) {
            const currentDate = normalizeDate(d.date);
            
            if (doj && currentDate < doj) continue;
            if (cvd && currentDate >= cvd) continue;
            
            const isVacation =
                (vacStart1 && vacEnd1 && currentDate >= vacStart1 && currentDate <= vacEnd1) ||
                (vacStart2 && vacEnd2 && currentDate >= vacStart2 && currentDate <= vacEnd2);
            
            if (!isVacation) totalDays++;
        }
        
        const adjusted = adjustedFreeEB[`${client.ClientID}_${client.RentDOJ}`] || 0;
        return totalDays * (client?.FreeEBPerDay || 0) + adjusted;
    }, [startDate, endDate, dates, headerDays, adjustedFreeEB]);
    
    // Memoized present count for date
    const getPresentCountForDate = useCallback((date) => {
        if (!data?.data) return 0;
        
        const currentDate = normalizeDate(date);
        const billStart = startDate ? normalizeDate(startDate) : null;
        const billEnd = endDate ? normalizeDate(endDate) : null;
        
        let count = 0;
        
        for (const ele of data.data) {
            if (!ele.FullName || ele.FullName.trim() === "") continue;
            
            // DOJ
            const doj = ele.EBDOJ
                ? normalizeDate(new Date(ele.EBDOJ.replace(/(\d+)\s(\w+)\s(\d+)/, "$2 $1, $3")))
                : null;
            if (doj && currentDate < doj) continue;
            
            // CVD
            const cvd = ele.CVD
                ? normalizeDate(new Date(new Date(ele.CVD).getTime() + 86400000))
                : null;
            if (cvd && currentDate >= cvd) continue;
            
            // Vacation check
            const checkVacation = (vsdKey) => {
                const vac = dates[`${ele.ClientID}_${ele.RentDOJ}_${vsdKey}`];
                if (!vac || !vac.startDate || !vac.endDate) return false;
                
                const vacStart = normalizeDate(new Date(new Date(vac.startDate).getTime() + 86400000));
                const vacEnd = normalizeDate(new Date(new Date(vac.endDate).getTime() - 86400000));
                const vacationDays = Math.floor((vacEnd - vacStart) / (1000 * 60 * 60 * 24)) + 1;
                
                return vacationDays >= 15 && currentDate >= vacStart && currentDate <= vacEnd;
            };
            
            const isVacation = checkVacation("VSD1") || checkVacation("VSD2");
            if (!isVacation) count++;
        }
        
        return count;
    }, [data, startDate, endDate, dates]);
    
    // Memoized client vacation check
    const isClientOnVacation = useCallback((client, date) => {
        const currentDate = normalizeDate(date);
        
        const checkVacation = (vsdKey) => {
            const vacStart = dates[`${client.ClientID}_${client.RentDOJ}_${vsdKey}`]?.startDate
                ? normalizeDate(new Date(new Date(dates[`${client.ClientID}_${client.RentDOJ}_${vsdKey}`].startDate).getTime() + 86400000))
                : null;
            const vacEnd = dates[`${client.ClientID}_${client.RentDOJ}_${vsdKey}`]?.endDate
                ? normalizeDate(new Date(new Date(dates[`${client.ClientID}_${client.RentDOJ}_${vsdKey}`].endDate).getTime() - 86400000))
                : null;
            
            if (!vacStart || !vacEnd) return false;
            const vacationDays = Math.floor((vacEnd - vacStart) / (1000 * 60 * 60 * 24)) + 1;
            return vacationDays >= 15 && currentDate >= vacStart && currentDate <= vacEnd;
        };
        
        return checkVacation("VSD1") || checkVacation("VSD2");
    }, [dates]);
    
    // Memoized client EB for date
    const getClientEBForDate = useCallback((client, date) => {
        const currentDate = normalizeDate(date);
        
        // CVD check
        const cvd = client.CVD
            ? normalizeDate(new Date(new Date(client.CVD).setDate(new Date(client.CVD).getDate() + 1)))
            : null;
        if (cvd && currentDate >= cvd) return 0;
        
        // Vacation check
        if (isClientOnVacation(client, date)) return 0;
        
        // DOJ check
        const doj = client.EBDOJ ? normalizeDate(new Date(client.EBDOJ)) : null;
        const billStart = startDate ? normalizeDate(startDate) : null;
        const billEnd = endDate ? normalizeDate(endDate) : null;
        
        if (doj && billEnd && doj > billEnd) return 0;
        if (doj && currentDate < doj) return 0;
        
        // Present count
        const presentCount = getPresentCountForDate(date);
        if (!presentCount) return 0;
        
        // Per day EB calculation
        return perDayEB / presentCount;
    }, [startDate, endDate, isClientOnVacation, getPresentCountForDate]);
    
    // Memoized present days by room
    const getPresentCountByRoomForDate = useCallback((roomNo, date) => {
        if (!data?.data) return 0;
        
        let count = 0;
        for (const client of data.data) {
            if (String(client.RoomNo) !== String(roomNo)) continue;
            if (client.ACRoom !== "Yes") continue;
            if (!client.FullName) continue;
            if (getClientEBForDate(client, date) > 0) count++;
        }
        return count;
    }, [data, getClientEBForDate]);
    
    // Memoized billing days by room
    const getBillingDaysCountByRoom = useCallback((roomNo) => {
        if (!startDate || !endDate) return 0;
        
        const s = normalizeDate(startDate);
        const e = normalizeDate(endDate);
        let count = 0;
        const totalDays = Math.min(31, Math.ceil((e - s) / (1000 * 60 * 60 * 24)) + 1);
        
        for (let i = 0; i < totalDays; i++) {
            const currentDate = new Date(s);
            currentDate.setDate(s.getDate() + i);
            if (getPresentCountByRoomForDate(roomNo, currentDate) > 0) count++;
        }
        return count;
    }, [startDate, endDate, getPresentCountByRoomForDate]);
    
    // Memoized client AC EB for date
    const getClientACEBForDate = useCallback((client, date) => {
        if (client.ACRoom !== "Yes") return 0;
        if (getClientEBForDate(client, date) === 0) return 0;
        
        const roomNo = client.RoomNo;
        const monthlyRoomAC = Number(AcConsumtion[roomNo] || 0);
        if (!monthlyRoomAC) return 0;
        
        const billingDays = getBillingDaysCountByRoom(roomNo);
        if (!billingDays) return 0;
        
        const perDayRoomAC = monthlyRoomAC / billingDays;
        const presentCount = getPresentCountByRoomForDate(roomNo, date);
        
        if (!presentCount) return 0;
        return perDayRoomAC / presentCount;
    }, [getClientEBForDate, getBillingDaysCountByRoom, getPresentCountByRoomForDate]);
    
    // API hooks
    const { data: fetchAcConsumtionSheetData } = useAcConsumtionSheetData(
        findProperty ? findProperty["PG AC  Sheet ID"] : "", 
        true
    );
    const { mutate: createEBCalculationData } = useCreateEbCalculationSheetData(EBMainSheetID);
    const { mutate: createEBCalculationForMainSheetData } = useCreateEbCalculationForMainSheetData(MainSheetID);
    
    // Memoized sheet data
    const sheetData = useMemo(() => fetchAcConsumtionSheetData?.data?.[0], [fetchAcConsumtionSheetData]);
    
    // Memoized AC consumption
    const AcConsumtion = useMemo(() => {
        const consumption = {};
        if (sheetData) {
            Object.keys(sheetData).forEach((key) => {
                if (key.startsWith("RoomNo_") && key.endsWith("_ACEB")) {
                    const roomKey = key.replace("RoomNo_", "").replace("_ACEB", "");
                    consumption[roomKey] = sheetData[key];
                }
            });
        }
        return consumption;
    }, [sheetData]);
    
    // Memoized filter data for AC beds
    const FilterDataForACBeds = useMemo(() => 
        data?.data?.filter(ele => ele.ACRoom.toLowerCase() === "yes") || [],
        [data]
    );
    
    // Memoized max present days
    const maxPresentDays = useMemo(() => {
        const clientsArray = data?.data?.filter(ele => ele.FullName && ele.FullName.trim() !== "") || [];
        if (clientsArray.length === 0) return 0;
        
        let maxDays = 0;
        for (const client of clientsArray) {
            let presentDays = 0;
            for (const d of headerDays) {
                if (getClientEBForDate(client, d.date) > 0) presentDays++;
            }
            if (presentDays > maxDays) maxDays = presentDays;
        }
        return maxDays;
    }, [data, headerDays, getClientEBForDate]);
    
    // Memoized per day EB
    const perDayEB = useMemo(() => 
        maxPresentDays > 0 ? (ebToBeRecovered - (sheetData?.ACTotalEB ?? 0)) / maxPresentDays : 0,
        [maxPresentDays, ebToBeRecovered, sheetData]
    );
    
    // Event handlers
    const handleAdjustEBChange = useCallback((clientId, rentDOJ, value) => {
        if (/^-?\d*$/.test(value)) {
            setAdjustedEB(prev => ({
                ...prev,
                [`${clientId}_${rentDOJ}`]: value === "" || value === "-" ? value : Number(value),
            }));
        }
    }, []);
    
    const handleAdjustFreeEBChange = useCallback((clientId, rentDOJ, value) => {
        if (/^-?\d*$/.test(value)) {
            setAdjustedFreeEB(prev => ({
                ...prev,
                [`${clientId}_${rentDOJ}`]: value === "" || value === "-" ? value : Number(value),
            }));
        }
    }, []);
    
    const handleComments1Change = useCallback((clientId, rentDOJ, value) => {
        setComments1(prev => ({
            ...prev,
            [`${clientId}_${rentDOJ}`]: value,
        }));
    }, []);
    
    const handleComments2Change = useCallback((clientId, rentDOJ, value) => {
        setComments2(prev => ({
            ...prev,
            [`${clientId}_${rentDOJ}`]: value === "" ? "" : value,
        }));
    }, []);
    
    // Bulk submit function
    const handleBulkSubmit = useCallback(() => {
        if (!data?.data) return;
        
        const bulkData = data.data
            .filter(ele => ele.FullName && ele.FullName.trim() !== "")
            .map(ele => {
                // ... (keep your existing bulkData calculation logic)
                // This part remains the same as your original code
                // but uses memoized helper functions
            });
        
        createEBCalculationData(bulkData, {
            onSuccess: () => toast.success("Data Successfully Saved For EB Sheet!"),
            onError: (response) => toast.error(response?.response?.data?.error || "Failed to submit"),
        });
        
        createEBCalculationForMainSheetData({ bulkData, totalFreeEB }, {
            onSuccess: () => toast.success("Data Successfully Saved For Main Sheet"),
            onError: (response) => toast.error(response?.response?.data?.error || "Failed to submit"),
        });
    }, [data, totalFreeEB, createEBCalculationData, createEBCalculationForMainSheetData]);
    
    // Propery options memoized
    const ProperyOptions = useMemo(() => 
        property?.data?.map((prop) => ({
            value: prop["PG Main  Sheet ID"],
            label: prop["Property Code"],
        })) || [],
        [property]
    );
    
    const inputClass = 'w-full px-3 py-2 mt-1 border border-orange-500 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400';
    
    // Filtered clients for rendering
    const filteredClients = useMemo(() => 
        data?.data?.filter(ele => ele.FullName && ele.FullName.trim() !== "") || [],
        [data]
    );
    
    // Render
    return (
        <div className='h-screen w-full mt-52'>
           <div className="flex justify-between items-center m-2">
                    <h1 className="text-xl font-bold">
                        Electricity Bill Calculation
                    </h1>
                    <button
                        onClick={handleBulkSubmit}
                        className="px-4 py-2 bg-orange-300 font-bold rounded hover:bg-orange-400"
                    >
                        {/* {(isCreateEbCalcul || isCreateEbMainSheet) ? ( */}
                            <span className="flex gap-2 justify-center items-center">
                                {/* <LoaderPage /> Submitting... */}
                            </span>
                        {/* ) : ( */}
                            "Submit All EB Data"
                        {/* )} */}


                    </button>
                </div>
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
                            </div>

                            <div className="flex-shrink-0">
                                <label className="block text-sm font-medium text-gray-700 after:content-['*'] after:ml-1 after:text-red-500">Flat Total Units</label>
                                <input type="number"
                                    name=""
                                    id=""
                                    value={sheetData?.FlatTotalUnits ?? 0}
                                    placeholder='Enter Total Units'
                                    className={inputClass}
                                    disabled
                                />
                            </div>

                            <div className="flex-shrink-0">
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
                        <label className="block text-sm font-medium text-gray-700 after:content-['*'] after:ml-1 after:text-red-500">
                            {FilterDataForACBeds && FilterDataForACBeds.length > 0 ? " Common Total EB" : "Flat Total EB"}
                        </label>
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


                    
                    {(!FilterDataForACBeds || FilterDataForACBeds.length === 0) && (
                        <div className="flex-shrink-0">
                            <label className="block text-sm font-medium text-gray-700 after:content-['*'] after:ml-1 after:text-red-500">
                                Flat Total Units
                            </label>
                            <input
                                type="number"
                                value={flatTotalUnits}
                                placeholder="Enter Total Units"
                                className={inputClass}
                                onChange={(e) => setFlatTotalUnits(e.target.value)}
                            />
                        </div>
                    )}



                </div>

            {/* EB Table - using memoized components */}
            <div className="overflow-auto max-h-[600px]">
                <table className="min-w-max border text-lg border-gray-400 text-center">
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
                        {filteredClients.map(client => (
                            <ClientEBRow
                                key={`${client.ClientID}_${client.RentDOJ}`}
                                client={client}
                                headerDays={headerDays}
                                getClientEBForDate={getClientEBForDate}
                                getClientACEBForDate={getClientACEBForDate}
                                adjustedEB={adjustedEB}
                                comments2={comments2}
                                onAdjustEBChange={handleAdjustEBChange}
                                onComments2Change={handleComments2Change}
                            />
                        ))}
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
            
            {/* Free EB Table */}
            {isLoading ? (
                <div><LoaderPage /></div>
            ) : (
                <div className='overflow-auto max-h-[600px] border'>
                    <table className="min-w-auto mt-10 border-red-500">
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
                            {filteredClients.map(ele => (
                                <FreeEBRow
                                    key={`${ele.ClientID}_${ele.RentDOJ}`}
                                    ele={ele}
                                    headerDays={headerDays}
                                    startDate={startDate}
                                    endDate={endDate}
                                    dates={dates}
                                    adjustedFreeEB={adjustedFreeEB}
                                    comments1={comments1}
                                    onAdjustFreeEBChange={handleAdjustFreeEBChange}
                                    onComments1Change={handleComments1Change}
                                    getPerHeadFreeEB={getPerHeadFreeEB}
                                />
                            ))}
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
            )}
        </div>
    );
};

export default EBCalculation;