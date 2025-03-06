import json
import re

class CivicComplaintClassifier:
    def __init__(self):
        # Infrastructure and service problem keywords
        self.infrastructure_keywords = [
            "road", "street", "pothole", "traffic", "light", "power", "outage",
            "water", "pipe", "leak", "internet", "connection", "speed", "slow",
            "sewage", "drain", "flooding", "sidewalk", "bridge", "construction",
            "noise", "trash", "garbage", "waste", "dump", "collect", "pick up",
            "public transport", "bus", "train", "subway", "transit", "delay", "late", 
            "police", "fire", "emergency", "service", "response", "time"
        ]
        
        # Urban/community problem keywords
        self.community_keywords = [
            "neighborhood", "community", "public", "park", "playground",
            "housing", "property", "building", "apartment", "tenant",
            "homeless", "camp", "encampment", "shelter", "safety", "security",
            "crime", "theft", "vandalism", "graffiti", "loitering", "drugs",
            "school", "education", "library", "facility", "center", "space"
        ]
        
        # Government and authority-related keywords
        self.government_keywords = [
            "city", "county", "town", "municipal", "local", "government", "authority",
            "mayor", "council", "department", "official", "agency", "administration",
            "tax", "budget", "funding", "project", "plan", "development", "permit",
            "regulation", "code", "law", "rule", "policy", "ordinance", "violation"
        ]
        
        # General complaint indicator words
        self.complaint_indicators = [
            "problem", "issue", "complaint", "concern", "bad", "poor", "terrible",
            "horrible", "awful", "unacceptable", "ridiculous", "disappointing",
            "disappointed", "frustrated", "annoyed", "angry", "upset", "furious",
            "outraged", "neglected", "ignored", "forgotten", "abandoned",
            "broken", "damaged", "cracked", "faulty", "defective", "not working",
            "failed", "failing", "deteriorated", "deteriorating", "dangerous",
            "hazardous", "unsafe", "risk", "accident", "incident"
        ]
        
        # Action/resolution request indicators
        self.action_indicators = [
            "fix", "repair", "solve", "address", "improve", "upgrade", "update",
            "replace", "install", "remove", "clean", "maintain", "manage",
            "action", "attention", "response", "help", "assistance", "change",
            "need to", "should", "must", "have to", "required", "necessary",
            "responsible", "accountable", "demand", "request", "petition", 
            "when will", "how long", "why hasn't", "who is", "contact",
            "report", "complaint", "311"
        ]
        
        # Definite non-complaint indicators
        self.non_complaint_indicators = [
            "looking for", "seeking", "where can I find", "how do I get to",
            "recommendation", "recommend", "suggest", "advice on", "opinion on", 
            "for sale", "selling", "buy", "purchase", "cost", "price", "deal",
            "job", "hiring", "employment", "position", "opening", "vacancy",
            "event", "meetup", "gathering", "happening", "festival", "party",
            "thank you", "thanks", "appreciate", "grateful", "excited", "happy"
        ]
        
        # Questionable phrases (may not be complaints)
        self.questionable_phrases = [
            "does anyone know", "anyone know", "is there a", "are there any",
            "what is the best", "what's the best", "what are good", "any recommendations",
            "what do you", "how do you", "where do you", "when do you",
            "thoughts on", "opinion on", "experience with", "reviews of"
        ]

    def classify_text(self, title, text):
        """
        Analyze text to determine if it's a civic complaint
        """
        # Combine title and text, convert to lowercase
        combined_text = f"{title} {text}".lower()
        
        # If the post is too short, it's unlikely to be a detailed complaint
        if len(combined_text.split()) < 5:
            return False, 0
        
        # Check for definite non-complaint indicators first
        for phrase in self.non_complaint_indicators:
            if phrase in combined_text:
                return False, -5
        
        # Initialize score
        score = 0
        
        # Look for question patterns without complaint indicators
        has_question_mark = '?' in combined_text
        has_question_phrase = any(phrase in combined_text for phrase in self.questionable_phrases)
        
        if (has_question_mark or has_question_phrase) and not any(word in combined_text for word in ["problem", "issue", "broken", "fix"]):
            score -= 3
        
        # Check for infrastructure keywords
        for keyword in self.infrastructure_keywords:
            if re.search(r'\b' + re.escape(keyword) + r'\b', combined_text):
                score += 1
        
        # Check for community keywords
        for keyword in self.community_keywords:
            if re.search(r'\b' + re.escape(keyword) + r'\b', combined_text):
                score += 1
        
        # Check for government keywords
        for keyword in self.government_keywords:
            if re.search(r'\b' + re.escape(keyword) + r'\b', combined_text):
                score += 1
        
        # Check for complaint indicators (higher weight)
        for indicator in self.complaint_indicators:
            if re.search(r'\b' + re.escape(indicator) + r'\b', combined_text):
                score += 2
        
        # Check for action/resolution keywords (higher weight)
        for indicator in self.action_indicators:
            if re.search(r'\b' + re.escape(indicator) + r'\b', combined_text):
                score += 2
        
        # Strong negative indicators in civic context
        strong_complaints = ["broken", "not working", "failed", "unsafe", "dangerous", 
                            "problem", "terrible", "horrible", "awful", "unacceptable"]
        
        # If there's a strong negative indicator AND an infrastructure/government keyword, 
        # that's a very strong signal for a complaint
        if any(word in combined_text for word in strong_complaints) and (
            any(word in combined_text for word in self.infrastructure_keywords) or
            any(word in combined_text for word in self.government_keywords)):
            score += 3
        
        # Check if the post is addressing authorities or requesting action
        authorities = ["city", "mayor", "council", "department", "authority", "county", "government"]
        action_requests = ["fix", "repair", "solve", "please", "need to", "should", "must"]
        
        if any(word in combined_text for word in authorities) and any(word in combined_text for word in action_requests):
            score += 3
        
        # Very lenient threshold - we want to catch potential complaints
        is_complaint = score >= 2
        
        return is_complaint, score

    def filter_complaints(self, data):
        """
        Filter posts to return only those that are civic complaints
        """
        if not data:
            print("Warning: Empty data received")
            return []
        
        complaints = []
        rejected = []
        
        for post in data:
            title = post.get('title', '')
            text = post.get('cleaned_text', '')
            
            is_complaint, score = self.classify_text(title, text)
            
            if is_complaint:
                # Add score to post for debugging but don't modify original
                post_copy = post.copy()
                post_copy['_complaint_score'] = score
                complaints.append(post_copy)
            else:
                rejected.append({'title': title, 'score': score})
        
        # Debug output
        print(f"Found {len(complaints)} complaints out of {len(data)} posts")
        print(f"Top 5 rejected posts by score:")
        rejected.sort(key=lambda x: x['score'], reverse=True)
        for i, post in enumerate(rejected[:5]):
            print(f"{i+1}. '{post['title']}' (Score: {post['score']})")
        
        # Remove the debug score before returning
        for post in complaints:
            if '_complaint_score' in post:
                del post['_complaint_score']
                
        return complaints

def process_json_data(json_data):
    """Process JSON data to filter for complaints"""
    try:
        # Parse JSON if it's a string
        if isinstance(json_data, str):
            data = json.loads(json_data)
        else:
            data = json_data
            
        classifier = CivicComplaintClassifier()
        complaints = classifier.filter_complaints(data)
        
        return complaints
        
    except Exception as e:
        print(f"Error processing data: {e}")
        return []

if __name__ == "__main__":
    import sys
    
    try:
        # Get input data
        if len(sys.argv) > 1:
            # From file
            print(f"Reading from file: {sys.argv[1]}")
            with open(sys.argv[1], 'r') as f:
                data = json.load(f)
        else:
            # From stdin
            print("Reading from stdin...")
            stdin_data = sys.stdin.read()
            if not stdin_data:
                print("Error: No input data provided")
                sys.exit(1)
            data = json.loads(stdin_data)
        
        # Process and output results
        print("Processing data...")
        result = process_json_data(data)
        
        # Output just the JSON without debug info
        print(json.dumps(result))
        
    except Exception as e:
        print(f"Fatal error: {e}")
        sys.exit(1)