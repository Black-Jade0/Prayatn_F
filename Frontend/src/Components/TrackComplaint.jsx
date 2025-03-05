import { useState } from "react";

const TrackComplaint = ({ closeForm }) => {
    const [complaintId, setComplaintId] = useState("");
    const [complaint, setComplaint] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleTrack = async () => {
        if (!complaintId.trim()) {
            setError("Please enter a valid Complaint ID.");
            return;
        }

        setLoading(true);
        setError("");
        setComplaint(null);

        try {
            // Simulating API call for demonstration
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Mock data for demonstration
            if (complaintId.startsWith("CMP")) {
                setComplaint({
                    name: "John Doe",
                    description:
                        "Water leakage from main pipeline causing road damage",
                    locality: "Green Park, Block C",
                    priority: "High",
                    department: "Water Department",
                    status: Math.random() > 0.5 ? "RESOLVED" : "PENDING",
                    dateSubmitted: "2025-02-28",
                    complaintId: complaintId,
                });
            } else {
                throw new Error("Invalid complaint ID");
            }
        } catch (err) {
            setError(
                "Complaint not found. Please verify the ID and try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "RESOLVED":
                return "bg-green-100 text-green-800 border-green-200";
            case "PENDING":
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "IN PROGRESS":
                return "bg-blue-100 text-blue-800 border-blue-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    return (
        <div className="relative max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden border border-gray-100">
            {/* Header */}
            <div className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-bold">Track Your Complaint</h2>
                <button
                    onClick={closeForm}
                    className="text-white hover:text-gray-200 focus:outline-none"
                    aria-label="Close form"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6"
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
                </button>
            </div>

            <div className="p-6">
                <div className="mb-6">
                    <p className="text-gray-600 text-sm mb-4">
                        Enter your complaint ID below to check the current
                        status of your complaint.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <input
                            type="text"
                            placeholder="Enter Complaint ID (e.g., CMP123456)"
                            value={complaintId}
                            onChange={(e) => setComplaintId(e.target.value)}
                            className="flex-grow px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <button
                            onClick={handleTrack}
                            className={`px-6 py-2 rounded-md transition-colors text-white font-medium flex items-center justify-center ${
                                loading
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700"
                            }`}
                            disabled={loading}
                        >
                            {loading ? (
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
                                    Tracking...
                                </>
                            ) : (
                                "Track"
                            )}
                        </button>
                    </div>

                    {error && (
                        <div className="mt-3 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded">
                            <div className="flex">
                                <svg
                                    className="h-5 w-5 mr-2"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                {error}
                            </div>
                        </div>
                    )}
                </div>

                {complaint && (
                    <div className="mt-6 border border-gray-200 rounded-lg overflow-hidden">
                        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold text-gray-800">
                                    {complaint.name}
                                </h3>
                                <span
                                    className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${getStatusColor(
                                        complaint.status
                                    )}`}
                                >
                                    {complaint.status}
                                </span>
                            </div>
                            <p className="text-xs text-gray-500">
                                Complaint ID: {complaint.complaintId}
                            </p>
                        </div>

                        <div className="p-4">
                            <div className="mb-4">
                                <h4 className="text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </h4>
                                <p className="text-gray-600">
                                    {complaint.description}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <h4 className="font-medium text-gray-700 mb-1">
                                        Locality
                                    </h4>
                                    <p className="text-gray-600">
                                        {complaint.locality}
                                    </p>
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-700 mb-1">
                                        Priority
                                    </h4>
                                    <p className="text-gray-600">
                                        {complaint.priority}
                                    </p>
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-700 mb-1">
                                        Department
                                    </h4>
                                    <p className="text-gray-600">
                                        {complaint.department}
                                    </p>
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-700 mb-1">
                                        Date Submitted
                                    </h4>
                                    <p className="text-gray-600">
                                        {complaint.dateSubmitted}
                                    </p>
                                </div>
                            </div>

                            {complaint.status === "RESOLVED" && (
                                <div className="mt-4 p-3 bg-green-50 border border-green-100 rounded text-sm text-green-700">
                                    Your complaint has been resolved. Thank you
                                    for your patience.
                                </div>
                            )}

                            {complaint.status === "PENDING" && (
                                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-100 rounded text-sm text-yellow-700">
                                    Your complaint is currently under review.
                                    We'll update you once there's progress.
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {!complaint && !loading && !error && (
                    <div className="flex flex-col items-center justify-center py-6 text-gray-500">
                        <svg
                            className="w-12 h-12 mb-2 text-gray-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                        </svg>
                        <p className="text-sm">
                            Enter your complaint ID to view details
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TrackComplaint;
