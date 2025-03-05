from flask import Flask, request, jsonify
from sentence_transformers import SentenceTransformer, util

app = Flask(__name__)

# Load pre-trained model globally to avoid reloading
model = SentenceTransformer('all-MiniLM-L6-v2')

@app.route('/similarity', methods=['POST'])
def check_similarity():
    data = request.json
    text1 = data.get('text1', '')
    text2 = data.get('text2', '')
    threshold = data.get('threshold', 0.5)

    # Generate embeddings
    embedding1 = model.encode(text1, convert_to_tensor=True)
    embedding2 = model.encode(text2, convert_to_tensor=True)

    # Compute cosine similarity
    similarity = util.cos_sim(embedding1, embedding2).item()
    print("result for complaints: ",similarity >= threshold)
    # Return similarity score and boolean match
    return jsonify({
        'similarity': similarity,
        'isMatch': similarity >= threshold
    })

if __name__ == '__main__':
    print("Started the server at port 5000")
    app.run(port=5000)