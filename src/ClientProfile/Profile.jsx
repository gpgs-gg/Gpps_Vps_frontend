import React, { useState, useEffect, useMemo } from 'react';
import { usePropertyData, usePropertySheetData } from '../components_office_use_only/TicketSystem/ClientActions/services';
import CryptoJS from 'crypto-js';
import { SECRET_KEY } from "../Config";
import CreateTicket from './CreateTicket';
import { format, subMonths } from "date-fns"; // date-fns is handy

const pgClientData = {
    personalInfo: {
        name: "Rahul Sharma",
        profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
        phone: "+91 98765 43210",
        email: "rahul.sharma@example.com",
        emergencyContact: "+91 98765 43211 (Parent)",
        idProof: "Aadhar Card - XXXX XXXX 5678",
        dob: "15 March 1998",
        bloodGroup: "B+",
        occupation: "Software Engineer",
        company: "Tech Solutions Pvt. Ltd."
    },
    pgDetails: {
        pgName: "Elite PG for Gents",
        roomNo: "A-204",
        sharingType: "2 Sharing",
        checkInDate: "15 June 2023",
        duration: "6 Months",
        rent: "₹12,000/month",
        deposit: "₹15,000",
        address: "H-12, Sector 63, Noida, Uttar Pradesh - 201301",
        managerName: "Vikram Singh",
        managerContact: "+91 98765 12345"
    },
    paymentInfo: {
        currentDue: "₹12,000",
        dueDate: "5 October 2023",
        previousDue: "₹0",
        paymentHistory: [
            { month: "September 2023", amount: "₹12,000", status: "Paid", date: "2 Sep 2023" },
            { month: "August 2023", amount: "₹12,000", status: "Paid", date: "1 Aug 2023" },
            { month: "July 2023", amount: "₹12,000", status: "Paid", date: "3 Jul 2023" }
        ]
    },
    complaints: [
        { id: "CMP001", date: "20 Sep 2023", category: "Housekeeping", status: "Resolved", description: "Room not cleaned properly" },
        { id: "CMP002", date: "15 Sep 2023", category: "Maintenance", status: "In Progress", description: "AC not working" },
        { id: "CMP003", date: "5 Sep 2023", category: "WiFi", status: "Resolved", description: "Internet connectivity issue" }
    ]
};

