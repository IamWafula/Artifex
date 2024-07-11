from flask import Flask, json
import model.user_rec as userRec
import model.post_rec as postRec

import utils.backend as dUsers

import json

import os
from dotenv import load_dotenv
load_dotenv()

from flask_cors import CORS, cross_origin


app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

def getRecommendations(user_id, all_users_data, liked_matrix, post_matrix):
    # get the first data since its always going to be one
    liked_posts = [user["likedPosts"] for user in all_users_data if user["id"] == user_id][0]
    user_recs = []
    liked_recs = []
    if liked_posts:
        user_recs = userRec.getUserRecommendations(liked_posts, liked_matrix)
        liked_recs = postRec.getPostRecommendations(liked_posts, post_matrix)
    
    combined_recs = user_recs + liked_recs
    combined_recs = list(set(combined_recs))

    return combined_recs

@app.route("/")
def hello_world():

    all_users = dUsers.getUsers()
    all_posts = dUsers.getPosts()

    max_post_id = max([post['id'] for post in all_posts])

    # get adjacency matrix of user likes
    liked_matrix = userRec.get_matrix(all_users, max_post_id)
    post_matrix = postRec.get_matrix(all_posts, max_post_id)

    for user in all_users:        
        user_recs = getRecommendations(user["id"], all_users, liked_matrix, post_matrix)
        dUsers.submitRecs(user["id"], user_recs)

    
        

    response = app.response_class(
        response=json.dumps(all_posts),
        mimetype='application/json'
    )
    return response
