import React, { useState } from "react";
import axios from "axios";

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
      const response = await axios.get(
        `http://localhost:3000/user/trackcomplaint/${complaintId}`
      );
      setComplaint(response.data);
    } catch (err) {
      setError(
        err.response?.data?.error || "Error fetching complaint details."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-70 z-50">
      <div className="relative p-6 bg-white shadow-md rounded-lg w-full max-w-md">
        {/* Close Button */}
        <button
          onClick={closeForm}
          className="absolute top-2 right-2 p-2 text-gray-600 hover:text-gray-800"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <h2 className="text-xl font-bold mb-4 text-center text-gray-700">
          Track Your Complaint
        </h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter Complaint ID"
            value={complaintId}
            onChange={(e) => setComplaintId(e.target.value)}
            className="w-full p-2 border rounded-lg"
          />
          <button
            onClick={handleTrack}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Tracking..." : "Track"}
          </button>
        </div>
        {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
        {complaint && (
          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <h3 className="text-lg font-semibold">{complaint.name}</h3>
            <p className="text-sm text-gray-600">{complaint.description}</p>
            <p className="mt-2">
              <strong>Locality:</strong> {complaint.locality}
            </p>
            <p>
              <strong>Priority:</strong> {complaint.priority}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span
                className={`font-semibold ${
                  complaint.status === "RESOLVED"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {complaint.status}
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackComplaint;
 