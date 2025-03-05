import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ChangeStatus from "../../Components/ChangeStatuscomp";

const Adminhome = ({ logout }) => {
    const [admin, setAdmin] = useState(null);
    const [departmentName, setDepartmentName] = useState(null);
    const [complaints, setComplaints] = useState([]);
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const navigate = useNavigate();

    // Color scheme
    const colors = {
        primary: "#55356E",
        secondary: "#C3ACD0",
        background: "#F7EFE5",
        accent: "#7D6E83",
        white: "#FFFFFF",
    };

    // Priority colors
    const priorityColors = {
        URGENT: "#ff4d4d",
        HIGH: "#ff9800",
        MEDIUM: "#ffcc00",
        LOW: "#66cc66",
    };

    // Status colors
    const statusColors = {
        RESOLVED: "#008000",
        PENDING: "#ff0000",
        IN_PROGRESS: "#ff9800",
    };

    useEffect(() => {
        const storedUser = localStorage.getItem("userData");
        if (storedUser) setAdmin(JSON.parse(storedUser));

        const storedDept = localStorage.getItem("departmentName");
        if (storedDept) setDepartmentName(storedDept);

        const storedComplaints = localStorage.getItem("complaints");
        if (storedComplaints) setComplaints(JSON.parse(storedComplaints));
    }, []);

    const handleLogout = () => {
        document.cookie =
            "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        localStorage.removeItem("userData");
        localStorage.removeItem("departmentName");
        localStorage.removeItem("complaints");
        window.location.reload();
        logout();
    };

    const departments = [
        { name: "Municipality", id: "67c57c828c1109be6afbd1ab" },
        { name: "Water Department", id: "67c57c9d8c1109be6afbd1ac" },
        { name: "Electricity Department", id: "67c57cac8c1109be6afbd1ad" },
        {
            name: "Public Works Department (PWD)",
            id: "67c57cb88c1109be6afbd1ae",
        },
    ];

    const changeDepartment = async (complaintId, newDepartmentId) => {
        try {
            await axios.put(
                `http://localhost:3000/admin/complaint/${complaintId}/change-department`,
                { newDepartmentId },
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            );

            const updatedComplaints = complaints.filter(
                (complaint) => complaint.id !== complaintId
            );
            localStorage.setItem(
                "complaints",
                JSON.stringify(updatedComplaints)
            );
            setComplaints(updatedComplaints);
        } catch (error) {
            console.error(
                "Error updating department:",
                error.response?.data || error.message
            );
            alert(
                error.response?.data?.message || "Failed to update department."
            );
        }
    };

    const handleOpenModal = (complaint) =>
        navigate("/ChangeStatus", { state: { complaint } });

    const handleCloseModal = () => setSelectedComplaint(null);

    const updateComplaintStatus = (id, newStatus) => {
        setComplaints((prevComplaints) =>
            prevComplaints.map((complaint) =>
                complaint.id === id
                    ? { ...complaint, status: newStatus }
                    : complaint
            )
        );
    };

    if (!admin) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100">
                <div className="flex flex-col items-center">
                    <div
                        className="w-16 h-16 border-t-4 border-b-4 border-primary rounded-full animate-spin"
                        style={{ borderColor: colors.primary }}
                    ></div>
                    <p className="mt-4 text-xl font-semibold text-gray-600">
                        Loading dashboard...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div
            className="min-h-screen font-sans"
            style={{ backgroundColor: colors.background }}
        >
            {/* Header */}
            <header
                className="p-6 shadow-md"
                style={{ backgroundColor: colors.primary }}
            >
                <div className="container mx-auto flex justify-between items-center">
                    <div>
                        <h1
                            className="text-3xl font-bold"
                            style={{ color: colors.white }}
                        >
                            Administration Dashboard
                        </h1>
                        <p
                            className="text-lg mt-1 opacity-90"
                            style={{ color: colors.white }}
                        >
                            {departmentName}
                        </p>
                    </div>
                    <div className="flex items-center">
                        <div className="mr-6 text-right">
                            <p
                                className="font-medium"
                                style={{ color: colors.white }}
                            >
                                {admin.name}
                            </p>
                            <p
                                className="text-sm opacity-80"
                                style={{ color: colors.white }}
                            >
                                Administrator
                            </p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200 flex items-center"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 mr-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                />
                            </svg>
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto p-6">
                <div className="mb-6">
                    <h2
                        className="text-2xl font-semibold"
                        style={{ color: colors.primary }}
                    >
                        Complaints Management
                    </h2>
                    <p className="text-gray-600">
                        Review and manage department complaints
                    </p>
                </div>

                <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-200">
                    <div
                        className="p-4"
                        style={{ backgroundColor: colors.secondary }}
                    >
                        <h3
                            className="text-lg font-semibold"
                            style={{ color: colors.primary }}
                        >
                            Active Complaints
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="p-4 text-sm font-semibold text-gray-600">
                                        ID
                                    </th>
                                    <th className="p-4 text-sm font-semibold text-gray-600">
                                        Locality
                                    </th>
                                    <th className="p-4 text-sm font-semibold text-gray-600">
                                        Complaint Details
                                    </th>
                                    <th className="p-4 text-sm font-semibold text-gray-600">
                                        Priority
                                    </th>
                                    <th className="p-4 text-sm font-semibold text-gray-600">
                                        Status
                                    </th>
                                    <th className="p-4 text-sm font-semibold text-gray-600">
                                        Reassign
                                    </th>
                                    <th className="p-4 text-sm font-semibold text-gray-600">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {complaints.length > 0 ? (
                                    complaints.map((complaint) => (
                                        <tr
                                            key={complaint.id}
                                            className="border-b hover:bg-gray-50 transition duration-150"
                                        >
                                            <td className="p-4 text-sm font-mono">
                                                {complaint.id.substring(0, 8)}
                                                ...
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-4 w-4 mr-1 text-gray-500"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                                        />
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                                        />
                                                    </svg>
                                                    {complaint.locality}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <p className="text-base font-semibold">
                                                    {complaint.name}
                                                </p>
                                                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                                    {complaint.description}
                                                </p>
                                            </td>
                                            <td className="p-4">
                                                <span
                                                    className="px-3 py-1 text-xs font-semibold rounded-full"
                                                    style={{
                                                        backgroundColor:
                                                            priorityColors[
                                                                complaint
                                                                    .priority
                                                            ] || "#66cc66",
                                                        color: "#fff",
                                                    }}
                                                >
                                                    {complaint.priority}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <span
                                                    className="px-3 py-1 text-xs font-semibold rounded-full"
                                                    style={{
                                                        backgroundColor:
                                                            statusColors[
                                                                complaint.status
                                                            ] || "#ff0000",
                                                        color: "#fff",
                                                    }}
                                                >
                                                    {complaint.status}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <select
                                                    className="border p-2 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-full"
                                                    defaultValue=""
                                                    onChange={(e) =>
                                                        changeDepartment(
                                                            complaint.id,
                                                            e.target.value
                                                        )
                                                    }
                                                >
                                                    <option value="" disabled>
                                                        Transfer to...
                                                    </option>
                                                    {departments
                                                        .filter(
                                                            (dept) =>
                                                                dept.name !==
                                                                departmentName
                                                        )
                                                        .map((dept) => (
                                                            <option
                                                                key={dept.id}
                                                                value={dept.id}
                                                            >
                                                                {dept.name}
                                                            </option>
                                                        ))}
                                                </select>
                                            </td>
                                            <td className="p-4">
                                                <button
                                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200 flex items-center text-sm"
                                                    onClick={() =>
                                                        handleOpenModal(
                                                            complaint
                                                        )
                                                    }
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-4 w-4 mr-1"
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
                                                    Update Status
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            className="p-6 text-center text-gray-500"
                                            colSpan="7"
                                        >
                                            <div className="flex flex-col items-center justify-center py-6">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-12 w-12 text-gray-300 mb-3"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={1}
                                                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                                    />
                                                </svg>
                                                <p className="text-lg font-medium">
                                                    No complaints available
                                                </p>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    All complaints have been
                                                    addressed
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer
                className="py-4 text-center text-gray-500 text-sm"
                style={{ backgroundColor: colors.background }}
            >
                <p>
                    © {new Date().getFullYear()} Municipal Complaint Management
                    System. All rights reserved.
                </p>
            </footer>

            {selectedComplaint && (
                <ChangeStatus
                    complaint={selectedComplaint}
                    closeModal={handleCloseModal}
                    updateComplaintStatus={updateComplaintStatus}
                />
            )}
        </div>
    );
};

export default Adminhome;
