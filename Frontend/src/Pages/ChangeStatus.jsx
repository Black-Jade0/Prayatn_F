import React, { useState, useEffect } from "react";
import ChangeStatuscomp from "../Components/ChangeStatuscomp";
import { useLocation } from "react-router-dom";

const ChangeStatus = () => {
    const location = useLocation();
    const [selectedComplaint, setSelectedComplaint] = useState(
        location.state?.complaint || null
    );
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [complaints, setComplaints] = useState([]);

    useEffect(() => {
        const storedComplaints = JSON.parse(localStorage.getItem("complaints"));
        if (storedComplaints) {
            setComplaints(storedComplaints);
        } else if (selectedComplaint) {
            const newComplaints = [
                {
                    id: 101,
                    locality: selectedComplaint.locality,
                    name: "Broken Pipe",
                    description:
                        "Water leakage in the main pipeline near the park.",
                    priority: "URGENT",
                    status: "PENDING",
                },
                {
                    id: 102,
                    locality: selectedComplaint.locality,
                    name: "Street Light Out",
                    description: "Streetlights on 5th Avenue are not working.",
                    priority: "HIGH",
                    status: "IN_PROGRESS",
                },
                {
                    id: 103,
                    locality: selectedComplaint.locality,
                    name: "Sewage Blockage",
                    description: "Sewage water overflowing near Market Street.",
                    priority: "URGENT",
                    status: "RESOLVED",
                },
            ];
            setComplaints(newComplaints);
            localStorage.setItem("complaints", JSON.stringify(newComplaints));
        }
    }, [selectedComplaint]);

    const openModal = (complaint) => {
        setSelectedComplaint(complaint);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const updateComplaintStatus = (id, newStatus) => {
        const updatedComplaints = complaints.map((comp) =>
            comp.id === id ? { ...comp, status: newStatus } : comp
        );
        setComplaints(updatedComplaints);
        localStorage.setItem("complaints", JSON.stringify(updatedComplaints)); // Update localStorage immediately

        setSelectedComplaint((prev) =>
            prev ? { ...prev, status: newStatus } : prev
        );
    };

    const relatedComplaints = complaints.filter(
        (comp) =>
            comp.locality === selectedComplaint?.locality &&
            comp.id !== selectedComplaint?.id
    );

    return (
        <div className="p-8 min-h-screen bg-gray-100">
            <h1 className="text-3xl font-bold text-purple-700">
                {selectedComplaint?.name}
            </h1>
            <p className="text-md text-gray-600 mt-2">
                {selectedComplaint?.description}
            </p>

            <div className="mt-6 p-6 bg-white rounded-lg shadow-lg border border-gray-200">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                    Complaint Details
                </h2>
                <div className="space-y-3">
                    <div className="flex justify-between">
                        <p className="font-medium text-gray-600">
                            <strong>Locality:</strong>
                        </p>
                        <p className="text-gray-800">
                            {selectedComplaint?.locality || "Unknown"}
                        </p>
                    </div>
                    <div className="flex justify-between">
                        <p className="font-medium text-gray-600">
                            <strong>Priority:</strong>
                        </p>
                        <p
                            className={`font-medium ${
                                selectedComplaint?.priority === "URGENT"
                                    ? "text-red-500"
                                    : selectedComplaint?.priority === "HIGH"
                                    ? "text-yellow-500"
                                    : "text-green-500"
                            }`}
                        >
                            {selectedComplaint?.priority}
                        </p>
                    </div>
                    <div className="flex justify-between">
                        <p className="font-medium text-gray-600">
                            <strong>Status:</strong>
                        </p>
                        <p
                            className={`font-medium ${
                                selectedComplaint?.status === "PENDING"
                                    ? "text-red-600"
                                    : selectedComplaint?.status ===
                                      "IN_PROGRESS"
                                    ? "text-orange-600"
                                    : "text-green-600"
                            }`}
                        >
                            {selectedComplaint?.status}
                        </p>
                    </div>
                </div>

                <button
                    className="mt-6 w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out"
                    onClick={() => openModal(selectedComplaint)}
                >
                    Change Status
                </button>
            </div>

            <div className="mt-10 bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-800">
                    Other Complaints in{" "}
                    {selectedComplaint?.locality || "Unknown"}
                </h2>
                <table className="min-w-full mt-4 border-collapse">
                    <thead>
                        <tr className="text-left bg-gray-200">
                            <th className="p-3">Complaint ID</th>
                            <th className="p-3">Complaint</th>
                            <th className="p-3">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b hover:bg-gray-100">
                            <td className="p-3">104</td>
                            <td className="p-3">Garbage Collection Delay</td>
                            <td className="p-3 text-red-700 font-medium">
                                PENDING
                            </td>
                        </tr>
                        <tr className="border-b hover:bg-gray-100">
                            <td className="p-3">105</td>
                            <td className="p-3">Road Potholes</td>
                            <td className="p-3 text-orange-700 font-medium">
                                IN_PROGRESS
                            </td>
                        </tr>
                        <tr className="border-b hover:bg-gray-100">
                            <td className="p-3">106</td>
                            <td className="p-3">Illegal Parking</td>
                            <td className="p-3 text-green-700 font-medium">
                                RESOLVED
                            </td>
                        </tr>
                        {relatedComplaints.length > 0 ? (
                            relatedComplaints.map((comp) => (
                                <tr
                                    key={comp.id}
                                    className="border-b hover:bg-gray-100"
                                >
                                    <td className="p-3">{comp.id}</td>
                                    <td className="p-3">{comp.name}</td>
                                    <td className="p-3 text-green-700 font-medium">
                                        {comp.status}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="3"
                                    className="p-3 text-center text-gray-600"
                                >
                                    No other complaints in this locality
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
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
