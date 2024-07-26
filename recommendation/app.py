from flask import Flask, json
import model.user_rec as userRec
import model.post_rec as postRec

from model.graph import Graph, User, Post, graphTests

import utils.backend as dUsers

import json

import os
from dotenv import load_dotenv
load_dotenv()

from flask_cors import CORS, cross_origin

app = Flask(__name__)
cors = CORS(app)
app.config['SECRET_KEY'] = 'the quick brown fox jumps over the lazy   dog'
app.config['CORS_HEADERS'] = 'Content-Type'

def getRecommendations(user_id, all_users_data, liked_graph,n_items, post_matrix):
    # get the first data since its always going to be one
    liked_posts = [user["likedPosts"] for user in all_users_data if user["id"] == user_id][0]
    user_recs = []
    liked_recs = []
    if liked_posts:

        user_recs = userRec.getUserRecommendations(user_id, liked_graph)
        weights = [0.2, 0.2, 0.2, 0.3, 0.05, 0.05, 0.05 ]
        liked_recs = postRec.getPostRecommendations(user_recs, liked_posts, weights,n_items,post_matrix)
    
    combined_recs = user_recs + liked_recs
    combined_recs = list(set(combined_recs))

    user_posts = [user["posts"] for user in all_users_data if user["id"] == user_id][0]
    user_posts = [post['id'] for post in user_posts]
    combined_recs = [rec for rec in combined_recs if rec not in user_posts]

    return combined_recs

@app.route("/")
def run_recommendations():

    all_users = dUsers.getUsers()
    all_posts = dUsers.getPosts()
    max_post_id = max([post['id'] for post in all_posts])

    # get adjacency matrix of user likes
    liked_graph = userRec.get_graph(all_users)
    post_matrix, n_items = postRec.getCustomMatrix(all_posts, max_post_id)

    for user in all_users:                
        user_recs = getRecommendations(user["id"], all_users, liked_graph, n_items, post_matrix)
        dUsers.submitRecs(user["id"], user_recs)         

    response = app.response_class(
        response=json.dumps({"response" : "updated successfully"}),
        mimetype='application/json'
    )
        
    return response


"""
    Use for testing
"""
@app.route("/tests")
def run_graph():

    try:
        postRec.postRecTests()
    except:
        print("Error in post recommendations")
    
    try:
        graphTests()
    except:
        print("Error in graph for user recommendations")
    
    response = app.response_class(
        response=json.dumps({"response" : "Successfully tested graph"}),
        mimetype='application/json'
    )

    return response

if __name__=='__main__':
    app.debug = True
    app.run(host='0.0.0.0')
