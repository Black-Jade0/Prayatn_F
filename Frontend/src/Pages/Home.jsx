import React, { useState } from "react";

const Home = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div>
           
        <div className="relative min-h-screen bg-black text-white flex flex-col">
            {/* Navigation Bar */}
            <nav className="w-full py-6 px-10 flex justify-between items-center bg-black bg-opacity-80 fixed top-0 left-0 right-0 z-50">
                <h2 className="text-2xl font-bold text-white">AI Complaint System</h2>
                <div className="space-x-6">
                    <a href="#" className="text-gray-300 hover:text-white">Home</a>
                    <a href="#" className="text-gray-300 hover:text-white">Features</a>
                    <a href="#" className="text-gray-300 hover:text-white">Contact</a>
                    <button className="bg-purple-600 text-white px-6 py-2 rounded-full shadow-lg hover:bg-purple-700 transition">Get Started</button>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="flex flex-col justify-center items-start h-screen px-10 relative z-10 absolute left-10 top-1/4">
                <h1 className="text-6xl font-extrabold tracking-tight text-white leading-tight">
                    Designed <span className="italic text-purple-400">to Solve</span>
                </h1>
                <p className="mt-6 text-lg text-gray-300 max-w-xl leading-relaxed">
                    AI-driven complaint analysis and routing system to streamline public service grievances.
                </p>
                <button className="mt-8 bg-purple-600 text-white px-8 py-3 text-lg font-medium rounded-full shadow-lg hover:bg-purple-700 transition hover:scale-105">
                    Get Started
                </button>
            </div>

            {/* Features Section */}
            <div className="absolute right-10 top-1/4 grid grid-cols-2 gap-4 z-10 transform scale-90">
                {[
                    { title: "Real-time Analysis", desc: "Utilizes NLP for quick issue classification.", icon: "⚡" },
                    { title: "Automated Routing", desc: "Smartly directs complaints to the right authorities.", icon: "📡" },
                    { title: "Multi-source Data", desc: "Collects inputs from social media, forums, & more.", icon: "🌐" },
                    { title: "Insights Dashboard", desc: "Provides actionable insights for governance.", icon: "📊" },
                    { title: "User-Friendly Reports", desc: "Generates easy-to-read performance reports.", icon: "📑" }
                ].map((feature, index) => (
                    <div key={index} className={`bg-gray-900 text-white p-4 rounded-lg shadow-lg flex flex-col items-center text-center transition transform hover:scale-105 hover:shadow-xl w-40 ${index === 4 ? 'col-span-2 mx-auto' : ''}`}>
                        <div className="text-3xl mb-2 text-purple-400">{feature.icon}</div>
                        <h2 className="text-md font-semibold text-purple-300">{feature.title}</h2>
                        <p className="text-gray-400 mt-1 text-xs">{feature.desc}</p>
                    </div>
                ))}
            </div>
        </div>


            {isModalOpen ? (
                <div className="absolute flex items-center justify-center z-30">
                    <div className="bg-white p-8 rounded-lg shadow-lg text-center">
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
            ) : (
                <></>
            )}
        </div>
    );
};

export default Home;
