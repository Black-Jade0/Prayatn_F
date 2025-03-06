import React, { useState, useEffect } from "react";
import ChangeStatuscomp from "../Components/ChangeStatuscomp";
import { useLocation } from "react-router-dom";
import axios from "axios";

const ChangeStatus = ({ adminDepartment }) => {
    const location = useLocation();
    const [selectedComplaint, setSelectedComplaint] = useState(
        location.state?.complaint || null
    );
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (selectedComplaint?.locality) {
            fetchComplaintsByLocality(selectedComplaint.locality);
        } else {
            setLoading(false);
        }
    }, [selectedComplaint]);

    const fetchComplaintsByLocality = async (locality) => {
        try {
            setLoading(true);
            const response = await axios.get(
                `http://localhost:3000/admin/complaints/locality/${locality}`,
                {
                    withCredentials: true,
                }
            );

            if (response.data.complaints) {
                setComplaints(response.data.complaints);
            }
            setLoading(false);
        } catch (err) {
            console.error("Error fetching complaints:", err);
            setError("Failed to load complaints. Please try again later.");
            setLoading(false);
        }
    };

    const openModal = (complaint) => {
        setSelectedComplaint(complaint);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const updateComplaintStatus = async (id, newStatus) => {
        try {
            await axios.post(
                `http://localhost:3000/admin/changeStatus/${id}`,
                { status: newStatus },
                { withCredentials: true }
            );

            const updatedComplaints = complaints.map((comp) =>
                comp.id === id ? { ...comp, status: newStatus } : comp
            );
            setComplaints(updatedComplaints);

            setSelectedComplaint((prev) =>
                prev && prev.id === id ? { ...prev, status: newStatus } : prev
            );
        } catch (err) {
            console.error("Error updating complaint status:", err);
            alert("Failed to update complaint status. Please try again.");
        }
    };

    const relatedComplaints = complaints.filter(
        (comp) => comp.id !== selectedComplaint?.id
    );

    const getStatusColor = (status) => {
        switch (status) {
            case "PENDING":
                return "text-red-600 bg-red-50 border border-red-200";
            case "IN_PROGRESS":
                return "text-orange-600 bg-orange-50 border border-orange-200";
            case "RESOLVED":
                return "text-green-600 bg-green-50 border border-green-200";
            case "REJECTED":
                return "text-gray-600 bg-gray-50 border border-gray-200";
            default:
                return "text-gray-600 bg-gray-50 border border-gray-200";
        }
    };

    const getStatusBadgeClass = (status) => {
        const baseClass = "px-2 py-1 rounded-full text-xs font-medium";
        return `${baseClass} ${getStatusColor(status)}`;
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case "URGENT":
                return "text-red-600 bg-red-50 border border-red-200";
            case "HIGH":
                return "text-orange-600 bg-orange-50 border border-orange-200";
            case "MEDIUM":
                return "text-yellow-600 bg-yellow-50 border border-yellow-200";
            case "LOW":
                return "text-green-600 bg-green-50 border border-green-200";
            default:
                return "text-green-600 bg-green-50 border border-green-200";
        }
    };

    const getPriorityBadgeClass = (priority) => {
        const baseClass = "px-2 py-1 rounded-full text-xs font-medium";
        return `${baseClass} ${getPriorityColor(priority)}`;
    };
    
    // Check if the complaint is from the admin's department
    const canChangeStatus = (complaint) => {
        return complaint.department?.name === adminDepartment;
    };

    return (
        <div className="p-6 min-h-screen bg-gray-50">
            {selectedComplaint ? (
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center mb-6">
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-gray-800">
                                Complaint Details
                            </h1>
                            <p className="text-sm text-gray-500">
                                ID: #{selectedComplaint.id?.substring(0, 8)}
                            </p>
                        </div>
                        <span
                            className={getStatusBadgeClass(
                                selectedComplaint.status
                            )}
                        >
                            {selectedComplaint.status}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-lg shadow-md border border-gray-100 p-6 h-full">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-3 border-b">
                                    Complaint Information
                                </h2>

                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 mb-1">
                                            Description
                                        </h3>
                                        <p className="text-gray-800 text-base">
                                            {selectedComplaint.description}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500 mb-1">
                                                Name
                                            </h3>
                                            <p className="text-gray-800">
                                                {selectedComplaint.name ||
                                                    "Unknown"}
                                            </p>
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500 mb-1">
                                                Mobile Number
                                            </h3>
                                            <p className="text-gray-800">
                                                {selectedComplaint.mobileNumber ||
                                                    "Not provided"}
                                            </p>
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500 mb-1">
                                                Locality
                                            </h3>
                                            <p className="text-gray-800">
                                                {selectedComplaint.locality ||
                                                    "Unknown"}
                                            </p>
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500 mb-1">
                                                Department
                                            </h3>
                                            <p className="text-gray-800">
                                                {selectedComplaint.department
                                                    ?.name || "Unknown"}
                                            </p>
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500 mb-1">
                                                Priority
                                            </h3>
                                            <span
                                                className={getPriorityBadgeClass(
                                                    selectedComplaint.priority
                                                )}
                                            >
                                                {selectedComplaint.priority}
                                            </span>
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500 mb-1">
                                                Created
                                            </h3>
                                            <p className="text-gray-800">
                                                {new Date(
                                                    selectedComplaint.createdAt
                                                ).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-md border border-gray-100 p-6 h-full">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-3 border-b">
                                    Actions
                                </h2>

                                {canChangeStatus(selectedComplaint) ? (
                                    <button
                                        className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300 ease-in-out flex items-center justify-center gap-2 font-medium"
                                        onClick={() => openModal(selectedComplaint)}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                            />
                                        </svg>
                                        Change Status
                                    </button>
                                ) : (
                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                                        <svg 
                                            xmlns="http://www.w3.org/2000/svg" 
                                            className="h-6 w-6 mx-auto mb-2 text-gray-400" 
                                            fill="none" 
                                            viewBox="0 0 24 24" 
                                            stroke="currentColor"
                                        >
                                            <path 
                                                strokeLinecap="round" 
                                                strokeLinejoin="round" 
                                                strokeWidth={2} 
                                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
                                            />
                                        </svg>
                                        <p className="text-gray-600 text-sm">
                                            You can only change status for complaints in your department
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 bg-white rounded-lg shadow-md border border-gray-100 p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-800">
                                Related Complaints in{" "}
                                {selectedComplaint.locality || "Unknown"}
                            </h2>
                            <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
                                {relatedComplaints.length} complaints
                            </span>
                        </div>

                        {loading ? (
                            <div className="flex justify-center items-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                            </div>
                        ) : error ? (
                            <div className="p-4 bg-red-50 border border-red-100 rounded-md text-center text-red-600">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 mx-auto mb-2"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                {error}
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full border-collapse">
                                    <thead>
                                        <tr className="text-left border-b border-gray-200">
                                            <th className="px-4 py-3 text-sm font-medium text-gray-500">
                                                ID
                                            </th>
                                            <th className="px-4 py-3 text-sm font-medium text-gray-500">
                                                Description
                                            </th>
                                            <th className="px-4 py-3 text-sm font-medium text-gray-500">
                                                Department
                                            </th>
                                            <th className="px-4 py-3 text-sm font-medium text-gray-500">
                                                Priority
                                            </th>
                                            <th className="px-4 py-3 text-sm font-medium text-gray-500">
                                                Status
                                            </th>
                                            <th className="px-4 py-3 text-sm font-medium text-gray-500">
                                                Date
                                            </th>
                                            <th className="px-4 py-3 text-sm font-medium text-gray-500">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {relatedComplaints.length > 0 ? (
                                            relatedComplaints.map((comp) => (
                                                <tr
                                                    key={comp.id}
                                                    className="border-b border-gray-100 hover:bg-gray-50 transition duration-150"
                                                >
                                                    <td className="px-4 py-3 text-sm text-gray-800 font-medium">
                                                        #
                                                        {comp.id.substring(
                                                            0,
                                                            8
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-gray-800 max-w-xs truncate">
                                                        {comp.description}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-gray-800">
                                                        {comp.department?.name || "Unknown"}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span
                                                            className={getPriorityBadgeClass(
                                                                comp.priority
                                                            )}
                                                        >
                                                            {comp.priority}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span
                                                            className={getStatusBadgeClass(
                                                                comp.status
                                                            )}
                                                        >
                                                            {comp.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-gray-600">
                                                        {new Date(
                                                            comp.createdAt
                                                        ).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <button
                                                            className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-1 rounded-md text-sm font-medium flex items-center gap-1 transition duration-150"
                                                            onClick={() =>
                                                                setSelectedComplaint(
                                                                    comp
                                                                )
                                                            }
                                                        >
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                className="h-4 w-4"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                stroke="currentColor"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={
                                                                        2
                                                                    }
                                                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                                />
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={
                                                                        2
                                                                    }
                                                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                                />
                                                            </svg>
                                                            View
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan="7"
                                                    className="px-4 py-8 text-center text-gray-500"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-8 w-8 mx-auto mb-2 text-gray-300"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                                        />
                                                    </svg>
                                                    No other complaints in this
                                                    locality
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center min-h-[60vh]">
                    <div className="bg-white p-8 rounded-lg shadow-md border border-gray-100 text-center max-w-md w-full">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-16 w-16 text-gray-300 mx-auto mb-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                        </svg>
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">
                            No complaint selected
                        </h2>
                        <p className="text-gray-600 mb-4">
                            Please select a complaint to view its details
                        </p>
                        <div className="h-1 w-24 mx-auto bg-indigo-100 rounded"></div>
                    </div>
                </div>
            )}

            {isModalOpen && canChangeStatus(selectedComplaint) && (
                <ChangeStatuscomp
                    complaint={selectedComplaint}
                    closeModal={closeModal}
                    updateComplaintStatus={updateComplaintStatus}
                />
            )}
        </div>
    );
};

export default ChangeStatus;