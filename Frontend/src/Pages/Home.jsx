import React, { useState } from "react";

const Home = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="relative h-screen w-screen max-w-[2000px] max-h-[1000px] bg-[var(--secondary-color)] flex flex-col">
            <div className="w-full h-full flex flex-col">
                {/* Navigation Bar */}
                <nav className="w-full h-[12%] py-6 px-10 flex justify-between items-center  bg-opacity-80 top-0 z-50">
                    <h2 className="text-2xl font-bold">AI Complaint System</h2>
                    <div className="space-x-6">
                        <a href="#" className=" ">
                            Home
                        </a>
                        <a href="#" className=" ">
                            Features
                        </a>
                        <a href="#" className=" ">
                            Contact
                        </a>
                        <button
                            className="bg-[var(--boom-color)] px-6 py-2 rounded-full shadow-lg hover:bg-[var(--boom-color)] transition"
                            onClick={() => setIsModalOpen(true)}
                        >
                            Get Started
                        </button>
                    </div>
                </nav>

                {/* Hero Section */}
                <div className="w-full h-[88%] flex items-center justify-between">
                    <div className="flex flex-col justify-center items-start h-full w-1/2 box-border px-10">
                        <h1 className="text-6xl font-extrabold tracking-tight leading-tight">
                            Designed{" "}
                            <span className="italic text-[var(--boom-color)]">
                                to Solve
                            </span>
                        </h1>
                        <p className="mt-6 text-lg  max-w-xl leading-relaxed">
                            AI-driven complaint analysis and routing system to
                            streamline public service grievances.
                        </p>
                        <button
                            className="mt-8 bg-[var(--boom-color)] px-8 py-3 text-lg font-medium rounded-full shadow-lg hover:bg-[var(--boom-color)] transition hover:scale-105"
                            onClick={() => setIsModalOpen(true)}
                        >
                            Get Started
                        </button>
                    </div>

                    {/* Features Section */}
                    <div className="flex flex-row flex-wrap justify-center gap-10 w-1/2 box-border px-10">
                        {[
                            {
                                title: "Real-time Analysis",
                                desc: "Utilizes NLP for quick issue classification.",
                                icon: "⚡",
                            },
                            {
                                title: "Automated Routing",
                                desc: "Smartly directs complaints to the right authorities.",
                                icon: "📡",
                            },
                            {
                                title: "Multi-source Data",
                                desc: "Collects inputs from social media, forums, & more.",
                                icon: "🌐",
                            },
                            {
                                title: "Insights Dashboard",
                                desc: "Provides actionable insights for governance.",
                                icon: "📊",
                            },
                            {
                                title: "User-Friendly Reports",
                                desc: "Generates easy-to-read performance reports.",
                                icon: "📑",
                            },
                        ].map((feature, index) => (
                            <div
                                key={index}
                                className={`bg-[var(--primary-color)] p-4 rounded-lg shadow-lg flex flex-col items-center text-center transition transform hover:scale-105 hover:shadow-xl w-[18%] `}
                            >
                                <div className="text-2xl mb-2 text-[var(--boom-color)]">
                                    {feature.icon}
                                </div>
                                <h2 className="text-md font-semibold text-[var(--boom-color)]">
                                    {feature.title}
                                </h2>
                                <p className="mt-1 text-xs">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div
                className={`absolute flex items-center justify-center w-full ${
                    isModalOpen ? "scale-100" : "scale-0 "
                } h-full bg-gray-900 bg-opacity-50`}
            >
                <div
                    className={` p-8 rounded-lg shadow-lg text-center transition-all duration-300 ease-out transform ${
                        isModalOpen
                            ? "scale-100 opacity-100"
                            : "scale-75 opacity-0"
                    }`}
                >
                    <h2 className="text-2xl font-bold mb-4">Continue as</h2>
                    <div className="flex gap-4">
                        <button className="px-6 py-2 bg-blue-500 rounded hover:bg-blue-600">
                            User
                        </button>
                        <button className="px-6 py-2 bg-green-500 rounded hover:bg-green-600">
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
