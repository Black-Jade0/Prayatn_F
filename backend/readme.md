async function standardizeDescription(description) {
    try {
        const response = await axios.post("http://localhost:11434/api/generate", {
            model: "llama3.2",
            prompt: `Standardize the following complaint into a concise, structured format:

            Complaint: "${description}"
            
            Output the standardized complaint description only, without additional text.`,
        });
        return response.data;
    } catch (error) {
        console.error("Error in standardizing complaint:", error);
        return description; // Fallback to original description
    }
}
new prompt : "You are a complaint-processing assistant. Your task is to rewrite user complaints into a standardized and structured format while preserving the key issue and location details.

Rules:
1. Keep it concise and structured.
2. Use neutral and formal wording.
3. Ensure consistency in phrasing.
4. Do not add, remove, or infer extra information.  Complaint: "{user_complaint}" Output only the standardized complaint description without any additional text or formatting". Integrate the new prompt into the function standardizeDescription