
import React, { useState, useEffect, useMemo } from 'react';
import { useClientDetails, usePropertyData, usePropertySheetData } from './services';
import CryptoJS from 'crypto-js';
import { format, subMonths } from "date-fns"; // date-fns is handy
import { SECRET_KEY } from '../../../Config';
import AgreementConfirmation from './AgreementConfirmation';


const OverView = () => {

    const [activeTab, setActiveTab] = useState('overview');
    const [createTicket, setCreateTicket] = useState(false)
    const [decryptedUser, setDecryptedUser] = useState(null);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [uploadedDocs, setUploadedDocs] = useState({
        kyc: true,
        agreement: true,
        checkIn: false
    });
    const { data: ClientDetails, isPending: isClientPending } = useClientDetails();
    const filteredClientData = ClientDetails?.data?.find(
        (ele) => ele.ClientID === decryptedUser?.clientID
    );



    const { data: propertyDataFromApi } = usePropertyData();
    // Use useMemo to prevent unnecessary recalculations
    const filteredPropertySheetData = useMemo(() => {
        return propertyDataFromApi?.data?.filter(
            (ele) => ele["Property Code"] === decryptedUser?.propertyCode
        );
    }, [propertyDataFromApi, decryptedUser?.propertyCode]);

    const mainSheetId = useMemo(() => {
        if (!filteredPropertySheetData || filteredPropertySheetData.length === 0) return [];
        const sheetBaseId = filteredPropertySheetData[0]["PG Main  Sheet ID"];
        const bedCount = filteredPropertySheetData[0]["Bed Count"];

        // Get last 6 months from current date (including current)
        const sheetIds = [];
        for (let i = 0; i < 2; i++) {
            const date = subMonths(new Date(), i); // i months ago
            const sheetName = format(date, "MMMyyyy"); // Format like "Sep2025"
            sheetIds.push(`${sheetBaseId},${sheetName},${bedCount}`);
        }
        return sheetIds;
    }, [filteredPropertySheetData]);


    const { data: pgMainSheetData } = usePropertySheetData(mainSheetId);

    const mainSheetDataForNameWise = useMemo(() => {
        return pgMainSheetData?.data?.length > 0
            ? pgMainSheetData?.data?.filter((ele) => ele.ClientID.trim() === decryptedUser.clientID.trim()) : []
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

    const [propertyData, setPropertyData] = useState(null);
    useEffect(() => {
        if (filteredPropertySheetData) {
            setPropertyData(filteredPropertySheetData);
        }
    }, [filteredPropertySheetData]);


    console.log(1111111111111, filteredClientData?.DigitalSelfDeclearationAccepted.toLowerCase());



    return (
        <div className="max-w-full mx-auto  py-6  lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
                <div className="lg:col-span-2">
                    <div className="bg-white border border-orange-300 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex bg-white px-2 py-1 w-fit rounded-lg items-center">
                            <i className="fas fa-home mr-2 text-orange-500 bg-white"></i>
                            PG Accommodation Details
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">

                            {/* Property Code */}
                            <div className="p-4 bg-white rounded-lg border border-orange-300 break-words">
                                <p className="text-lg font-bold">Property Code</p>
                                <p className="text-gray-900 font-medium">{propertyData?.[0]?.["Property Code"] || "loading..."}</p>
                            </div>

                            {/* Property Address */}
                            <div className="p-4 bg-white rounded-lg border border-orange-300 md:col-span-1 lg:col-span-5 break-words">
                                <p className="text-lg font-bold">Property Address</p>
                                <p className="text-gray-900 font-medium whitespace-pre-line">
                                    {propertyData?.[0]?.["Property Address"] || "loading..."}
                                </p>
                            </div>

                            {/* WiFi Name */}
                            <div className="p-4 bg-white rounded-lg border border-orange-300 break-words">
                                <p className="text-lg font-bold">WiFi Name</p>
                                <p className="text-gray-900 font-medium">{propertyData?.[0]?.["WiFi Name"] || "loading..."}</p>
                            </div>

                            {/* WiFi Password */}
                            <div className="p-4 bg-white rounded-lg border border-orange-300 break-words">
                                <p className="text-lg font-bold">WiFi Password</p>
                                <p className="text-gray-900 font-medium break-words">{propertyData?.[0]?.["WiFi Pwd"] || "loading..."}</p>
                            </div>

                            {/* Date of Joining */}
                            <div className="p-4 bg-white rounded-lg border border-orange-300 break-words">
                                <p className="text-lg font-bold">Date Of Joining</p>
                                <p className="text-gray-900 font-medium">{decryptedUser?.doj}</p>
                            </div>

                            {/* Check-In Date */}
                            <div className="p-4 bg-white rounded-lg border border-orange-300 break-words">
                                <p className="text-lg font-bold">Check-In Date</p>
                                <p className="text-gray-900 font-medium">{decryptedUser?.actualDoj}</p>
                            </div>

                            {/* Monthly Rent */}
                            <div className="p-4 bg-white rounded-lg border border-orange-300 break-words">
                                <p className="text-lg font-bold">Monthly Rent</p>
                                <p className="text-gray-900 font-medium">₹ {mainSheetDataForNameWise?.[0]?.MFR || "loading..."}</p>
                            </div>

                            {/* Security Deposit */}
                            <div className="p-4 bg-white rounded-lg border border-orange-300 break-words">
                                <p className="text-lg font-bold">Security Deposit</p>
                                <p className="text-gray-900 font-medium">₹ {mainSheetDataForNameWise?.[0]?.DA || "loading..."}</p>
                            </div>

                            {/* Electricity Bill Details */}
                            <div className="p-4 bg-white rounded-lg border border-orange-300 md:col-span-2 lg:col-span-6 break-words">
                                <p className="text-lg font-bold mb-2">Electricity Bill Details</p>
                                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">

                                    {/* Consumer No */}
                                    <div className="p-2 rounded border border-orange-300 break-words">
                                        <p className="text-base font-bold">Consumer No</p>
                                        <p className="text-gray-900 font-medium">{propertyData?.[0]?.EBConsumerNo || "loading..."}</p>
                                    </div>

                                    {/* Billing Unit */}
                                    <div className="p-2 rounded border border-orange-300 break-words">
                                        <p className="text-base font-bold">Billing Unit</p>
                                        <p className="text-gray-900 font-medium">{propertyData?.[0]?.EBBillingUnit || "loading..."}</p>
                                    </div>

                                    {/* Web Link */}
                                    <div className="p-2 rounded border border-orange-300 md:col-span-3 break-words">
                                        <p className="text-base font-bold">Power Company Web Link</p>
                                        {propertyData?.[0]?.EBPCWebLink ? (
                                            <a
                                                href={propertyData[0].EBPCWebLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline break-words"
                                            >
                                                {propertyData[0].EBPCWebLink}
                                            </a>
                                        ) : (
                                            <p className="text-gray-900 font-medium">loading...</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Emergency Contacts */}
                            <div className="p-4 bg-white rounded-lg border border-orange-300 md:col-span-6 break-words">
                                <p className="text-lg font-bold">
                                    Emergency / Customer Care Contacts , the following issues are considered emergencies. 
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">

                                    {/* Admin Team */}
                                    <div className="p-3 rounded border border-orange-300 space-y-2">
                                        <p className="font-bold text-base">Call / Chat<span className="text-md text-red-600">   (In emergency we prefer calls)</span></p> 

                                        <a href="tel:8928191814" className="block text-blue-600 hover:underline">📞 8928191814</a>
                                        <a href="tel:9326325181" className="block text-blue-600 hover:underline">📞 9326325181</a>
                                          <p>
                                        
                                          </p>
                                    </div>
                                    {/* Sales */}
                                   
                                   <div className='col-span-2'>
                                   
                                     <div className="p-3 rounded border border-orange-300  space-y-2">
                                        1. Electrical Short Circuit. <br />
                                        2. No Electricity (If the nearby houses or buildings are also affected, then the issue is external and beyond our control. The power will be restored after the power company fixes the issue) <br />
                                        3. No Water Supply (Please ensure that all taps are closed and there are no flush leakages. If the issue persists, report it to us immediately) <br />
                                        4. Medical Emergency Concerns

                                    </div>
                                   </div>

                                    {/* Maintenance */}
                                    {/* <div className="p-3 rounded border border-orange-300 space-y-2">
                                        <p className="font-bold text-base">Maintenance Team</p>
                                        <a href="tel:9326325181" className="block text-blue-600 hover:underline">📞 9326325181</a>
                                    </div>  */}
                                </div>
                            </div>
                            {/* Customer Care */}
                            {/* <div className="p-4 bg-white rounded-lg border border-orange-300 md:col-span-3">
                                <p className="text-lg font-bold">Customer Care</p>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">

                                    {/* Chat/Call */}
                            {/* <div className="p-3 rounded border border-orange-300 space-y-2">
                                        <p className="font-bold text-base">Chat / Call</p>
                                        <a href="tel:8928191814" className="block text-blue-600 hover:underline">📞 8928191814</a>
                                        <a href="tel:9326325181" className="block text-blue-600 hover:underline">📞 9326325181</a>
                                    </div> */}

                            {/* Review Link */}
                            {/* <div className="p-3 md:col-span-2 rounded border border-orange-300">
                                        <p className="font-bold text-base mb-1">Review Link</p>
                                        <a href="https://g.page/r/CX8tHckG2lUpEAE/review" target="_blank" rel="noopener noreferrer" className="text-blue-600 break-words hover:underline">
                                            https://g.page/r/CX8tHckG2lUpEAE/review
                                        </a>
                                        <p className="text-sm mt-2 text-gray-700">
                                            Gopal's Paying Guest Services would love your feedback. Post a review to our profile.
                                        </p>
                                    </div> */}
                            {/* </div> */}
                            {/* </div>  */}

                        </div>


                        {/* <div className="mt-6 pt-4 border-t">
                            <h3 className="text-md font-medium text-gray-900 mb-2 flex items-center">
                                <i className="fas fa-user-tie mr-2 text-orange-500"></i>
                                Emergency Contacts
                            </h3>
                            <div className="flex items-center border border-orange-300 p-3 rounded-xl">
                                <div className=" rounded-full p-2 mr-3">
                                    <i className="fas fa-user-tie text-orange-600"></i>
                                </div>
                                <div className='flex gap-10  flex-wrap '>
                                    <div className='px-10 py-5  rounded border border-orange-300'>
                                        <p className="font-bold text-black">Admin Team</p>
                                        <p className="text-sm text-orange-700">9044440222 <br /> 9503322757</p>
                                    </div>
                                    <div className='px-10 py-5  rounded border border-orange-300'>
                                        <p className="font-bold text-black">Maintenance Team</p>
                                        <p className="text-sm text-orange-700">9326325181</p>
                                    </div>
                                    <div className='px-10 py-5  rounded border border-orange-300'>
                                        <p className="font-bold text-black">Sales Team</p>
                                        <p className="text-sm text-orange-700">9326262292 <br /> 7021368623</p>
                                    </div>


                                </div>
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>
            {(filteredClientData?.DigitalSelfDeclearationAccepted.toLowerCase() === "false" ||
                filteredClientData?.DigitalSelfDeclearationAccepted === "") && (
                    <AgreementConfirmation />
                )}

        </div>
    )
}

export default OverView
