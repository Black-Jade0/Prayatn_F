const axios = require('axios');

async function processComplaint(description) {
  try {
    // Send the request to the API
    const response = await axios.post("http://localhost:11434/api/generate", {
      model: "llama3.2",
      prompt: `You are a complaint-processing assistant. Your task is to rewrite user complaints into a standardized and structured format while preserving the key issue and location details.

Rules:
1. Keep it concise and structured.
2. Use neutral and formal wording.
3. Ensure consistency in phrasing.
4. Do not add, remove, or infer extra information.

Complaint: "${description}"

Output only the standardized complaint description without any additional text or formatting`
    });

    // Log the response to inspect its structure
    console.log("Response Data:", response);

    // Check if the response data is an array
    if (Array.isArray(response.data)) {
      // Initialize an array to collect all parts of the response
      let structuredComplaint = [];

      // Loop through the result and extract the 'response' field
      response.data.forEach(item => {
        if (item.response) {
          structuredComplaint.push(item.response);
        }
      });

      // Join all the parts of the complaint into one single string
      let fullComplaint = structuredComplaint.join(' ').trim();

      // Check if the last item is marked as 'done' and contains the full response
      const isCompleted = response.data[response.data.length - 1]?.done === true;

      // If completed, return the structured response; otherwise, show a message
      if (isCompleted) {
        return {
          model: response.data[0]?.model,
          created_at: response.data[0]?.created_at,
          structured_complaint: fullComplaint,
          done: true,
          done_reason: "stop"
        };
      } else {
        return {
          model: response.data[0]?.model,
          created_at: response.data[0]?.created_at,
          structured_complaint: "Complaint is still being processed.",
          done: false,
          done_reason: "incomplete"
        };
      }
    } else {
      // Handle cases where the response is not an array
      console.error("Response is not an array. Actual response:", response.data);
      return null;
    }

  } catch (error) {
    console.error("Error processing complaint:", error);
    return null;
  }
}

// Example usage
const description = "There is a large pothole in the middle of the road near the park, causing a traffic hazard.";

processComplaint(description).then(result => {
  console.log("Processed complaint:", result);
});
