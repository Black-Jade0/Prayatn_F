import { useState } from "react";

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
            // Simulating API call for demonstration
            await new Promise((resolve) => setTimeout(resolve, 1000));
            // Mock response with a random complaint ID
            const mockComplaintId =
                "CMP" + Math.floor(100000 + Math.random() * 900000);
            setSuccessMessage("Complaint registered successfully!");
            setComplaintId(mockComplaintId);
        } catch (error) {
            console.error("Error submitting complaint:", error);
        } finally {
            setLoading(false);
            setTimeout(() => setSuccessMessage(""), 3000);
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
        <div className="relative max-w-2xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden border border-gray-100">
            {/* Header */}
            <div className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-bold">
                    Complaint Registration Form
                </h2>
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

            {/* Success message */}
            {successMessage && (
                <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 mx-6 mt-4 rounded shadow-sm">
                    <div className="flex items-center">
                        <svg
                            className="h-5 w-5 mr-2"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <p>{successMessage}</p>
                    </div>
                </div>
            )}

            {/* Complaint ID box */}
            {complaintId && (
                <div className="mx-6 mt-4 p-4 bg-blue-50 rounded-md border border-blue-200 flex justify-between items-center">
                    <div>
                        <p className="text-sm text-blue-700 font-medium">
                            Your complaint has been registered
                        </p>
                        <p className="text-gray-700 font-bold">{complaintId}</p>
                    </div>
                    <button
                        onClick={copyToClipboard}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm flex items-center"
                    >
                        <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                            />
                        </svg>
                        Copy ID
                    </button>
                </div>
            )}

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Enter your full name"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="mobileNumber"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Mobile Number{" "}
                            <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="tel"
                            id="mobileNumber"
                            name="mobileNumber"
                            value={formData.mobileNumber}
                            onChange={handleInputChange}
                            placeholder="Enter 10-digit mobile number"
                            pattern="[0-9]{10}"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label
                            htmlFor="locality"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Locality/Area{" "}
                            <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="locality"
                            name="locality"
                            value={formData.locality}
                            onChange={handleInputChange}
                            placeholder="Enter your locality"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="department"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Department <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="department"
                            name="department"
                            value={formData.department}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
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
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Complaint Description{" "}
                        <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Please provide detailed information about your complaint"
                        rows="4"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div>
                    <label
                        htmlFor="attachment"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Attach Image (Optional)
                    </label>
                    <div className="mt-1 flex items-center">
                        <input
                            type="file"
                            id="attachment"
                            name="attachment"
                            onChange={handleFileChange}
                            accept="image/*"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                        Upload images of the issue (JPG, PNG up to 5MB)
                    </p>
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 px-4 rounded-md transition-colors text-white font-medium flex items-center justify-center ${
                            loading
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700"
                        }`}
                    >
                        {loading ? (
                            <>
                                <svg
                                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                                Processing...
                            </>
                        ) : (
                            "Submit Complaint"
                        )}
                    </button>
                </div>

                <p className="text-xs text-gray-500 text-center">
                    Your personal information will be handled in accordance with
                    our privacy policy.
                </p>
            </form>
        </div>
    );
};

export default ComplaintReg;
