import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ChangeStatuscomp = ({ complaint, closeModal, updateComplaintStatus }) => {
    const [selectedStatus, setSelectedStatus] = useState(complaint.status);
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const navigate = useNavigate();

    const getStatusColor = (status, isSelected) => {
        const baseClasses =
            "px-4 py-2 rounded-md font-medium transition-all duration-200 flex items-center justify-center";

        if (isSelected) {
            switch (status) {
                case "PENDING":
                    return `${baseClasses} bg-red-600 text-white ring-2 ring-red-300 shadow-sm`;
                case "IN_PROGRESS":
                    return `${baseClasses} bg-orange-600 text-white ring-2 ring-orange-300 shadow-sm`;
                case "RESOLVED":
                    return `${baseClasses} bg-green-600 text-white ring-2 ring-green-300 shadow-sm`;
                case "REJECTED":
                    return `${baseClasses} bg-gray-700 text-white ring-2 ring-gray-300 shadow-sm`;
                default:
                    return `${baseClasses} bg-indigo-600 text-white ring-2 ring-indigo-300 shadow-sm`;
            }
        } else {
            switch (status) {
                case "PENDING":
                    return `${baseClasses} bg-red-50 text-red-600 border border-red-200 hover:bg-red-100`;
                case "IN_PROGRESS":
                    return `${baseClasses} bg-orange-50 text-orange-600 border border-orange-200 hover:bg-orange-100`;
                case "RESOLVED":
                    return `${baseClasses} bg-green-50 text-green-600 border border-green-200 hover:bg-green-100`;
                case "REJECTED":
                    return `${baseClasses} bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100`;
                default:
                    return `${baseClasses} bg-indigo-50 text-indigo-600 border border-indigo-200 hover:bg-indigo-100`;
            }
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "PENDING":
                return (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                );
            case "IN_PROGRESS":
                return (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4"
                        />
                    </svg>
                );
            case "RESOLVED":
                return (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                );
            case "REJECTED":
                return (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                );
            default:
                return null;
        }
    };

    const handleStatusChange = async () => {
        if (!image || image.length === 0) {
            return alert("Please upload at least one image proof.");
        }

        setUploading(true);
        const formData = new FormData();
        formData.append("status", selectedStatus);

        // Append each file in the 'image' array to the form data
        Array.from(image).forEach((file) => {
            formData.append("attachments", file);
        });

        try {
            await axios.post(
                `http://localhost:3000/admin/changeStatus/${complaint.id}`,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                    withCredentials: true,
                }
            );

            updateComplaintStatus(complaint.id, selectedStatus);
            alert("Status updated successfully!");
            closeModal();
            navigate("/");
        } catch (error) {
            console.error(
                "Error updating status:",
                error.response?.data || error.message
            );
            alert("Failed to update status.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
                {/* Header */}
                <div className="bg-gray-50 border-b border-gray-100 px-6 py-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Update Complaint Status
                    </h2>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="space-y-4">
                        <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-gray-500 font-medium">
                                        Complaint ID
                                    </p>
                                    <p className="text-sm text-gray-800 font-mono">
                                        #{complaint.id.substring(0, 8)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium">
                                        Current Status
                                    </p>
                                    <span
                                        className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium ${
                                            complaint.status === "PENDING"
                                                ? "bg-red-100 text-red-700"
                                                : complaint.status ===
                                                  "IN_PROGRESS"
                                                ? "bg-orange-100 text-orange-700"
                                                : complaint.status ===
                                                  "RESOLVED"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-gray-100 text-gray-700"
                                        }`}
                                    >
                                        {complaint.status}
                                    </span>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-xs text-gray-500 font-medium">
                                        Description
                                    </p>
                                    <p className="text-sm text-gray-800 truncate">
                                        {complaint.description ||
                                            "No description provided"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                New Status
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {[
                                    "PENDING",
                                    "IN_PROGRESS",
                                    "RESOLVED",
                                    "REJECTED",
                                ].map((status) => (
                                    <button
                                        key={status}
                                        type="button"
                                        className={getStatusColor(
                                            status,
                                            selectedStatus === status
                                        )}
                                        onClick={() =>
                                            setSelectedStatus(status)
                                        }
                                    >
                                        {getStatusIcon(status)}
                                        {status}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Upload Proof (Required)
                            </label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                                <input
                                    id="file-upload"
                                    type="file"
                                    className="hidden"
                                    multiple
                                    onChange={(e) => setImage(e.target.files)}
                                />
                                <label
                                    htmlFor="file-upload"
                                    className="cursor-pointer w-full h-full flex flex-col items-center"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-8 w-8 text-gray-400 mb-2"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                        />
                                    </svg>
                                    {image && image.length > 0 ? (
                                        <span className="text-sm text-indigo-600 font-medium">
                                            {image.length}{" "}
                                            {image.length === 1
                                                ? "file"
                                                : "files"}{" "}
                                            selected
                                        </span>
                                    ) : (
                                        <span className="text-sm text-gray-500">
                                            Click to browse or drag and drop
                                            files
                                        </span>
                                    )}
                                    <span className="text-xs text-gray-400 mt-1">
                                        Supported formats: JPG, PNG, PDF
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 border-t border-gray-100 px-6 py-4 flex justify-end gap-2">
                    <button
                        type="button"
                        className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        onClick={closeModal}
                        disabled={uploading}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="px-4 py-2 bg-indigo-600 border border-transparent rounded-md text-white text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        onClick={handleStatusChange}
                        disabled={uploading}
                    >
                        {uploading ? (
                            <>
                                <svg
                                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                                Processing...
                            </>
                        ) : (
                            "Update Status"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChangeStatuscomp;
