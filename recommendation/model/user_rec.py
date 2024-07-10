import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import OneHotEncoder
from sklearn.metrics.pairwise import cosine_similarity

# need a way to store similarity matrix and only update when posts are increased instead of redoing
def get_matrix(users):
    n = 9
    adj_matrix = [[ None for i in range(n+1)] for j in range(n+1)]

    # create adjacency matrix where nodes are posts and edges are connected where users any two users like a similar post
    for user in users:

        # first node, a users liked post
        for post in user["likedPosts"]:
            liked_post = post['post']
            post_id = liked_post['id']

            # connect to all other nodes, where user has liked both it and other nodes
            for liked_post in user["likedPosts"]:
                post_linkend = liked_post['post']
                linked_idx = post_linkend['id']

                adj_matrix[post_id][linked_idx] = 1 if post_id != linked_idx else None

    return adj_matrix
    

def getUserRecommendations(liked_posts, adj_matrix):
    recommended_ids = []
    liked_post_ids = []
    # look through adjacency matrix for similar IDs
    for liked in liked_posts:
        liked_id = liked['post']
        post_id = liked_id['id']

        liked_post_ids.append(post_id)
        for idx, val in enumerate(adj_matrix[post_id]):
            recommended_ids.append(idx) if val != None else None

    recommended_ids = list(set([ i for i in recommended_ids if i not in liked_post_ids]))

    return recommended_ids
