import React, { useState, useEffect } from "react";
import AdminSignin from "../Components/Adminsignin";
import Adminhome from "./Admin/Adminhome";
import ComplaintReg from "../Components/ComplaintReg";
import TrackComplaint from "../Components/TrackComplaint";
import ChatBot from "../Components/ChatBot";
import axios from "axios";

const Home = () => {
    const [isAdminSignin, setIsAdminSignin] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isComplaintReg, setIsComplaintReg] = useState(false);
    const [isComplaintTrack, setIsComplaintTrack] = useState(false);
    const [isComplaintcompleted, setIsComplaintcompleted] = useState(false);
    const [isAdminLogout, setisAdminLogout] = useState(false);

    // Enhanced color scheme
    const colors = {
        primary: "#3A3378",
        secondary: "#F8F8FC",
        accent: "#7D67DD",
        highlight: "#5C4CAA",
        text: "#2D2D2D",
    };

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await axios.get(
                    "http://localhost:3000/admin/check-auth",
                    { withCredentials: true }
                );

                if (res.status === 200) {
                    console.log("Token found");
                    setIsAuthenticated(true);
                }
            } catch (error) {
                if (error.response && error.response.status === 403) {
                    console.log("User not authenticated");
                } else {
                    console.error("Auth check failed:", error);
                }
                setIsAuthenticated(false);
            }
        };

        checkAuth();
    }, []);

    // Enhanced features data
    const features = [
        {
            title: "Intelligent Analysis",
            desc: "Advanced NLP for precise complaint classification and prioritization.",
            icon: "⚡",
        },
        {
            title: "Streamlined Processing",
            desc: "Efficient routing to appropriate authorities based on complaint type.",
            icon: "🔄",
        },
        {
            title: "Multi-channel Input",
            desc: "Secure handling of submissions from various digital platforms.",
            icon: "🌐",
        },
        {
            title: "Governance Dashboard",
            desc: "Comprehensive analytics and reporting for administrative oversight.",
            icon: "📊",
        },
    ];

    if (isAuthenticated) {
        return <Adminhome logout={() => setisAdminLogout(true)} />;
    }

    return (
        <>
            <div
                className="relative min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 font-sans overflow-hidden"
                style={{
                    "--primary-color": colors.primary,
                    "--secondary-color": colors.secondary,
                    "--accent-color": colors.accent,
                }}
            >
                <ChatBot />

                {/* Enhanced Navigation Bar */}
                <nav className="bg-white shadow-sm py-5 px-8 flex justify-between items-center sticky top-0 z-50">
                    <div className="flex items-center">
                        <div className="w-10 h-10 rounded-md bg-gradient-to-r from-indigo-700 to-purple-700 flex items-center justify-center mr-3 shadow-md">
                            <span className="text-white font-bold text-lg">
                                CV
                            </span>
                        </div>
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent">
                            CivicVoice
                        </h2>
                    </div>
                    <button
                        className="bg-gradient-to-r from-indigo-700 to-purple-700 text-white px-6 py-2.5 font-medium rounded-lg shadow-md hover:shadow-lg transition duration-300 transform hover:translate-y-px focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                        onClick={() => setIsAdminSignin(true)}
                    >
                        Admin Portal
                    </button>
                </nav>

                {/* Enhanced Hero Section */}
                <div className="container mx-auto px-6 py-16 flex flex-col lg:flex-row items-center">
                    <div className="lg:w-1/2 flex flex-col items-start space-y-8 mb-10 lg:mb-0">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-gray-800">
                            Efficient{" "}
                            <span className="text-indigo-700">Complaint</span>{" "}
                            Management with{" "}
                            <span className="text-indigo-700">SOLO AI</span>
                        </h1>

                        <p className="text-lg text-gray-600 max-w-xl leading-relaxed">
                            <strong className="text-gray-800">
                                Transforming Public Services:
                            </strong>{" "}
                            Our AI-powered platform streamlines the complaint
                            resolution process, ensuring transparency,
                            efficiency, and accountability in handling citizen
                            concerns.
                        </p>

                        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                            <button
                                className="bg-gradient-to-r from-indigo-700 to-purple-700 text-white px-8 py-3.5 text-lg font-medium rounded-lg shadow-md hover:shadow-lg transition duration-300 transform hover:translate-y-px focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 flex items-center justify-center"
                                onClick={() => setIsComplaintReg(true)}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 mr-2"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                    />
                                </svg>
                                Submit New Complaint
                            </button>

                            <button
                                className="bg-white text-indigo-700 border-2 border-indigo-700 px-8 py-3.5 text-lg font-medium rounded-lg shadow-md hover:shadow-lg transition duration-300 transform hover:translate-y-px focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 flex items-center justify-center"
                                onClick={() => setIsComplaintTrack(true)}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 mr-2"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                    />
                                </svg>
                                Track Existing Complaint
                            </button>
                        </div>
                    </div>

                    {/* Enhanced Features Section */}
                    <div className="lg:w-1/2 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 transform hover:translate-y-px border border-gray-100"
                            >
                                <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center mb-4 text-2xl">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Process Section - Replacing the Stats Section */}
                <div className="bg-gradient-to-r from-indigo-800 to-purple-800 text-white py-16">
                    <div className="container mx-auto px-6">
                        <h2 className="text-3xl font-bold text-center mb-12">
                            Our Streamlined Process
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            {[
                                {
                                    step: "01",
                                    title: "Submit",
                                    desc: "File your complaint through our secure digital platform",
                                },
                                {
                                    step: "02",
                                    title: "Analyze",
                                    desc: "AI technology classifies and prioritizes your concern",
                                },
                                {
                                    step: "03",
                                    title: "Assign",
                                    desc: "Your case is routed to the appropriate department",
                                },
                                {
                                    step: "04",
                                    title: "Resolve",
                                    desc: "Track progress until your issue is fully addressed",
                                },
                            ].map((process, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col items-center text-center"
                                >
                                    <div className="w-16 h-16 rounded-full bg-white text-indigo-800 flex items-center justify-center mb-4 text-2xl font-bold">
                                        {process.step}
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">
                                        {process.title}
                                    </h3>
                                    <p className="text-indigo-100">
                                        {process.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Enhanced Footer */}
                <footer className="bg-gray-900 text-white py-12">
                    <div className="container mx-auto px-6">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <div className="mb-8 md:mb-0">
                                <div className="flex items-center mb-4">
                                    <div className="w-8 h-8 rounded-md bg-gradient-to-r from-indigo-700 to-purple-700 flex items-center justify-center mr-2">
                                        <span className="text-white font-bold text-sm">
                                            CV
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold">
                                        CivicVoice
                                    </h3>
                                </div>
                                <p className="text-gray-400 max-w-md">
                                    Empowering citizens through
                                    technology-driven governance solutions that
                                    promote transparency and accessibility.
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                                <a
                                    href="#"
                                    className="text-gray-300 hover:text-white transition duration-300"
                                >
                                    About
                                </a>
                                <a
                                    href="#"
                                    className="text-gray-300 hover:text-white transition duration-300"
                                >
                                    Privacy Policy
                                </a>
                                <a
                                    href="#"
                                    className="text-gray-300 hover:text-white transition duration-300"
                                >
                                    Terms of Service
                                </a>
                                <a
                                    href="#"
                                    className="text-gray-300 hover:text-white transition duration-300"
                                >
                                    Contact Us
                                </a>
                            </div>
                        </div>
                        <div className="border-t border-gray-800 mt-10 pt-8 text-sm text-gray-400 text-center">
                            © {new Date().getFullYear()} SOLO AI Complaint
                            System. All rights reserved.
                        </div>
                    </div>
                </footer>

                {/* Modal Section (unchanged) */}
                {isAdminSignin && (
                    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 animate-fadeIn">
                        <div className="animate-slideIn">
                            <AdminSignin
                                closeModal={() => setIsAdminSignin(false)}
                                signincomplete={() => setIsAuthenticated(true)}
                            />
                        </div>
                    </div>
                )}

                {isComplaintReg && (
                    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 animate-fadeIn">
                        <div className="animate-slideIn">
                            <ComplaintReg
                                closeForm={() => setIsComplaintReg(false)}
                                complaintcomplete={() =>
                                    setIsComplaintcompleted(true)
                                }
                            />
                        </div>
                    </div>
                )}

                {isComplaintTrack && (
                    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 animate-fadeIn">
                        <div className="animate-slideIn">
                            <TrackComplaint
                                closeForm={() => setIsComplaintTrack(false)}
                            />
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Home;
