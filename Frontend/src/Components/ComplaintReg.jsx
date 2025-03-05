import { useState } from "react";
import axios from "axios";

const ComplaintReg = ({ closeForm }) => {
  const [formData, setFormData] = useState({
    name: "",
    mobileNumber: "",
    locality: "",
    description: "",
    department: "",
    attachment: null,
  });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [complaintId, setComplaintId] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, attachment: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:3000/user/complaintreg",
        formData
      );
      setSuccessMessage("Complaint registered successfully!");
      setComplaintId(response.data.complaintId);
    } catch (error) {
      console.error("Error submitting complaint:", error);
    } finally {
      setLoading(false);
      setTimeout(() => setSuccessMessage(""), 2500);
      setFormData({
        name: "",
        mobileNumber: "",
        locality: "",
        description: "",
        department: "",
        attachment: null,
      });
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(complaintId);
  };

  const departments = [
    "Municipality",
    "Water Department",
    "Electricity Department",
    "Public Works Department (PWD)",
  ];

  return (
    <div className="relative max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      {/* Close Button */}
      <button
        onClick={closeForm}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
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

      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Complaint Registration Form
      </h2>

      {successMessage && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded shadow-md">
          {successMessage}
        </div>
      )}

      {complaintId && (
        <div className="mt-4 p-3 bg-gray-100 rounded-md flex justify-between items-center">
          <span className="text-gray-700 font-semibold">
            Complaint ID: {complaintId}
          </span>
          <button
            onClick={copyToClipboard}
            className="ml-2 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Copy
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter full name"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="mobileNumber"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Mobile Number
            </label>
            <input
              type="tel"
              id="mobileNumber"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleInputChange}
              placeholder="Enter mobile number"
              pattern="[0-9]{10}"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="locality"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Locality
            </label>
            <input
              type="text"
              id="locality"
              name="locality"
              value={formData.locality}
              onChange={handleInputChange}
              placeholder="Enter locality"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="department"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Department
            </label>
            <select
              id="department"
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter complaint details"
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="attachment"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Attach Image
          </label>
          <input
            type="file"
            id="attachment"
            name="attachment"
            onChange={handleFileChange}
            accept="image/*"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded-md transition-colors ${
            loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {loading ? "Submitting..." : "Submit Complaint"}
        </button>
      </form>
    </div>
  );
};

export default ComplaintReg;
