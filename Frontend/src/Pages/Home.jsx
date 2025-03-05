import React, { useState } from "react";
import AdminSignin from "../Components/Adminsignin";
import Adminhome from "./Admin/Adminhome";
import { useEffect } from "react";
import ComplaintReg from "../Components/ComplaintReg";
import axios from "axios";
import TrackComplaint from "../Components/TrackComplaint";

const Home = () => {
    const [isAdminSignin, setIsAdminSignin] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isComplaintReg, setIsComplaintReg] = useState(false);
    const [isComplaintTrack, setIsComplaintTrack] = useState(false);
    const [isComplaintcompleted, setIsComplaintcompleted] = useState(false);
    const [isAdminLogout, setisAdminLogout] = useState(false);

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

    if (isAuthenticated) {
        return (
            <Adminhome
                logout={() => {
                    setisAdminLogout(true);
                }}
            />
        );
    }

    return (
        <div
            className={`relative h-screen w-screen max-w-[2000px] max-h-[1000px] bg-[var(--secondary-color)] flex flex-col`}
        >
            <div className="w-full h-full flex flex-col">
                {/* Navigation Bar */}
                <nav className="w-full h-[12%] py-6 px-10 flex justify-between items-center bg-opacity-80 top-0 z-50">
                    <h2 className="text-2xl font-bold">AI Complaint System</h2>
                    <div className="space-x-6">
                        <button
                            className="bg-[var(--boom-color)] px-6 py-2 font-medium rounded-full shadow-lg hover:bg-[var(--boom-color)] transition hover:scale-105  "
                            onClick={() => setIsAdminSignin(true)}
                        >
                            Login as Admin
                        </button>
                    </div>
                </nav>

                {/* Hero Section */}
                <div className="w-full h-[88%] flex items-center justify-between">
                    <div className="flex flex-col justify-center items-start h-full w-1/2 box-border px-10">
                        <h1 className="text-6xl font-extrabold tracking-tight leading-tight">
                        Resolve <span className="italic text-[var(--boom-color)]">Complaints</span> Seamlessly with {" "}
                            <span className="italic text-[var(--boom-color)]">
                            SOLO
                            </span>
                        </h1>
                        <p className="mt-6 text-lg max-w-xl leading-relaxed">
                            <b>Your Concerns, Our Priority:</b> We use AI to
                            simplify the complaint process, ensuring your issues
                            are heard and addressed efficiently.
                        </p>
                        <button
                            className="mt-8 bg-[var(--boom-color)] px-8 py-3 text-lg font-medium rounded-full shadow-lg hover:bg-[var(--boom-color)] transition hover:scale-105"
                            onClick={() => {
                                setIsComplaintReg(true);
                                console.log("yo");
                            }}
                        >
                            Register Complaint
                        </button>
                        <button
                            className="mt-8 bg-[var(--boom-color)] px-8 py-3 text-lg font-medium rounded-full shadow-lg hover:bg-[var(--boom-color)] transition hover:scale-105"
                            onClick={() => setIsComplaintTrack(true)}
                        >
                            Track Complaint
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
                        ].map((feature, index) => (
                            <div
                                key={index}
                                className={`bg-[var(--primary-color)] p-4 rounded-lg shadow-lg flex flex-col items-center text-center transition transform hover:scale-105 hover:shadow-xl w-[18%]`}
                            >
                                <div className="text-2xl mb-2 text-[var(--boom-color)]">
                                    {feature.icon}
                                </div>
                                <h2 className="text-md font-semibold text-[var(--boom-color)]">
                                    {feature.title}
                                </h2>
                                <p className="mt-1 text-xs feature-desc">
                                    {feature.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Admin Sign-in Modal */}
            {isAdminSignin ? (
                <div
                    className={`transition-all ease-in duration-200 transform absolute flex items-center justify-center w-full h-full bg-gray-900 bg-opacity-70`}
                >
                    <AdminSignin
                        closeModal={() => setIsAdminSignin(false)}
                        signincomplete={() => setIsAuthenticated(true)}
                    />
                </div>
            ) : null}
            {isComplaintReg ? (
                <div
                    className={`transition-all ease-in duration-200 transform absolute flex items-center justify-center w-full h-full bg-gray-900 bg-opacity-70`}
                >
                    <ComplaintReg
                        closeForm={() => setIsComplaintReg(false)}
                        complaintcomplete={() => setIsComplaintcompleted(true)}
                    />
                </div>
            ) : null}
            {isComplaintTrack ? (
                <div
                    className={`transition-all ease-in duration-200 transform absolute flex items-center justify-center w-full h-full bg-gray-900 bg-opacity-70`}
                >
                    <TrackComplaint
                        closeForm={() => setIsComplaintTrack(false)}
                    />
                </div>
            ) : null}
        </div>
    );
};

export default Home;
