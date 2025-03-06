const axios = require('axios');
const { PrismaClient } = require("@prisma/client");

class ComplaintMatcher {
  constructor() {
    this.prisma = new PrismaClient();
    // Load pre-trained model
    this.similarityServiceUrl = 'http://localhost:5000/similarity';
  }

  /**
     * Check semantic similarity between two texts
     * @param {string} text1 - First text
     * @param {string} text2 - Second text
     * @param {number} [threshold=0.5] - Similarity threshold
     * @returns {Promise<boolean>} Whether texts are similar
     */
  async checkSimilarity(text1, text2, threshold = 0.4) {
    try {
        // Clean and preprocess texts
        const cleanText1 = this.cleanText(text1);
        const cleanText2 = this.cleanText(text2);

        // Call Python similarity service
        const response = await axios.post(this.similarityServiceUrl, {
            text1: cleanText1,
            text2: cleanText2,
            threshold: threshold
        });
        console.log("response from python: ",response.data)
        return response.data.isMatch;
    } catch (error) {
        console.error('Similarity check error:', error);
        return false;
    }
}
  /**
     * Find similar complaints with semantic matching
     * @param {Object} processedComplaint - Standardized complaint object
     * @param {string} userLocality - Locality of the complaint
     * @returns {Promise<Array>} Matching complaint IDs
     */
  async findSimilarComplaints(processedComplaint, userLocality,departmentId) {
    try {
        // Step 1: Fetch complaints in the same locality with specific conditions
        const localComplaints = await this.fetchLocalComplaints(userLocality, departmentId);
        console.log("localComplaints: ",localComplaints);
        // Step 2: Perform semantic matching
        const matchedComplaints = [];
        // Check similarity for each local complaint
        for (const complaint of localComplaints) {
            const isSimilar = await this.checkSimilarity(
                processedComplaint.description, 
                complaint.description
            );

            if (isSimilar) {
                matchedComplaints.push(complaint);
            }
        }
        console.log("MatchedComplaints: ",matchedComplaints)
        // Step 3: Update match counters if matches found
        if (matchedComplaints.length > 0) {
            const updatedComplaints = await this.updateMatchCounters(matchedComplaints);
            return updatedComplaints;
        }

        return []; // No similar complaints found
    } catch (error) {
        console.error('Error finding similar complaints:', error);
        throw error;
    }
}
  /**
   * Fetch local complaints with strict matching criteria
   * @param {string} locality - Locality of the complaint
   * @param {string} category - Complaint category
   * @returns {Promise<Array>} List of local complaints
   */
  async fetchLocalComplaints(locality, departmentId) {
  let localComplaints = await this.prisma.complaint.findMany({
      where: {
        // Exact locality match
        locality: locality,

        // Category match (allowing partial match)
        departmentId: departmentId.id,

        // Status filter
        OR: [{ status: "PENDING" }, { status: "IN_PROGRESS" }],
      },
      select: {
        id: true,
        description: true,
        locality: true,
        category: true,
        matchCounter: true,
      },
    });
    console.log("LocalComplaints: ",localComplaints)
    return localComplaints;
  }

  
  cleanText(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }
  /**
   * Update match counters for similar complaints
   * @param {Array} matchedComplaints - Complaints with matches
   * @returns {Promise<Array>} Updated complaints with IDs
   */
  async updateMatchCounters(matchedComplaints) {
    const updatePromises = matchedComplaints.map(async (complaint) => {
      // Determine priority escalation
      const priorityEscalationRules = {
        LOW: [
          { threshold: 5, newPriority: "MEDIUM" },
          { threshold: 10, newPriority: "HIGH" },
          { threshold: 15, newPriority: "URGENT" },
        ],
        MEDIUM: [
          { threshold: 3, newPriority: "HIGH" },
          { threshold: 7, newPriority: "URGENT" },
        ],
        HIGH: [{ threshold: 2, newPriority: "URGENT" }],
        URGENT: [], // No further escalation for URGENT
      };

      // Get current complaint details
      const currentComplaint = await this.prisma.complaint.findUnique({
        where: { id: complaint.id },
        select: {
          matchCounter: true,
          priority: true,
        },
      });

      // Calculate new match counter
      const newMatchCounter = (currentComplaint.matchCounter || 0) + 1;

      // Determine new priority based on escalation rules
      let newPriority = currentComplaint.priority;
      const escalationRules =
        priorityEscalationRules[currentComplaint.priority] || [];

      for (const rule of escalationRules) {
        if (newMatchCounter >= rule.threshold) {
          newPriority = rule.newPriority;
        } else {
          break;
        }
      }

      // Update complaint with new match counter and potentially new priority
      const updatedComplaint = await this.prisma.complaint.update({
        where: { id: complaint.id },
        data: {
          matchCounter: newMatchCounter,
          priority: newPriority,
        },
        select: {
          id: true,
          matchCounter: true,
          priority: true,
          description: true,
        },
      });

      return updatedComplaint;
    });

    return Promise.all(updatePromises);
  }
}

module.exports = ComplaintMatcher;
