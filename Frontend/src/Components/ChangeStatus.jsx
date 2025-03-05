import React, { useState } from "react";
import axios from "axios";

const ChangeStatus = ({ complaint, closeModal, updateComplaintStatus }) => {
    const [selectedStatus, setSelectedStatus] = useState(complaint.status);
    const [image, setImage] = useState(null);

    const handleStatusChange = async () => {
        if (!image || image.length === 0)
            return alert("Please upload at least one image proof.");

        const formData = new FormData();
        formData.append("status", selectedStatus);

        // Append each file in the 'image' array to the form data
        Array.from(image).forEach((file) => {
            formData.append("attachments", file);
        });

        try {
            const response = await axios.post(
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
        } catch (error) {
            console.error(
                "Error updating status:",
                error.response?.data || error.message
            );
            alert("Failed to update status.");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">Change Status</h2>
                <p>
                    <strong>ID:</strong> {complaint.id}
                </p>
                <p>
                    <strong>Complaint:</strong> {complaint.name}
                </p>
                <p>
                    <strong>Current Status:</strong> {complaint.status}
                </p>

                <div className="mt-4">
                    {["PENDING", "IN_PROGRESS", "RESOLVED", "REJECTED"].map(
                        (status) => (
                            <button
                                key={status}
                                className={`px-4 py-2 m-1 rounded ${
                                    selectedStatus === status
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-300"
                                }`}
                                onClick={() => setSelectedStatus(status)}
                            >
                                {status}
                            </button>
                        )
                    )}
                </div>

                <input
                    type="file"
                    className="mt-4 w-full"
                    multiple // Allow multiple file selection
                    onChange={(e) => setImage(e.target.files)}
                />

                <div className="mt-4">
                    <button
                        className="bg-green-600 text-white px-4 py-2 rounded"
                        onClick={handleStatusChange}
                    >
                        Submit
                    </button>
                    <button
                        className="bg-red-600 text-white px-4 py-2 ml-2 rounded"
                        onClick={closeModal}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChangeStatus;