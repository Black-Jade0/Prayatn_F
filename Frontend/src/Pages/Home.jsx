import React, { useState } from "react";

const Home = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="relative h-screen flex flex-col items-center justify-center bg-cover bg-center transition-all ease-in duration-300">
            <div
                className={`text-center max-w-2xl ${
                    isModalOpen ? "blur-lg" : ""
                }`}
            >
                <h1 className="text-5xl font-bold mb-4">
                    AI-Enabled Public Service Complaint Analysis
                </h1>
                <p className="text-lg mb-6">
                    A smart platform that aggregates, analyzes, and routes
                    citizen complaints using AI.
                </p>
                <button
                    className="bg-blue-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-600 transition"
                    onClick={() => setIsModalOpen(true)}
                >
                    Get Started
                </button>
            </div>

            <div className={`absolute flex items-center justify-center w-full ${isModalOpen ? ("scale-100 z-10") : ("scale-0 -z-10")} h-full bg-gray-900 bg-opacity-50`}>
                <div
                    className={`bg-white p-8 rounded-lg shadow-lg text-center transition-all duration-300 ease-out transform ${
                        isModalOpen
                            ? "scale-100 opacity-100"
                            : "scale-75 opacity-0"
                    }`}
                >
                    <h2 className="text-2xl font-bold mb-4">Continue as</h2>
                    <div className="flex gap-4">
                        <button className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                            User
                        </button>
                        <button className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                            Admin
                        </button>
                    </div>
                    <button
                        className="mt-4 text-gray-500 hover:text-gray-700"
                        onClick={() => setIsModalOpen(false)}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Home;
