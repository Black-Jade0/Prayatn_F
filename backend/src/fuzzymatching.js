const Fuse = require('fuse.js');
const { PrismaClient } = require('@prisma/client');

class ComplaintMatcher {
    constructor() {
        this.prisma = new PrismaClient();
    }

    /**
     * Find similar complaints with strict locality matching
     * @param {Object} processedComplaint - Standardized complaint object
     * @param {string} userLocality - Locality of the complaint
     * @returns {Promise<Array>} Matching complaint IDs
     */
    async findSimilarComplaints(processedComplaint, userLocality) {
        try {
            // Step 1: Fetch complaints in the same locality with specific conditions
            const localComplaints = await this.fetchLocalComplaints(userLocality, processedComplaint.category);

            // Step 2: Perform fuzzy matching on descriptions
            const matchedComplaints = this.performFuzzyMatching(localComplaints, processedComplaint);

            // Step 3: Update match counters
            const updatedComplaints = await this.updateMatchCounters(matchedComplaints);

            return updatedComplaints;
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
    async fetchLocalComplaints(locality, category) {
        return this.prisma.complaint.findMany({
            where: {
                // Exact locality match
                locality: locality,
                
                // Category match (allowing partial match)
                category: {
                    contains: category
                },
                
                // Status filter
                OR: [
                    { status: 'PENDING' },
                    { status: 'IN_PROGRESS' }
                ]
            },
            select: {
                id: true,
                description: true,
                locality: true,
                category: true,
                matchCounter: true
            }
        });
    }

    /**
     * Perform fuzzy matching on complaint descriptions
     * @param {Array} localComplaints - Local complaints to match against
     * @param {Object} processedComplaint - New standardized complaint
     * @returns {Array} Matched complaints
     */
    performFuzzyMatching(localComplaints, processedComplaint) {
        // Combine description and keywords for comprehensive matching
        const searchString = `${processedComplaint.description} ${processedComplaint.keywords}`;

        // Fuse.js configuration for fuzzy matching
        const fuseOptions = {
            includeScore: true,
            threshold: 0.4, // Adjust threshold for desired matching sensitivity
            keys: ['description']
        };

        // Prepare complaints for fuzzy search
        const fuse = new Fuse(localComplaints, fuseOptions);
        
        // Perform fuzzy search
        const matches = fuse.search(searchString);

        // Filter and sort matches
        return matches
            .filter(match => match.score <= 0.4) // Only keep strong matches
            .sort((a, b) => a.score - b.score) // Sort by match strength
            .map(match => ({
                ...match.item,
                matchScore: match.score
            }));
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
                    { threshold: 5, newPriority: 'MEDIUM' },
                    { threshold: 10, newPriority: 'HIGH' },
                    { threshold: 15, newPriority: 'URGENT' }
                ],
                MEDIUM: [
                    { threshold: 3, newPriority: 'HIGH' },
                    { threshold: 7, newPriority: 'URGENT' }
                ],
                HIGH: [
                    { threshold: 2, newPriority: 'URGENT' }
                ],
                URGENT: [] // No further escalation for URGENT
            };

            // Get current complaint details
            const currentComplaint = await this.prisma.complaint.findUnique({
                where: { id: complaint.id },
                select: { 
                    matchCounter: true, 
                    priority: true 
                }
            });

            // Calculate new match counter
            const newMatchCounter = (currentComplaint.matchCounter || 0) + 1;

            // Determine new priority based on escalation rules
            let newPriority = currentComplaint.priority;
            const escalationRules = priorityEscalationRules[currentComplaint.priority] || [];
            
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
                    priority: newPriority
                },
                select: {
                    id: true,
                    matchCounter: true,
                    priority: true,
                    description: true
                }
            });

            return updatedComplaint;
        });

        return Promise.all(updatePromises);
    }

}

module.exports = ComplaintMatcher;