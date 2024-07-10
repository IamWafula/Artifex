from flask import Flask, json
import model.user_rec as userRec
import model.post_rec as postRec

import utils.backend as dUsers

import json

import os
from dotenv import load_dotenv
load_dotenv()

from flask_cors import CORS, cross_origin


all_posts = [
    {
        "category": "oil on canvas",
        "description": "I need a painting with neon lights, very cyberpunk and with a character in the main frame facing the camera and holding an umbrella",
    },
    {
        "category": "digital art",
        "description": "Looking for a vibrant digital illustration of a futuristic cityscape at dusk, with flying cars and towering skyscrapers.",
    },
    {
        "category": "3d model",
        "description": "Need a detailed 3D model of a fantasy dragon, with textures and animations for flying and breathing fire.",
    },
    {
        "category": "photography",
        "description": "Requesting a high-resolution photograph of a serene mountain landscape during the golden hour, with emphasis on the light play.",
    },
    {
        "category": "pixel art",
        "description": "Desire a pixel art scene of an 80s arcade room, complete with retro game machines and neon lights.",
    },
    {
        "category": "oil on canvas",
        "description": "Seeking an impressionist-style painting of a bustling market scene, with vibrant colors and visible brush strokes.",
    },
    {
        "category": "digital art",
        "description": "Want a digital portrait of a celebrity in a minimalist style, using only three colors.",
    },
    {
        "category": "3d model",
        "description": "Require a 3D architectural model of a modern villa with interiors and landscaping included.",
    },
    {
        "category": "photography",
        "description": "Looking for a macro photography shot of exotic insects in a natural setting, with a focus on sharp details.",
    },
    {
        "category": "pixel art",
        "description": "Need a series of pixel art characters for a video game, including heroes and villains with animations.",
    }
]


users = [
    {
        "username": "ArtLover01",
        "liked_posts": [0, 1, 4]  # Indices of the liked posts
    },
    {
        "username": "CreativeMind",
        "liked_posts": [1, 2, 3]  # Indices of the liked posts
    },
    {
        "username": "DesignGuru",
        "liked_posts": [0, 7, 8]  # Indices of the liked posts
    },
    {
        "username": "PixelMaster",
        "liked_posts": [4, 9, 6]  # Indices of the liked posts
    },
    {
        "username": "VisionaryArtist",
        "liked_posts": [5, 6, 1]  # Indices of the liked posts
    }
]

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

def getRecommendations(user_id, all_users_data, matrix):
    # get the first data since its always going to be one
    liked_posts = [user["likedPosts"] for user in all_users_data if user["id"] == user_id][0]
    user_recs = []
    liked_recs = []
    if liked_posts:
        user_recs = userRec.getUserRecommendations(liked_posts, matrix)
        liked_recs = postRec.getPostRecommendations(liked_posts, matrix)
    
    
    

    
    

@app.route("/")
def hello_world():

    all_users = dUsers.getUsers()

    liked_matrix = userRec.get_matrix(all_users)

    for user in all_users:        
        getRecommendations(user["id"], all_users, liked_matrix)

    # all_user_liked = [user for user in users if user["username"]=="CreativeMind"][0]["liked_posts"]
    # user_based = userRec.getUserRecommendations("CreativeMind", users)
    # post_based = postRec.getPostRecommendations(all_user_liked, all_posts)

    # combined_recs = user_based + post_based
    # combined_recs = list(set(combined_recs))

    # recommended_posts = [ all_posts[i] for i in combined_recs ]

    response = app.response_class(
        response=json.dumps(liked_matrix),
        mimetype='application/json'
    )
    return response
