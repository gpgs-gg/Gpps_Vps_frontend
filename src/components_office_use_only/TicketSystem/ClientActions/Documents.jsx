import React, { useState, useRef, useEffect } from 'react';
import { useClientDetails, useUploadClientDocs } from './services';
import { useApp } from '../AppProvider';
import { toast } from 'react-toastify';
import LoaderPage from '../../NewBooking/LoaderPage';

const MAX_FILES = 5;

const Documents = () => {
    const { decryptedUser } = useApp();
    const [pendingDocType, setPendingDocType] = useState(null);
    const [uploadedDocs, setUploadedDocs] = useState({
        kyc: [],
        agreement: [],
    });
    const [existingDocs, setExistingDocs] = useState({
        kyc: [],
        agreement: [],
    });

    const [savedDocs, setSavedDocs] = useState({
        kyc: false,
        agreement: false,
    });

    const fileInputRefs = {
        kyc: useRef(),
        agreement: useRef(),
    };

    const { mutate: uploadClientDocs, isPending } = useUploadClientDocs();
    const { data: clientDetailsForDocuments, isLoading: isDocument } = useClientDetails();
    // 🔁 Load existing documents on component mount
    useEffect(() => {
        if (clientDetailsForDocuments?.data) {
            const filtered = clientDetailsForDocuments.data.find(
                (ele) => ele.Name === decryptedUser?.employee?.Name
            );

            if (filtered) {
                setExistingDocs({
                    kyc: filtered.KYCDocuments?.split(',')?.filter(Boolean) || [],
                    agreement: filtered.PGLegalDocuments?.split(',')?.filter(Boolean) || [],
                });
            }
        }
    }, [clientDetailsForDocuments, decryptedUser?.employee?.Name]);


    const handleFileChange = (type, event) => {
        const newFiles = Array.from(event.target.files);
        if (!newFiles.length) return;

        setUploadedDocs((prev) => {
            const currentFiles = prev[type] || [];
            const existingCount = existingDocs[type]?.length || 0;

            const totalFiles = currentFiles.length + newFiles.length + existingCount;
            if (totalFiles > MAX_FILES) {
                toast.dismiss();
                toast.error(`You can upload a maximum of ${MAX_FILES} files for ${type.toUpperCase()}.`);
                return prev;
            }

            // Rename files to ensure uniqueness
            const uniqueNewFiles = newFiles.map(file => {
                const timestamp = Date.now();
                const uniqueSuffix = `${timestamp}-${Math.floor(Math.random() * 10000)}`;
                const fileExtension = file.name.split('.').pop();
                const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
                const newFileName = `${uniqueSuffix}_${baseName}.${fileExtension}`;
                return new File([file], newFileName, { type: file.type });
            });
            return {
                ...prev,
                [type]: [...currentFiles, ...uniqueNewFiles],
            };
        });

        // Reset the input so selecting the same file again will trigger onChange
        event.target.value = '';
    };


    const handleUploadClick = (type) => {
        fileInputRefs[type].current.click();
    };

    const handleSave = (type) => {
        if (!uploadedDocs[type] || uploadedDocs[type].length === 0) {
            toast.warning("Please upload at least one document before saving.");
            return;
        }

        setPendingDocType(type); // Mark this doc type as pending

        const formData = new FormData();

        uploadedDocs[type].forEach((file) => {
            formData.append('files', file);
        });

        formData.append('ID', decryptedUser?.employee?.ClientID);
        formData.append('propertyCode', decryptedUser?.employee?.PropertyCode);
        formData.append('name', decryptedUser?.employee?.Name);
        formData.append(
            'updateField',
            type === 'kyc' ? 'KYCDocuments' : 'PGLegalDocuments'
        );

        formData.append(
            'DocumentUploadedStatus',
            JSON.stringify({
                kyc: type === 'kyc',
                agreement: type === 'agreement',
            })
        );

        // ✅ Trigger mutation with success and error handlers
        uploadClientDocs(formData, {
            onSuccess: () => {
                toast.success(`${type.toUpperCase()} documents uploaded successfully.`);

                setUploadedDocs((prev) => ({
                    ...prev,
                    [type]: [],
                }));

                setSavedDocs((prev) => ({
                    ...prev,
                    [type]: true,
                }));
                setPendingDocType(null); // Clear pending status
            },
            onError: (error) => {
                console.error('Upload failed:', error);
                const errorMessage = error?.response?.data?.message || error.message || 'Upload failed.';
                toast.error(`Failed to upload ${type.toUpperCase()} documents: ${errorMessage}`);
            },
        });
    };
    const handleRemoveFile = (type, index) => {
        setUploadedDocs((prev) => ({
            ...prev,
            [type]: prev[type].filter((_, i) => i !== index),
        }));
    };

    const documentsList = [
        {
            type: 'kyc',
            label: 'KYC Documents',
            desc: 'Upload Aadhaar, PAN, Photo (max 5)',
            icon: 'fa-id-card',
        },
        {
            type: 'agreement',
            label: 'Rental Agreement',
            desc: 'Digitally signed document (max 5)',
            icon: 'fa-file-signature',
        },
    ];

    return (
        <div className="max-w-5xl mx-auto md:px-4 py-6">
            <div className="bg-white border border-orange-300 rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                    <i className="fas fa-folder-open mr-2 text-orange-500"></i>
                    Document Upload & Preview
                </h2>

                <div className="space-y-6">
                    {documentsList.map((doc) => {
                        const uploaded = uploadedDocs[doc.type] || [];
                        const existing = existingDocs[doc.type] || [];
                        // const isSaved = savedDocs[doc.type];
                        // const hasFiles = uploaded.length + existing.length > 0;

                        return (
                            <div
                                key={doc.type}
                                className="border-2 border-orange-200 rounded-lg p-4"
                            >
                                <div className="flex justify-between items-center mb-4">

                                    <div className="flex items-center">

                                        <i className={`fas text-2xl mr-3 ${doc.icon} text-orange-500`} />
                                        <div>
                                            <h3 className="font-semibold text-sm md:text-lg">{doc.label}</h3>
                                            <p className="text-sm text-gray-500">{doc.desc}</p>
                                        </div>
                                    </div>

                                    <div className="flex space-x-2 ">
                                        <button
                                            onClick={() => handleUploadClick(doc.type)}
                                            className="bg-orange-600 text-white px-3 py-1.5 text-sm rounded hover:bg-orange-700"
                                        >
                                            <i className="fas fa-upload mr-1"></i> Upload
                                        </button>
                                        <button
                                            onClick={() => handleSave(doc.type)}
                                            disabled={uploaded.length === 0 || pendingDocType === doc.type}
                                            className={`text-white px-3 py-1.5 text-sm rounded flex items-center ${uploaded.length > 0
                                                ? 'bg-green-600 hover:bg-green-700'
                                                : 'bg-gray-300 cursor-not-allowed'
                                                }`}
                                        >
                                            {pendingDocType === doc.type ? (
                                                <>
                                                    <LoaderPage className="mr-2" />
                                                    Saving...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="fas fa-save mr-2"></i>
                                                    Save
                                                </>
                                            )}
                                        </button>

                                    </div>
                                </div>

                                <div className="space-y-2 grid gap-6 grid-cols-2 md:grid-cols-5" >

                                    {/*  Existing Files (from server) */}
                                    {isDocument ? (
                                        <LoaderPage />
                                    ) : (
                                        existing.map((url, index) => (
                                            <div
                                                key={`existing-${index}`}
                                                className="bg-white w-fit border border-gray-200 rounded px-3 py-2 flex flex-col items-center space-y-2"
                                            >
                                                <a href={url} target="_blank" rel="noopener noreferrer">
                                                    {url.match(/\.(jpg|jpeg|png)$/i) ? (
                                                        <img
                                                            src={url}
                                                            alt={`Existing ${index}`}
                                                            className="w-40 h-40 object-cover rounded"
                                                        />
                                                    ) : url.match(/\.pdf$/i) ? (
                                                        <div className="text-center">
                                                            <h4 className="font-semibold text-lg text-gray-800">PDF</h4>
                                                            <p className="text-sm text-gray-500">{url.split('/').pop()}</p>
                                                        </div>
                                                    ) : (
                                                        <i className="fas fa-file-alt text-gray-500 text-2xl"></i>
                                                    )}
                                                </a>
                                            </div>
                                        ))
                                    )}
                                    {/* 🟢 Uploaded New Files (preview) */}
                                    {uploaded.map((file, index) => (
                                        <div
                                            key={`uploaded-${index}`}
                                            className="bg-white w-fit border border-green-200 rounded px-3 py-2 flex flex-col items-center space-y-2"
                                        >
                                            <a
                                                href={URL.createObjectURL(file)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {file.type.startsWith('image/') ? (
                                                    <img
                                                        src={URL.createObjectURL(file)}
                                                        alt={`Preview ${index}`}
                                                        className="w-40 h-40 object-cover rounded"
                                                    />
                                                ) : (
                                                    <i className="fas fa-file-alt text-gray-500 text-2xl"></i>
                                                )}
                                            </a>
                                            <button
                                                onClick={() => handleRemoveFile(doc.type, index)}
                                                className="text-xs text-red-500 hover:underline"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <input
                                    type="file"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    className="hidden"
                                    ref={fileInputRefs[doc.type]}
                                    onChange={(e) => handleFileChange(doc.type, e)}
                                    multiple
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>

    );
};

export default Documents;
