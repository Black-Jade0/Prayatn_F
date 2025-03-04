import React, { useEffect, useState } from "react";

const Adminhome = () => {
    const [admin, setAdmin] = useState(null);

    useEffect(() => {
        fetch("/complaint.json")
            .then((res) => res.json())
            .then((data) => {
                localStorage.setItem("userData", JSON.stringify(data));
                setAdmin(data);
            })
            .catch((err) => console.error("Error loading dummy data:", err));
    }, []);

    // Handle loading state
    if (!admin) {
        return <div className="p-6 text-gray-500">Loading data...</div>;
    }

    const { department } = admin;

    // Filter complaints by status
    const totalComplaints = department.complaints.length;
    const resolvedComplaints = department.complaints.filter(
        (c) => c.status === "RESOLVED"
    ).length;
    const pendingComplaints = department.complaints.filter(
        (c) => c.status === "PENDING"
    ).length;

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold">Welcome, {admin.name}</h1>
            <p className="text-lg">Department: {department.name}</p>

            {/* Dashboard Sections */}
            <div className="mt-6 grid grid-cols-3 gap-6">
                <div className="bg-white p-4 shadow-lg rounded-lg">
                    <h2 className="text-xl font-semibold">Total Complaints</h2>
                    <p className="text-2xl">{totalComplaints}</p>
                </div>
                <div className="bg-white p-4 shadow-lg rounded-lg">
                    <h2 className="text-xl font-semibold">
                        Resolved Complaints
                    </h2>
                    <p className="text-2xl">{resolvedComplaints}</p>
                </div>
                <div className="bg-white p-4 shadow-lg rounded-lg">
                    <h2 className="text-xl font-semibold">
                        Pending Complaints
                    </h2>
                    <p className="text-2xl">{pendingComplaints}</p>
                </div>
            </div>

            {/* Complaints List */}
            <div className="mt-8">
                <h2 className="text-2xl font-semibold mb-4">Complaints</h2>
                <div className="bg-white shadow-lg rounded-lg p-4">
                    {department.complaints.length > 0 ? (
                        <ul>
                            {department.complaints.map((complaint) => (
                                <li
                                    key={complaint.id}
                                    className="border-b p-2 flex justify-between"
                                >
                                    <div>
                                        <p className="font-semibold">
                                            {complaint.name}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {complaint.description}
                                        </p>
                                    </div>
                                    <span
                                        className={`px-3 py-1 text-sm font-semibold rounded-full ${
                                            complaint.priority === "URGENT"
                                                ? "bg-red-500 text-white"
                                                : complaint.priority === "HIGH"
                                                ? "bg-orange-400 text-white"
                                                : complaint.priority ===
                                                  "MEDIUM"
                                                ? "bg-yellow-400 text-white"
                                                : "bg-green-400 text-white"
                                        }`}
                                    >
                                        {complaint.priority}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">No complaints found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Adminhome;
