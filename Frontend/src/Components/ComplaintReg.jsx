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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            attachment: e.target.files[0],
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await axios.post("http://localhost:3000/user/complaintreg");
        console.log("Form Data:", formData);
    };

    const departments = [
        "Municipality",
        "Water Department",
        "Electricity Department",
        "Public Works Department (PWD)",
    ];

    return (
        <div className="flex flex-col items-center justify-center w-full h-full z-20 bg-black bg-opacity-50 fixed top-0 left-0">
            <div className="bg-white p-6 rounded-lg shadow-md w-80 relative">
                <button
                    onClick={closeForm}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="black"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        width="24"
                        height="24"
                    >
                        <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                </button>
                <h2 className="text-xl font-semibold text-center mb-4">
                    Complaint Registration
                </h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Full Name"
                        className="p-2 border rounded"
                        required
                    />
                    <input
                        type="tel"
                        name="mobileNumber"
                        value={formData.mobileNumber}
                        onChange={handleInputChange}
                        placeholder="Mobile Number"
                        pattern="[0-9]{10}"
                        className="p-2 border rounded"
                        required
                    />
                    <input
                        type="text"
                        name="locality"
                        value={formData.locality}
                        onChange={handleInputChange}
                        placeholder="Locality"
                        className="p-2 border rounded"
                        required
                    />
                    <select
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        className="p-2 border rounded"
                        required
                    >
                        <option value="">Select Department</option>
                        {departments.map((dept) => (
                            <option key={dept} value={dept}>
                                {dept}
                            </option>
                        ))}
                    </select>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Complaint Description"
                        className="p-2 border rounded"
                        rows="4"
                    />
                    <input
                        type="file"
                        name="attachment"
                        onChange={handleFileChange}
                        accept="image/*"
                        className="p-2 border rounded"
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ComplaintReg;
