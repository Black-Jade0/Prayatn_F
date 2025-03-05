import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ChangeStatus from "../../Components/ChangeStatuscomp";

const Adminhome = ({ logout }) => {
    const [admin, setAdmin] = useState(null);
    const [departmentName, setDepartmentName] = useState(null);
    const [complaints, setComplaints] = useState([]);
    const [selectedComplaint, setSelectedComplaint] = useState(null); // For modal
    const navigate = useNavigate();
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
            const response = await axios.put(
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

    // const handleOpenModal = (complaint) => setSelectedComplaint(complaint);
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
            <div className="p-6 text-gray-500 text-center">Loading data...</div>
        );
    }

    return (
        <div
            className="p-8 min-h-screen font-sans"
            style={{ backgroundColor: "#F7EFE5" }}
        >
            <button
                onClick={handleLogout}
                className="absolute top-6 right-6 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
                Logout
            </button>
            <h1 className="text-4xl font-bold" style={{ color: "#55356E" }}>
                Welcome, {admin.name}
            </h1>
            <p className="text-lg" style={{ color: "#55356E" }}>
                Department: {departmentName}
            </p>

            <div
                className="mt-8 shadow-md rounded-xl overflow-hidden"
                style={{ backgroundColor: "#C3ACD0" }}
            >
                <h2
                    className="text-2xl font-semibold p-6"
                    style={{ backgroundColor: "#55356E", color: "#F7EFE5" }}
                >
                    Complaints
                </h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left">
                        <thead>
                            <tr
                                className="text-sm"
                                style={{
                                    backgroundColor: "#F7EFE5",
                                    color: "#55356E",
                                }}
                            >
                                <th className="p-4">Complaint ID</th>
                                <th className="p-4">Locality</th>
                                <th className="p-4">Complaint</th>
                                <th className="p-4">Priority</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Change Department</th>
                                <th className="p-4">Update Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {complaints.length > 0 ? (
                                complaints.map((complaint) => (
                                    <tr
                                        key={complaint.id}
                                        className="border-b hover:bg-gray-100"
                                        style={{ backgroundColor: "#F7EFE5" }}
                                    >
                                        <td
                                            className="p-4"
                                            style={{ color: "#55356E" }}
                                        >
                                            {complaint.id}
                                        </td>
                                        <td className="p-4">
                                            {complaint.locality}
                                        </td>
                                        <td className="p-4">
                                            <p className="text-lg font-semibold">
                                                {complaint.name}
                                            </p>
                                            <p className="text-sm">
                                                {complaint.description}
                                            </p>
                                        </td>
                                        <td className="p-4">
                                            <span
                                                className="px-3 py-1 text-xs font-semibold rounded-lg"
                                                style={{
                                                    backgroundColor:
                                                        complaint.priority ===
                                                        "URGENT"
                                                            ? "#ff4d4d"
                                                            : complaint.priority ===
                                                              "HIGH"
                                                            ? "#ff9800"
                                                            : complaint.priority ===
                                                              "MEDIUM"
                                                            ? "#ffcc00"
                                                            : "#66cc66",
                                                    color: "#fff",
                                                }}
                                            >
                                                {complaint.priority}
                                            </span>
                                        </td>
                                        <td
                                            className="p-4 font-medium"
                                            style={{
                                                color:
                                                    complaint.status ===
                                                    "RESOLVED"
                                                        ? "#008000"
                                                        : "#ff0000",
                                            }}
                                        >
                                            {complaint.status}
                                        </td>
                                        <td className="p-4">
                                            <select
                                                className="border p-2 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                defaultValue=""
                                                onChange={(e) =>
                                                    changeDepartment(
                                                        complaint.id,
                                                        e.target.value
                                                    )
                                                }
                                            >
                                                <option value="" disabled>
                                                    Select Department
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
                                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                                onClick={() =>
                                                    handleOpenModal(complaint)
                                                }
                                            >
                                                Change Status
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        className="p-4 text-gray-500 text-center"
                                        colSpan="7"
                                    >
                                        No complaints available
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

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
