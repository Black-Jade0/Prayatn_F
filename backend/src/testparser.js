const axios = require('axios');

class ComplaintProcessor {
    /**
     * Generate a standardized prompt for complaint processing
     * @param {string} description - Original complaint description
     * @returns {string} Formatted prompt for the AI model
     */
    static generatePrompt(description) {
        return `You are an advanced complaint standardization assistant. 
Transform the following complaint into a structured, machine-readable format:

Complaint: "${description}"

Provide output in this exact format:
Category: [SPECIFIC CATEGORY]
Description: [CONCISE, STANDARDIZED DESCRIPTION]
Keywords: [COMMA-SEPARATED SEARCHABLE KEYWORDS]
Priority: [LOW/MEDIUM/HIGH/URGENT]

Rules:
1. Be precise and factual
2. Use clear, neutral language
3. Determine priority based on potential impact and urgency
4. Choose a specific, relevant category
5. Extract 3-5 meaningful keywords`;
    }

    /**
     * Parse streaming response from Ollama/Llama model
     * @param {string} responseText - Raw response text from the model
     * @returns {string} Processed complaint description
     */
    static parseResponse(responseText) {
        // Split the response into individual JSON lines
        const responseLines = responseText.trim().split('\n');
        
        let fullResponse = '';
        for (const line of responseLines) {
            try {
                const chunk = JSON.parse(line);
                
                // Collect response chunks
                if (chunk.response) {
                    fullResponse += chunk.response;
                }
                
                // Stop if the response is complete
                if (chunk.done) {
                    break;
                }
            } catch (error) {
                console.error('Error parsing response line:', line);
            }
        }
        
        return fullResponse.trim();
    }

    /**
     * Process complaint using Ollama/Llama model
     * @param {string} description - Original complaint description
     * @returns {Promise<string>} Processed complaint
     */
    async processComplaint(description) {
        const prompt = ComplaintProcessor.generatePrompt(description);
        
        try {
            const response = await axios.post('http://localhost:11434/api/generate', {
                model: 'llama3.2',
                prompt: prompt,
                stream: true
            }, {
                responseType: 'text'
            });

            // Parse the streaming response
            return ComplaintProcessor.parseResponse(response.data);
        } catch (error) {
            console.error('Error processing complaint:', error);
            throw error;
        }
    }
    static parseResponseToJSON(responseText) {
        // Remove any explanatory text
        const cleanedResponse = responseText.split('Explanation:')[0].trim();
        
        // Split the response into lines
        const lines = cleanedResponse.split('\n');
        
        // Initialize result object
        const result = {};
        
        // Parse each line
        lines.forEach(line => {
            if (line.includes(':')) {
                const [key, value] = line.split(':').map(item => item.trim());
                
                // Convert key to camelCase for easier JavaScript access
                const camelCaseKey = key
                    .toLowerCase()
                    .replace(/\s+(.)/g, (match, group) => group.toUpperCase());
                
                result[camelCaseKey] = value;
            }
        });
        
        return result;
    }

    /**
     * Process complaint and return JSON
     * @param {string} description - Original complaint description
     * @returns {Promise<Object>} Processed complaint as JSON
     */
    async processComplaintAsJSON(description) {
        const prompt = ComplaintProcessor.generatePrompt(description);
        
        try {
            const response = await axios.post('http://localhost:11434/api/generate', {
                model: 'llama3.2',
                prompt: prompt,
                stream: true
            }, {
                responseType: 'text'
            });

            // Parse the streaming response
            const processedComplaint = ComplaintProcessor.parseResponse(response.data);
            
            // Convert to JSON
            return ComplaintProcessor.parseResponseToJSON(processedComplaint);
        } catch (error) {
            console.error('Error processing complaint:', error);
            throw error;
        }
    }
}

// Example usage
async function main() {
    const processor = new ComplaintProcessor();
    
     
    try {
        const complaint = "There is a large pothole in the middle of the road near the park, causing a traffic hazard";
        const processedComplaint = await processor.processComplaintAsJSON(complaint);
        
        console.log('Processed Complaint JSON:');
        console.log(processedComplaint);
        
        // Accessing specific fields
        console.log('Priority:', processedComplaint.priority);
        console.log('Keywords:', processedComplaint.keywords);
        console.log('Category:', processedComplaint.category);
    } catch (error) {
        console.error('Complaint processing failed:', error);
    }
}

// Uncomment to run
// main();

module.exports = ComplaintProcessor;