function Profile() {
    const [activeTab, setActiveTab] = useState('overview');
    const [createTicket, setCreateTicket] = useState(false)
    const [decryptedUser, setDecryptedUser] = useState(null);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [uploadedDocs, setUploadedDocs] = useState({
        kyc: true,
        agreement: true,
        checkIn: false
    });


    const { data: propertyDataFromApi } = usePropertyData();
      console.log("decryptedUser?.employee?.PropertyCode", decryptedUser?.employee?.PropertyCode)
    // Use useMemo to prevent unnecessary recalculations
    const filteredPropertySheetData = useMemo(() => {
        return propertyDataFromApi?.data?.filter(
            (ele) => ele["Property Code"] === decryptedUser?.employee?.PropertyCode
        );
    }, [propertyDataFromApi, decryptedUser?.employee?.PropertyCode]);

         console.log("filteredPropertySheetData", filteredPropertySheetData)

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
        return pgClientData && pgMainSheetData?.data?.length > 0
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

    const [propertyData, setPropertyData] = useState(null);
    useEffect(() => {
        if (filteredPropertySheetData) {
            setPropertyData(filteredPropertySheetData);
        }
    }, [filteredPropertySheetData]);

    const handleDocUpload = (docType) => {
        setUploadedDocs(prevState => ({
            ...prevState,
            [docType]: true
        }));
    };
    const tabs = [
        { id: 'overview', label: 'Overview', icon: 'fa-home' },
        { id: 'personal', label: 'Personal Info', icon: 'fa-user' },
        { id: 'payment', label: 'Payments', icon: 'fa-credit-card' },
        { id: 'complaints', label: 'Complaints', icon: 'fa-exclamation-circle' },
        { id: 'documents', label: 'Documents', icon: 'fa-file' }
    ];

    // Render different tab content
    const renderTabContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
                            <div className="lg:col-span-2">
                                <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                        <i className="fas fa-home mr-2 text-orange-500"></i>
                                        PG Accommodation Details
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="md:col-span-2 p-3 bg-orange-50 rounded-lg">
                                            <p className="text-sm text-orange-700 font-medium">Property Address</p>
                                            <p className="font-medium text-gray-900">
                                                {propertyData ? propertyData[0]?.["Property Address"] : "loading..."}
                                            </p>
                                        </div>
                                        <div className="p-3 bg-orange-50 rounded-lg">
                                            <p className="text-sm text-orange-700 font-medium">Property Code</p>
                                            <p className="font-medium text-gray-900">{propertyData ? propertyData[0]?.["Property Code"] : "loading..."} </p>
                                        </div>
                                        <div className="p-3 bg-orange-50 rounded-lg">
                                            <p className="text-sm text-orange-700 font-medium">Wifi Name</p>
                                            <p className="font-medium text-gray-900">{propertyData ? propertyData[0]?.["WiFi Name"] : "loading..."}</p>
                                        </div>
                                        <div className="p-3 bg-orange-50 rounded-lg">
                                            <p className="text-sm text-orange-700 font-medium">Wifi Password</p>
                                            <p className="font-medium text-gray-900">{propertyData ? propertyData[0]?.["WiFi Pwd"] : "loading..."}</p>

                                        </div>
                                        <div className="p-3 bg-orange-50 rounded-lg">
                                            <p className="text-sm text-orange-700 font-medium">Date Of Joining</p>
                                            <p className="font-medium text-gray-900">{decryptedUser?.doj}</p>
                                        </div>
                                        <div className="p-3 bg-orange-50 rounded-lg">
                                            <p className="text-sm text-orange-700 font-medium">Security Deposit</p>
                                            <p className="font-medium text-gray-900">{mainSheetDataForNameWise.length > 0 ? mainSheetDataForNameWise[0]?.DA : "loading..."}</p>
                                        </div>
                                        <div className="p-3 bg-orange-50 rounded-lg">
                                            <p className="text-sm text-orange-700 font-medium">Monthly Rent</p>
                                            <p className="font-medium text-gray-900">{mainSheetDataForNameWise.length > 0 ? mainSheetDataForNameWise[0]?.MFR : "loading..."}</p>
                                        </div>
                                        <div className="p-3 md:col-span-2 bg-orange-50 rounded-lg">
                                            <p className="text-sm font-bold">Electricity Bill Details</p>
                                            <div className='grid grid-cols-2 md:grid-cols-4 gap-2 mt-2'>
                                                <div className="p-2 bg-white rounded">
                                                    <p className="text-xs text-orange-600 font-medium">Consumer No.</p>
                                                    <p className="font-medium text-gray-900">Not available</p>
                                                </div>
                                                <div className="p-2 bg-white rounded">
                                                    <p className="text-xs text-orange-600 font-medium">Billing Cycle</p>
                                                    <p className="font-medium text-gray-900">Monthly</p>
                                                </div>
                                                <div className="p-2 bg-white rounded">
                                                    <p className="text-xs text-orange-600 font-medium">Last Bill</p>
                                                    <p className="font-medium text-gray-900">₹1,200</p>
                                                </div>
                                                <div className="p-2 bg-white rounded">
                                                    <p className="text-xs text-orange-600 font-medium">Due Date</p>
                                                    <p className="font-medium text-gray-900">15th each month</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-6 pt-4 border-t">
                                        <h3 className="text-md font-medium text-gray-900 mb-2 flex items-center">
                                            <i className="fas fa-user-tie mr-2 text-orange-500"></i>
                                            PG Manager
                                        </h3>
                                        <div className="flex items-center p-3 bg-orange-50 rounded-lg">
                                            <div className="bg-orange-100 rounded-full p-2 mr-3">
                                                <i className="fas fa-user-tie text-orange-600"></i>
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{pgClientData.pgDetails.managerName}</p>
                                                <p className="text-sm text-orange-700">{pgClientData.pgDetails.managerContact}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'personal':
                return (
                    <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
                        <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                                <i className="fas fa-user-circle mr-2 text-orange-500"></i>
                                Personal Information
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-3 bg-orange-50 rounded-lg">
                                    <p className="text-sm text-orange-700 font-medium">
                                        Name
                                    </p>
                                    <p className="font-medium text-gray-900">{decryptedUser.name}</p>
                                </div>
                                <div className="p-3 bg-orange-50 rounded-lg">
                                    <p className="text-sm text-orange-700 font-medium">
                                        Phone
                                    </p>
                                    <p className="font-medium text-gray-900">{decryptedUser.calling}</p>
                                </div>
                                <div className="p-3 bg-orange-50 rounded-lg">
                                    <p className="text-sm text-orange-700 font-medium">
                                        Email Id
                                    </p>
                                    <p className="font-medium text-gray-900">{decryptedUser.loginId}</p>
                                </div>
                                <div className="p-3 bg-orange-50 rounded-lg">
                                    <p className="text-sm text-orange-700 font-medium">
                                        Id Proof
                                    </p>
                                    <p className="font-medium text-gray-900">Aadhaar Card - {decryptedUser.aadharNo}</p>
                                </div>
                                <div className="p-3 bg-orange-50 rounded-lg">
                                    <p className="text-sm text-orange-700 font-medium">
                                        Date Of Birth
                                    </p>
                                    <p className="font-medium text-gray-900">{decryptedUser.dob}</p>
                                </div>
                                <div className="p-3 bg-orange-50 rounded-lg">
                                    <p className="text-sm text-orange-700 font-medium">
                                        Blood Group
                                    </p>
                                    <p className="font-medium text-gray-900">{decryptedUser.bloodGroup}</p>
                                </div>
                                <div className="p-3 bg-orange-50 rounded-lg">
                                    <p className="text-sm text-orange-700 font-medium">
                                        Occupation
                                    </p>
                                    <p className="font-medium text-gray-900">{decryptedUser.occupation}</p>
                                </div>
                                <div className="p-3 bg-orange-50 rounded-lg">
                                    <p className="text-sm text-orange-700 font-medium">
                                        Organisation
                                    </p>
                                    <p className="font-medium text-gray-900">{decryptedUser.organisation}</p>
                                </div>
                                <div className="p-3 bg-orange-50 rounded-lg">
                                    <p className="text-sm text-orange-700 font-medium">
                                        Emergancy Cantact Name 1
                                    </p>
                                    <p className="font-medium text-gray-900">{decryptedUser.calling}</p>
                                </div>
                                <div className="p-3 bg-orange-50 rounded-lg">
                                    <p className="text-sm text-orange-700 font-medium">
                                        Emergancy Cantact No.1
                                    </p>
                                    <p className="font-medium text-gray-900">{decryptedUser.calling}</p>
                                </div>
                                <div className="p-3 bg-orange-50 rounded-lg">
                                    <p className="text-sm text-orange-700 font-medium">
                                        Emergancy Cantact Name 2
                                    </p>
                                    <p className="font-medium text-gray-900">{decryptedUser.calling}</p>
                                </div>
                                <div className="p-3 bg-orange-50 rounded-lg">
                                    <p className="text-sm text-orange-700 font-medium">
                                        Emergancy Cantact No.2
                                    </p>
                                    <p className="font-medium text-gray-900">{decryptedUser.calling}</p>
                                </div>
                                <div className="p-3 bg-orange-50 rounded-lg">
                                    <p className="text-sm text-orange-700 font-medium">
                                        Permanent Address
                                    </p>
                                    <p className="font-medium text-gray-900">{decryptedUser.calling}</p>
                                </div>
                                <div className="p-3 bg-orange-50 rounded-lg">
                                    <p className="text-sm text-orange-700 font-medium">
                                        Temparary Address
                                    </p>
                                    <p className="font-medium text-gray-900">{decryptedUser.calling}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'payment':
                return (
                    <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                        <i className="fas fa-credit-card mr-2 text-orange-500"></i>
                                        Payment Summary
                                    </h2>
                                    <div className="space-y-4">
                                        <div className="flex justify-between p-3 bg-red-50 rounded-lg">
                                            <p className="text-red-700 font-medium">Current Due</p>
                                            <p className="font-semibold text-red-600">{mainSheetDataForNameWise.length > 0 ? mainSheetDataForNameWise[0]?.CurDueAmt : "loading..."}</p>
                                        </div>
                                        <div className="flex justify-between p-3 bg-orange-50 rounded-lg">
                                            <p className="text-orange-700 font-medium">Due Date</p>
                                            <p className="font-semibold text-gray-900">{pgClientData.paymentInfo.dueDate}</p>
                                        </div>
                                        <div className="flex justify-between p-3 bg-green-50 rounded-lg">
                                            <p className="text-green-700 font-medium">Previous Due</p>
                                            <p className="font-semibold text-green-600">{mainSheetDataForNameWise.length > 0 ? mainSheetDataForNameWise[0]?.PreDueAmt : "loading..."}</p>
                                        </div>
                                        <div className="pt-4 border-t">
                                            <button className="w-full bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 transition duration-200 flex items-center justify-center">
                                                <i className="fas fa-wallet mr-2"></i>
                                                Pay Now
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-2">
                                <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                        <i className="fas fa-history mr-2 text-orange-500"></i>
                                        Payment History
                                    </h2>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead>
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-orange-700 uppercase tracking-wider">Month</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-orange-700 uppercase tracking-wider">Amount</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-orange-700 uppercase tracking-wider">Status</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-orange-700 uppercase tracking-wider">Payment Date</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {pgClientData.paymentInfo.paymentHistory.map((payment, index) => (
                                                    <tr key={index} className="hover:bg-orange-50">
                                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{payment.month}</td>
                                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{payment.amount}</td>
                                                        <td className="px-4 py-3 whitespace-nowrap">
                                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                                {payment.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{payment.date}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'complaints':
                return (
                    <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
                        <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                                    <i className="fas fa-exclamation-circle mr-2 text-orange-500"></i>
                                    My Complaints
                                </h2>
                                <button onClick={() => setCreateTicket(true)} className="bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 transition duration-200 flex items-center">
                                    <i className="fas fa-plus mr-2"></i>
                                    New Complaint
                                </button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead>
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-orange-700 uppercase tracking-wider">Complaint ID</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-orange-700 uppercase tracking-wider">Date</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-orange-700 uppercase tracking-wider">Category</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-orange-700 uppercase tracking-wider">Status</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-orange-700 uppercase tracking-wider">Description</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {pgClientData.complaints.map((complaint, index) => (
                                            <tr key={index} className="hover:bg-orange-50">
                                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{complaint.id}</td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{complaint.date}</td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{complaint.category}</td>
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${complaint.status === 'Resolved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                        {complaint.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-500">{complaint.description}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                );

            case 'documents':
                return (
                    <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
                        <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                                <i className="fas fa-folder-open mr-2 text-orange-500"></i>
                                Documents
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[
                                    { type: 'kyc', label: 'KYC Documents', desc: 'Aadhar, PAN, Photo', icon: 'fa-id-card' },
                                    { type: 'agreement', label: 'Rental Agreement', desc: 'Digitally signed document', icon: 'fa-file-signature' },
                                    { type: 'checkIn', label: 'Check-in Form', desc: 'Move-in details', icon: 'fa-sign-in-alt' }
                                ].map((doc) => (
                                    <div key={doc.type} className="text-center">
                                        <div className={`border-2 rounded-lg p-6 hover:shadow-md transition-shadow ${uploadedDocs[doc.type]
                                            ? "border-green-300 bg-green-50"
                                            : "border-orange-200 bg-orange-50"
                                            }`}>
                                            <i className={`fas text-3xl mb-3 ${uploadedDocs[doc.type] ? "fa-check-circle text-green-600" : `${doc.icon} text-orange-500`}`}></i>
                                            <h3 className="font-medium text-lg text-gray-900">{doc.label}</h3>
                                            <p className="text-sm text-orange-700 mt-2">{doc.desc}</p>
                                            {uploadedDocs[doc.type] ? (
                                                <button className="mt-4 text-green-600 text-sm font-medium flex items-center justify-center mx-auto">
                                                    <i className="fas fa-eye mr-1"></i> View Documents
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleDocUpload(doc.type)}
                                                    className="mt-4 bg-orange-600 text-white py-2 px-4 rounded-md text-sm hover:bg-orange-700 flex items-center justify-center mx-auto"
                                                >
                                                    <i className="fas fa-upload mr-1"></i> Upload Now
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            default:
                return <div>Select a tab</div>;
        }
    };

    return (
        <div className="min-h-screen bg-[#F8F9FB]">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <div className="flex items-center">
                        <h1 className="text-2xl font-bold text-orange-600">HGPS</h1>
                        <span className="ml-2 text-sm text-gray-600">We serve beyond business.</span>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{pgClientData.personalInfo.name}</p>
                        <p className="text-xs text-gray-500">
                            {currentTime.toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })} | {currentTime.toLocaleTimeString()}
                        </p>
                        <p className="text-xs text-orange-600 font-medium">Group Help</p>
                    </div>
                </div>
            </header>

            {/* Profile Header */}
            <div className="bg-white text-white">
                <div className="max-w-7xl mx-auto px-4 py-2 sm:px-6 lg:px-8"></div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <nav className="flex space-x-8 overflow-x-auto">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`py-4 px-1 font-medium whitespace-nowrap text-lg flex items-center hover:text-orange-600 ${activeTab === tab.id
                                    ? 'border-b-2 border-orange-500 text-orange-600'
                                    : 'text-gray-500 hover:text-orange-600'
                                    }`}
                            >
                                <i className={`fas ${tab.icon} mr-2`}></i>
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Tab Content */}
            {renderTabContent()}
            <CreateTicket createTicket={createTicket} setCreateTicket={setCreateTicket} />
            {/* Footer */}
            <footer className="bg-gray-800 text-white mt-8">
                <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <p className="text-gray-400">© 2025 GPGS. All rights reserved. | We serve beyond business.</p>
                        <p className="text-gray-500 text-sm mt-2">Customer Care: 10AM to 06PM | Emergency: 24 Hours</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Profile;