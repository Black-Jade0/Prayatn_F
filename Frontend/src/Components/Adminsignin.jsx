import React, { useState } from "react";

const AdminSignin = ({ closeModal, signincomplete }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSignin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await fetch("http://localhost:3000/admin/signin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
                credentials: "include", // Ensures cookies are sent
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Signin failed");
            data.userData &&
                localStorage.setItem("userData", JSON.stringify(data.userData));
            data.departmentName &&
                localStorage.setItem(
                    "departmentName",
                    data.departmentName
                );
            data.complaints &&
                localStorage.setItem(
                    "complaints",
                    JSON.stringify(data.complaints)
                );

            signincomplete();
            closeModal(); // Close modal after successful sign-in
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center w-full h-full z-20">
            <div className="bg-white p-6 rounded-lg shadow-md w-80 relative">
                {/* Close Button */}
                <button
                    onClick={closeModal}
                    className="absolute top-2 right-2 text-gray-900"
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

                <h2 className="text-xl font-semibold text-center mb-4">
                    Admin Sign In
                </h2>
                {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
                <form onSubmit={handleSignin} className="flex flex-col gap-4">
                    <input
                        type="email"
                        placeholder="Email"
                        className="p-2 border rounded"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="p-2 border rounded"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
                        disabled={loading}
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminSignin;
