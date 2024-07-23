import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import OneHotEncoder
from sklearn.metrics.pairwise import cosine_similarity

from model.graph import Graph, User, Post

# need a way to store similarity matrix and only update when posts are increased instead of redoing
def get_graph(users):
    graph = Graph()

    # create adjacency matrix where nodes are posts and edges are connected where users any two users like a similar post
    for user in users:
        new_user = User(user['id'])
        graph.addNode(new_user)

        # first node, a users liked post
        for post in user["likedPosts"]:
            
            liked_post = post['post']            
            post_id = liked_post['id']
            
            if graph.getNode(post_id):
                new_post = graph.getNode(post_id)
            else:
                new_post = Post(post_id)

            new_user.addNeighbor(new_post)
            graph.addNode(new_post)


    return graph
    

def getUserRecommendations(user_id, graph):    
    user_node = graph.getNode(user_id)    

    return [int(post.id) for post in graph.getRecommendations(user_node)]
