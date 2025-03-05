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
        // Enhanced search string creation
        const searchString = this.createComprehensiveSearchString(processedComplaint);

        // More sophisticated Fuse.js configuration
        const fuseOptions = {
            includeScore: true,
            shouldSort: true,
            findAllMatches: true,
            threshold: 0.4,
            location: 0,
            distance: 100,
            minMatchCharLength: 3,
            keys: [
                { name: 'description', weight: 0.7 },
                { name: 'category', weight: 0.3 }
            ]
        };

        // Create Fuse instance
        const fuse = new Fuse(localComplaints, fuseOptions);
        
        // Perform fuzzy search
        const matches = fuse.search(searchString);

        // Enhanced filtering and scoring
        return matches
            .filter(match => {
                // More rigorous match criteria
                const isStrongMatch = match.score <= 0.4;
                const hasSignificantOverlap = this.calculateMatchOverlap(
                    processedComplaint.description, 
                    match.item.description
                );
                
                return isStrongMatch && hasSignificantOverlap;
            })
            .sort((a, b) => a.score - b.score)
            .map(match => ({
                ...match.item,
                matchScore: match.score
            }));
    }

    /**
     * Create a comprehensive search string
     * @param {Object} processedComplaint - Processed complaint object
     * @returns {string} Comprehensive search string
     */
    createComprehensiveSearchString(processedComplaint) {
        // Combine multiple fields for more comprehensive matching
        const searchParts = [
            processedComplaint.description || '',
            processedComplaint.keywords || '',
            processedComplaint.category || ''
        ];

        return searchParts
            .filter(part => part.trim() !== '')
            .join(' ');
    }

    /**
     * Calculate text overlap percentage
     * @param {string} originalText - Original complaint description
     * @param {string} matchedText - Matched complaint description
     * @returns {number} Overlap percentage
     */
    calculateMatchOverlap(originalText, matchedText) {
        // Tokenize and clean texts
        const originalTokens = this.tokenize(originalText);
        const matchedTokens = this.tokenize(matchedText);

        // Calculate unique tokens
        const uniqueOriginalTokens = new Set(originalTokens);
        const uniqueMatchedTokens = new Set(matchedTokens);

        // Calculate overlapping tokens
        const overlappingTokens = originalTokens.filter(token => 
            uniqueMatchedTokens.has(token)
        );

        // Calculate overlap percentage
        const overlapPercentage = 
            (overlappingTokens.length / uniqueOriginalTokens.size) * 100;

        return overlapPercentage >= 40; // At least 40% token overlap
    }

    /**
     * Tokenize text into meaningful tokens
     * @param {string} text - Input text
     * @returns {string[]} Tokens
     */
    tokenize(text) {
        return text
            .toLowerCase()
            .replace(/[^\w\s]/g, '') // Remove punctuation
            .split(/\s+/) // Split on whitespace
            .filter(token => token.length > 2) // Remove short tokens
            .filter((token, index, self) => 
                self.indexOf(token) === index // Remove duplicates
            );
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