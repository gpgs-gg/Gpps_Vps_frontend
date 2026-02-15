import React, { useState, useEffect, useMemo } from 'react';
import CryptoJS from 'crypto-js';
import { format, subMonths } from "date-fns"; // date-fns is handy
import { usePropertyData, usePropertySheetData } from './services';
import { SECRET_KEY } from '../../../Config';
import LoaderPage from '../../NewBooking/LoaderPage';
import OR from '../../../logo/QR.jpeg'
import { toast } from 'react-toastify';
import { MdContentCopy } from "react-icons/md";



const Payments = () => {

    const [activeTab, setActiveTab] = useState('overview');
    const [createTicket, setCreateTicket] = useState(false)
    const [decryptedUser, setDecryptedUser] = useState(null);
    const [view, setView] = useState(false);

    const { data: propertyDataFromApi } = usePropertyData();

    // Use useMemo to prevent unnecessary recalculations
    const filteredPropertySheetData = useMemo(() => {
        return propertyDataFromApi?.data?.filter(
            (ele) => ele["Property Code"] === decryptedUser?.employee?.PropertyCode
        );
    }, [propertyDataFromApi, decryptedUser?.employee?.PropertyCode]);



    const mainSheetId = useMemo(() => {
        if (!filteredPropertySheetData || filteredPropertySheetData.length === 0) return [];

        const sheetBaseId = filteredPropertySheetData[0]["PG Main  Sheet ID"];
        const bedCount = filteredPropertySheetData[0]["Bed Count"];

        // Get last 6 months from current date (including current)
        const sheetIds = [];
        for (let i = 0; i < 4; i++) {
            const date = subMonths(new Date(), i); // i months ago
            const sheetName = format(date, "MMMyyyy"); // Format like "Sep2025"
            sheetIds.push(`${sheetBaseId},${sheetName},${bedCount}`);
        }

        return sheetIds;
    }, [filteredPropertySheetData]);


    const { data: pgMainSheetData } = usePropertySheetData(mainSheetId);
    const mainSheetDataForNameWise = useMemo(() => {
        return pgMainSheetData?.data?.length > 0
            ? pgMainSheetData?.data?.filter((ele) => ele.FullName === decryptedUser?.employee?.Name) : []
    }, [pgMainSheetData])
    useEffect(() => {
        const encrypted = localStorage.getItem('user');
        if (encrypted) {
            try {
                const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
                const decrypted = bytes.toString(CryptoJS.enc.Utf8);
                setDecryptedUser(JSON.parse(decrypted));
            } catch (error) {
                console.error('Failed to decrypt user:', error);
            }
        }
        // const timer = setInterval(() => {
        //     setCurrentTime(new Date());
        // }, 1000);

        // return () => clearInterval(timer);
    }, []);

    return (
        //         <div className="max-w-full">
        //             <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        //                 <div className="lg:col-span-1">
        //                     <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
        //                         <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        //                             <i className="fas fa-credit-card mr-2 text-orange-500"></i>
        //                             Payment Summary
        //                         </h2>
        //                         <div className="space-y-4">
        //                             <div className="flex justify-between p-3 bg-red-50 rounded-lg">
        //                                 <p className="text-red-700 font-medium">Current Due</p>
        //                                 <p className="font-semibold text-red-600">{mainSheetDataForNameWise.length > 0 ? mainSheetDataForNameWise[0]?.CurDueAmt : "loading..."}</p>
        //                             </div>
        //                             <div className="flex justify-between p-3 bg-orange-50 rounded-lg">
        //                                 <p className="text-orange-700 font-medium">Due Date</p>
        // <p className=" text-gray-900">{`${new Date().getDate()} ${new Date().toLocaleString('default', { month: 'short' })} ${new Date().getFullYear()}`}</p>
        //                             </div>
        //                             <div className="flex justify-between p-3 bg-green-50 rounded-lg">
        //                                 <p className="text-green-700 font-medium">Previous Due</p>
        //                                 <p className="font-semibold text-green-600">{mainSheetDataForNameWise.length > 0 ? mainSheetDataForNameWise[0]?.PreDueAmt : "loading..."}</p>
        //                             </div>
        //                             <div className="pt-4 border-t">
        //                                 <button className="w-full bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 transition duration-200 flex items-center justify-center">
        //                                     <i className="fas fa-wallet mr-2"></i>
        //                                     Pay Now
        //                                 </button>
        //                             </div>
        //                         </div>
        //                     </div>
        //                 </div>

        //                 <div className="lg:col-span-4">
        //                     <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
        //                         <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        //                             <i className="fas fa-history mr-2 text-orange-500"></i>
        //                             Payment History
        //                         </h2>
        //                         <div className="overflow-x-auto">


        //                             <table className="min-w-full divide-y divide-gray-200">
        //                                 <thead>
        //                                     <tr>
        //                                         <th className="px-4 py-3 text-left text-xs font-medium text-orange-700 uppercase tracking-wider">Month</th>
        //                                         <th className="px-4 py-3 text-left text-xs font-medium text-orange-700 uppercase tracking-wider">Rent</th>
        //                                         <th className="px-4 py-3 text-left text-xs font-medium text-orange-700 uppercase tracking-wider">Deposit</th>
        //                                         <th className="px-4 py-3 text-left text-xs font-medium text-orange-700 uppercase tracking-wider">Processing Fees</th>
        //                                         <th className="px-4 py-3 text-left text-xs font-medium text-orange-700 uppercase tracking-wider">Electricity Bill</th>
        //                                         <th className="px-4 py-3 text-left text-xs font-medium text-orange-700 uppercase tracking-wider">Adjusted Electricity Bill</th>
        //                                         <th className="px-4 py-3 text-left text-xs font-medium text-orange-700 uppercase tracking-wider">Adjusted Amount</th>
        //                                         <th className="px-4 py-3 text-left text-xs font-medium text-orange-700 uppercase tracking-wider">Total Receivable Amount</th>
        //                                         <th className="px-4 py-3 text-left text-xs font-medium text-orange-700 uppercase tracking-wider">Total Received Amount</th>
        //                                         <th className="px-4 py-3 text-left text-xs font-medium text-orange-700 uppercase tracking-wider">Current Due</th>
        //                                         <th className="px-4 py-3 text-left text-xs font-medium text-orange-700 uppercase tracking-wider">Previous Due</th>
        //                                     </tr>
        //                                 </thead>
        //                                 <tbody className="divide-y divide-gray-200">
        //                                     {mainSheetDataForNameWise &&
        //                                         mainSheetDataForNameWise
        //                                             .filter((ele) => [
        //                                                 "__month",
        //                                                 "RentAmt",
        //                                                 "DA",
        //                                                 "ProFees",
        //                                                 "EBAmt",
        //                                                 "AdjEB",
        //                                                 "AdjAmt",
        //                                                 "ToRcableAmt",
        //                                                 "ToRcvedAmt",
        //                                                 "CurDueAmt",
        //                                                 "PreDueAmt"
        //                                             ]
        //                                                 .every((key) => ele.hasOwnProperty(key)))
        //                                             .map((payment, index) => (
        //                                                 <tr key={index} className="hover:bg-orange-50">
        //                                                     <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{payment.__month}</td>
        //                                                     <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">₹. {payment.RentAmt}</td>
        //                                                     <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">₹. {payment.DA}</td>
        //                                                     <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">₹. {payment.ProFees}</td>
        //                                                     <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">₹. {payment.EBAmt}</td>
        //                                                     <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">₹. {payment.AdjEB}</td>
        //                                                     <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">₹. {payment.AdjAmt}</td>
        //                                                     <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">₹. {payment.ToRcableAmt}</td>
        //                                                     <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">₹. {payment.ToRcvedAmt}</td>
        //                                                     <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">₹. {payment.CurDueAmt}</td>
        //                                                     <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">₹. {payment.PreDueAmt}</td>
        //                                                 </tr>
        //                                             ))}
        //                                 </tbody>
        //                             </table>


        //                         </div>
        //                     </div>
        //                 </div>
        //             </div>
        //         </div>
        <div className="max-w-full">
            <div className="grid grid-cols-1 md:px-6 lg:grid-cols-6 gap-6">
                <div className="bg-white flex flex-col flex-wrap rounded-lg shadow-sm px-4 border-orange-300 hover:shadow-md transition-shadow border lg:col-span-6">
                    <h2 className="text-2xl font-semibold text-gray-900 p-2  flex items-center">
                        <i className="fas fa-credit-card mr-2 text-orange-500"></i>
                        Payment Summary
                    </h2>
                    <div className="flex justify-evenly flex-wrap gap-3 mb-6">
                        <div className="flex gap-10  justify-between p-3 bg-white border border-orange-300 rounded-lg ">
                            <p className="text-gray-700 font-bold">Date</p>
                            <p className="font-semibold text-gray-700">{`${new Date().getDate()} ${new Date().toLocaleString('default', { month: 'short' })} ${new Date().getFullYear()}`}</p>
                        </div>
                        <div className="flex gap-10  justify-between p-3 bg-white border border-orange-300 rounded-lg">
                            <p className="text-gray-700 font-bold">Current Month Due</p>
                            <p className="font-semibold text-gray-700">₹&nbsp;
                                {mainSheetDataForNameWise.length > 0
                                    ? mainSheetDataForNameWise[0]?.CurDueAmt
                                    : "loading..."}
                            </p>
                        </div>
                        <div className="flex gap-10  justify-between p-3 bg-white border border-orange-300 rounded-lg">
                            <p className="text-gray-700 font-bold">Previous Due</p>
                            <p className="font-semibold text-gray-700">₹&nbsp;
                                {mainSheetDataForNameWise.length > 0
                                    ? mainSheetDataForNameWise[0]?.PreDueAmt
                                    : "loading..."}
                            </p>
                        </div>
                        <div className="flex gap-10  justify-between p-3 bg-white border border-orange-300 rounded-lg">
                            <p className="text-gray-700 font-bold">Deposit Due</p>
                            <p className="font-semibold text-gray-700">₹&nbsp;
                                {mainSheetDataForNameWise.length > 0
                                    ? mainSheetDataForNameWise[0]?.DADue
                                    : "loading..."}
                            </p>
                        </div>
                        <div className="flex gap-10  justify-between p-3 bg-gray-100 border border-orange-300 rounded-lg">
                            <p className="text-gray-700 font-bold">Total Due</p>
                            <p className="font-semibold text-gray-700">₹&nbsp;
                                {mainSheetDataForNameWise.length > 0
                                    ? Number(mainSheetDataForNameWise[0]?.CurDueAmt) + Number(mainSheetDataForNameWise[0]?.PreDueAmt) + Number(mainSheetDataForNameWise[0]?.DADue)
                                    : "loading..."}
                            </p>
                        </div>


                        <div className=" flex justify-center items-center">
                            <button onClick={() => setView(!view)} className="w-fit text-xl bg-orange-300 text-black font-bold py-3 px-10 rounded-md hover:bg-orange-400 transition duration-200 flex items-center justify-center">
                                {/* <i className="fas fa-wallet mr-2"></i> */}
                                Pay Now
                            </button>
                        </div>
                    </div>


                    {view && (
                        <div
                            onClick={() => setView(false)}
                            className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center"
                        >
                            <div
                                className="bg-gray-50 w-full max-w-4xl rounded-lg shadow-xl p-6 overflow-y-auto max-h-[90vh] relative"
                                onClick={(e) => e.stopPropagation()} // Prevents modal close on inner click
                            >
                                {/* Close Button */}
                                <button
                                    onClick={() => setView(null)}
                                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors"
                                    aria-label="Close Modal"
                                >
                                    <i className="fas fa-times text-2xl"></i>
                                </button>

                                {/* Modal Title */}
                                <h2 className="text-3xl font-semibold  border-b text-gray-800">
                                    Bank Details
                                </h2>

                                {/* Modal Content */}
                                <div className="p-4 text-gray-800 text-sm">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8  rounded-md">

                                        {/* Bank Information */}
                                        <div className="space-y-4 text-base mt-1 p-5 border shadow-lg rounded-lg border-orange-300">
                                            <h3 className="text-xl font-semibold border-b ">Account Info</h3>
                                            {[
                                                ['Bank', 'HDFC'],
                                                ['Account Type', 'Current'],
                                                ['Account Number', '50200044250311'],
                                                ['IFSC Code', 'HDFC0000258'],
                                                ['Branch', 'Nerul (East), Sector 23'],
                                                ['Account Name', 'Gopal Paying Guest Services'],
                                                ['UPI ID', 'kamleshwarkodag-1@okhdfcbank'],
                                            ].map(([label, value], idx) => (
                                                <div key={idx} className="flex items-center">
                                                    <span className="w-40 font-medium">{label}:</span>
                                                    <span className="mr-2">{value}</span>

                                                    {/* Show copy icon only for UPI ID or Account Number */}
                                                    {(label === 'UPI ID' || label === 'Account Number'|| label === 'IFSC Code' || label === 'Account Name') && (
                                                        <button
                                                            className="ml-2 text-blue-600 hover:text-blue-800 text-sm"
                                                            onClick={() => {
                                                                navigator.clipboard.writeText(value);
                                                                toast.success(`${label} copied to clipboard!`);
                                                            }}
                                                        >
                                                         <MdContentCopy/>
                                                        </button>
                                                    )}
                                                </div>

                                            ))}
                                        </div>
                                        {/* QR Code Section */}
                                        <div className="flex flex-col items-center justify-center text-center space-y-2 shadow-lg rounded-lg border border-orange-300">
                                            <h3 className="text-lg font-semibold border-b text-gray-800">Scan QR to Pay</h3>
                                            <img
                                                src={OR}// Replace with actual image path
                                                alt="QR Code for UPI Payment"
                                                className="w-96 h-96 object-cover border border-gray-300 rounded"
                                            />
                                            <p className="text-sm pb-3 text-gray-500">
                                                Use any UPI app to scan and pay securely
                                            </p>
                                        </div>

                                    </div>
                                </div>

                                {/* Optional: Add WorkLogs or Attachments sections below here */}
                            </div>
                        </div>
                    )}





                </div>


                <div className="lg:col-span-6">
                    <div className="bg-white border border-orange-300 rounded-lg shadow-sm p-6 hover:shadow-md ">
                        <h2 className="text-2xl font-semibold text-gray-900 flex items-center mb-4">
                            <span className='flex items-center justify-center'>
                                <i className="fas fa-history mr-2 text-orange-500"></i>
                                Payment History <span className='mt-5 ml-10'>{mainSheetDataForNameWise?.length === 0 && <LoaderPage />}</span>
                            </span>
                        </h2>

                        <div className="overflow-x-auto">

                            <table className="min-w-[1200px] divide-y divide-orange-300">
                                <thead>
                                    <tr>
                                        <th className="text-left sticky  left-0 text-lg font-bold bg-orange-300 text-black  whitespace-nowrap px-4 py-2">Month</th>
                                        <th className="text-left text-lg font-bold bg-orange-300 text-black  whitespace-nowrap px-4 py-2">Rent</th>
                                        {/* <th className="text-left text-lg font-bold bg-orange-300 text-black  whitespace-nowrap px-4 py-2">Deposit</th> */}
                                        {/* <th className="text-left text-lg font-bold bg-orange-300 text-black  whitespace-nowrap px-4 py-2">Processing Fees</th> */}
                                        <th className="text-left text-lg font-bold bg-orange-300 text-black  whitespace-nowrap px-4 py-2">Electricity Bill</th>
                                        <th className="text-left text-lg font-bold bg-orange-300 text-black  whitespace-nowrap px-4 py-2">Adjusted Electricity Bill</th>
                                        <th className="text-left text-lg font-bold bg-orange-300 text-black  whitespace-nowrap px-4 py-2">Adjusted Amount</th>
                                        <th className="text-left text-lg font-bold bg-orange-300 text-black  whitespace-nowrap px-4 py-2">Total Receivable Amount</th>
                                        <th className="text-left text-lg font-bold bg-orange-300 text-black  whitespace-nowrap px-4 py-2">Total Received Amount</th>
                                        <th className="text-left text-lg font-bold bg-orange-300 text-black  whitespace-nowrap px-4 py-2">Current Due</th>
                                        <th className="text-left text-lg font-bold bg-orange-300 text-black  whitespace-nowrap px-4 py-2">Previous Due</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">


                                    {mainSheetDataForNameWise &&
                                        mainSheetDataForNameWise
                                            .filter((ele) =>
                                                [
                                                    "__month",
                                                    "RentAmt",
                                                    "DA",
                                                    "ProFees",
                                                    "EBAmt",
                                                    "AdjEB",
                                                    "AdjAmt",
                                                    "ToRcableAmt",
                                                    "ToRcvedAmt",
                                                    "CurDueAmt",
                                                    "PreDueAmt",
                                                ].every((key) => ele.hasOwnProperty(key))
                                            )
                                            .map((payment, index) => (
                                                <tr key={index} className="hover:bg-[#F8F9FB]">
                                                    <td className="px-4 py-7 sticky bg-white left-0 whitespace-nowrap text-lg font-medium text-gray-900">{payment.__month}</td>
                                                    <td className="px-4 py-7 whitespace-nowrap text-lg text-gray-500">₹ {payment.RentAmt}</td>

                                                    {/* ✅ Show Deposit only for first row */}
                                                    {/* <td className="px-4 py-7 whitespace-nowrap text-lg text-gray-500">
                                                        {index === mainSheetDataForNameWise.length - 1 ? `₹ ${payment.DA}` : '₹ 0'}
                                                    </td> */}
                                                    {/* <td className="px-4 py-7 whitespace-nowrap text-lg text-gray-500">
                                                        {index === mainSheetDataForNameWise.length - 1 ? `₹ ${payment.ProFees}` : '₹ 0'}
                                                    </td> */}
                                                    <td className="px-4 py-7 whitespace-nowrap text-lg text-gray-500">₹ {payment.EBAmt}</td>
                                                    <td className="px-4 py-7 whitespace-nowrap text-lg text-gray-500">₹ {payment.AdjEB}</td>
                                                    <td className="px-4 py-7 whitespace-nowrap text-lg text-gray-500">₹ {payment.AdjAmt}</td>
                                                    <td className="px-4 py-7 whitespace-nowrap text-lg text-gray-500">₹ {payment.ToRcableAmt}</td>
                                                    <td className="px-4 py-7 whitespace-nowrap text-lg text-gray-500">₹ {payment.ToRcvedAmt}</td>
                                                    <td className="px-4 py-7 whitespace-nowrap text-lg text-gray-500">₹ {payment.CurDueAmt}</td>
                                                    <td className="px-4 py-7 whitespace-nowrap text-lg text-gray-500">₹ {payment.PreDueAmt}</td>
                                                </tr>

                                            ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Payments