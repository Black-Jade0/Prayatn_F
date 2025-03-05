import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Adminhome = ({ logout }) => {
    const [admin, setAdmin] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem("userData");
        if (storedUser) {
            setAdmin(JSON.parse(storedUser));
        }
    }, []);

    const handleLogout = () => {
        document.cookie =
            "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        localStorage.removeItem("userData");
        window.location.reload();
        logout();
    };

    if (!admin) {
        return (
            <div className="p-6 text-gray-500 text-center">Loading data...</div>
        );
    }

    const { department } = admin;
    const totalComplaints = department?.complaints?.length || 0;
    const resolvedComplaints =
        department?.complaints?.filter((c) => c.status === "RESOLVED").length ||
        0;
    const pendingComplaints =
        department?.complaints?.filter((c) => c.status === "PENDING").length ||
        0;

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
                Department: {department?.name || "N/A"}
            </p>

            {/* Dashboard Stats */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    {
                        title: "Total Complaints",
                        count: totalComplaints,
                        color: "#C3ACD0",
                    },
                    {
                        title: "Resolved Complaints",
                        count: resolvedComplaints,
                        color: "#55356E",
                        textColor: "#F7EFE5",
                    },
                    {
                        title: "Pending Complaints",
                        count: pendingComplaints,
                        color: "#F7EFE5",
                        textColor: "#55356E",
                    },
                ].map((item, index) => (
                    <div
                        key={index}
                        className="p-6 shadow-md rounded-xl text-center"
                        style={{
                            backgroundColor: item.color,
                            color: item.textColor || "#55356E",
                        }}
                    >
                        <h2 className="text-lg font-semibold">{item.title}</h2>
                        <p className="text-3xl font-bold">{item.count}</p>
                    </div>
                ))}
            </div>

            {/* Complaints Table */}
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
                                <th className="p-4">Reassign</th>
                            </tr>
                        </thead>
                        <tbody>
                            {department?.complaints?.length > 0 ? (
                                department.complaints.map((complaint) => (
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
                                                className="p-2 border rounded-lg"
                                                style={{
                                                    backgroundColor: "#C3ACD0",
                                                    color: "#55356E",
                                                }}
                                            >
                                                <option value="">
                                                    Reassign
                                                </option>
                                                {department?.otherDepartments?.map(
                                                    (dept, i) => (
                                                        <option
                                                            key={i}
                                                            value={dept}
                                                        >
                                                            {dept}
                                                        </option>
                                                    )
                                                )}
                                            </select>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        className="p-4 text-gray-500 text-center"
                                        colSpan="6"
                                    >
                                        No complaints available
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Adminhome;
