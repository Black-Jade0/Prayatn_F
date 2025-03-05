import praw
import time
from datetime import datetime, timedelta
import json
import re
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from geopy.geocoders import Nominatim

# Initialize NLTK
nltk.download("punkt_tab")
nltk.download("stopwords")

# Set up Reddit API
reddit = praw.Reddit(
    client_id='uN8v64TL4S4AYztpyEM6TQ',
    client_secret='b8d1mqrPyvuxMgdIWxXUZUUPhoMbWw',
    user_agent='MyRedditBot/1.0 by shravi_J'
)
print(f"Reddit Read-Only Mode: {reddit.read_only}")

# Subreddit and duration setup
subreddit_name = "Indore"  # Replace with the subreddit you want to monitor
subreddit = reddit.subreddit(subreddit_name)
end_time = datetime.now() + timedelta(hours=24)  # 24-hour duration

# Data storage
scraped_data = []
processed_ids = set()  # To track already processed posts
stop_words = set(stopwords.words('english'))

# Initialize Geopy Geolocator
geolocator = Nominatim(user_agent="reddit_location_bot")

# Function to preprocess text
def preprocess_text(text):
    text = re.sub(r'http\S+|www\S+|https\S+', '', text, flags=re.MULTILINE)  # Remove URLs
    text = re.sub(r'\W+', ' ', text)  # Remove non-word characters
    words = word_tokenize(text.lower())
    return ' '.join([word for word in words if word not in stop_words])

# Function to extract location using regex or custom keywords
def extract_location(text):
    # Predefined list of common locations (e.g., cities, states)
    common_locations = ["Indore", "Bhopal", "Delhi", "Mumbai", "Pune", "Chennai", "Bangalore"]

    # Check for predefined locations in text
    for location in common_locations:
        if location.lower() in text.lower():
            # Attempt to geocode the detected location
            try:
                geocoded_location = geolocator.geocode(location)
                if geocoded_location:
                    return {"address": geocoded_location.address}
            except Exception as e:
                print(f"Geocoding error: {e}")
                return {"address": "Indore"}  # Default to "Indore" in case of geocoding error

    # If no predefined location is found, return "Indore"
    return {"address": "Indore"}


# Real-time scraping loop
# print(f"Starting real-time scraping for subreddit: r/{subreddit_name}")
while datetime.now() < end_time:
    try:
        # Fetch new posts
        for post in subreddit.new(limit=10):
            if post.id not in processed_ids:  # Skip already processed posts
                cleaned_text = preprocess_text(post.title + ' ' + post.selftext)
                location_data = extract_location(cleaned_text)

                post_data = {
                    "title": post.title,
                    "id": post.id,
                    "author": str(post.author),
                    "created_utc": post.created_utc,
                    "text": post.selftext,
                    "url": post.url,
                    "cleaned_text": cleaned_text,
                    "location": location_data
                }

                # Add post to the data list
                scraped_data.append(post_data)
                processed_ids.add(post.id)  # Mark post as processed
                print(f"Processed new post: {post.title} , {location_data}")

        # Save data to JSON periodically
        with open("scraped_reddit_data.json", "w") as f:
            json.dump(scraped_data, f, indent=4)

        # Sleep to avoid hitting the API rate limit
        time.sleep(10)

    except Exception as e:
        print(f"Error during scraping: {e}")
        time.sleep(10)  # Wait before retrying in case of an error

print("Real-time scraping completed.")