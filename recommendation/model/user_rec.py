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
        for post in user["liked_posts"]:
            for i in user["liked_posts"]:
                adj_matrix[post][i] = 1 if post != i else None

    return adj_matrix
    

def getUserRecommendations(user_id, all_users):
    adj_matrix = get_matrix(all_users)
    all_user_liked = [user for user in all_users if user["username"]==user_id][0]["liked_posts"]

    recommended_ids = []

    # look through adjacency matrix for similar IDs
    for post in all_user_liked:
        for idx, val in enumerate(adj_matrix[post]):
            recommended_ids.append(idx) if val != None else None

    recommended_ids = list(set([ i for i in recommended_ids if i not in all_user_liked]))

    return recommended_ids
