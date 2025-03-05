import { useEffect } from "react";

export default function ChatBot() {
    useEffect(() => {
        // Create and append the inject script
        const injectScript = document.createElement("script");
        injectScript.src = "https://cdn.botpress.cloud/webchat/v2.2/inject.js";
        injectScript.async = true;
        document.body.appendChild(injectScript);

        // Wait for inject script to load before proceeding
        injectScript.onload = () => {
            console.log("Botpress WebChat inject script loaded.");

            // Now load the config script
            const configScript = document.createElement("script");
            configScript.src =
                "https://files.bpcontent.cloud/2025/03/05/18/20250305183538-FUYXVFTS.js";
            configScript.async = true;
            document.body.appendChild(configScript);

            // Wait for config script to load
            configScript.onload = () => {
                console.log("Botpress config script loaded.");

                // Initialize with proper event listeners
                window.botpressWebChat.init({
                    // Your config options go here if needed
                    // These will override what's in the config.js file
                });

                // Listen for the "webchatReady" event
                window.addEventListener("webchatReady", function () {
                    console.log("Webchat is ready!");

                    // Now we can safely add our event listeners
                    window.botpressWebChat.onEvent("LIFECYCLE.LOADED", () => {
                        console.log("Bot fully loaded");
                    });

                    // Listen for variables/state changes
                    window.botpressWebChat.onEvent(
                        "LIFECYCLE.STATE_CHANGED",
                        (event) => {
                            console.log("State changed:", event);
                            if (event.state) {
                                const {
                                    name,
                                    mobileNumber,
                                    locality,
                                    description,
                                    department,
                                    attachment,
                                } = event.state;

                                // If we have all the required fields, submit the data
                                if (
                                    name &&
                                    mobileNumber &&
                                    description &&
                                    department
                                ) {
                                    submitComplaintToBackend({
                                        name,
                                        mobileNumber,
                                        locality,
                                        description,
                                        department,
                                        attachment,
                                    });
                                }
                            }
                        }
                    );

                    // Listen for conversation end or submission
                    window.botpressWebChat.onEvent("LIFECYCLE.END", (event) => {
                        console.log("Conversation ended, final state:", event);
                        // Final submission if needed
                        window.botpressWebChat.getState().then((state) => {
                            submitComplaintToBackend(state);
                        });
                    });
                });
            };
        };

        return () => {
            // Cleanup
            if (document.body.contains(injectScript)) {
                document.body.removeChild(injectScript);
            }

            const configScript = document.querySelector(
                'script[src*="bpcontent.cloud"]'
            );
            if (configScript && document.body.contains(configScript)) {
                document.body.removeChild(configScript);
            }
        };
    }, []);

    // Send complaint data to the backend
    const submitComplaintToBackend = async (complaintData) => {
        try {
            const formData = new FormData();
            console.log("Submitting complaint data:", complaintData);

            // Append regular fields to formData
            formData.append("name", complaintData.name || "");
            formData.append("mobileNumber", complaintData.mobileNumber || "");
            formData.append("locality", complaintData.locality || "");
            formData.append("description", complaintData.description || "");
            formData.append("department", complaintData.department || "");

            // Append file attachments if they exist
            if (complaintData.attachment) {
                if (Array.isArray(complaintData.attachment)) {
                    complaintData.attachment.forEach((file, index) => {
                        formData.append("attachments", file, file.name);
                    });
                } else if (complaintData.attachment instanceof File) {
                    formData.append(
                        "attachments",
                        complaintData.attachment,
                        complaintData.attachment.name
                    );
                }
            }

            const response = await fetch(
                "http://localhost:3000/user/complaintreg",
                {
                    method: "POST",
                    body: formData,
                }
            );

            const result = await response.json();
            console.log("Complaint registered with ID:", result.complaintId);

            // Optionally, you can also notify the user through the chatbot
            window.botpressWebChat.sendEvent({
                type: "complaintRegistered",
                complaintId: result.complaintId,
            });
        } catch (error) {
            console.error("Error registering complaint:", error);
        }
    };

    return <div id="bp-webchat-container"></div>;
}
