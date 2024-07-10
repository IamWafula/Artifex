import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import OneHotEncoder
from sklearn.metrics.pairwise import cosine_similarity


def get_matrix(all_posts):
    all_categories = ["oil on canvas", "digital art", "3d model", "photography", "pixel art"]
    categories = [item['category'] for item in all_posts]
    descriptions = [item['description'] for item in all_posts]

    # transform categories into proxy values for model
    cat_vect = OneHotEncoder()
    cat_features = cat_vect.fit_transform(np.array(categories).reshape(-1,1))

    desc_vect = TfidfVectorizer(stop_words='english')
    desc_features = desc_vect.fit_transform(descriptions)

    combined_features = np.hstack((cat_features.toarray(), desc_features.toarray()))

    similarity_matrix = cosine_similarity(combined_features)

    return similarity_matrix


def getPostRecommendations(user_likes, all_posts):
    print(all_posts)
    sim_scores = list(enumerate(get_matrix(all_posts)[0]))
    sim_scores = []
    sim_matrix = get_matrix(all_posts)

    for post_id in user_likes:
        # sort by similarity scores
        sorted_sims = sorted(list(enumerate(sim_matrix[post_id])), key=lambda x: x[1], reverse=True)

        # get only the top 3 recommendations
        sim_scores.append(sorted_sims[0:3])

    recommendations = []

    for recs in sim_scores:
        recommendations += [ rec[0] for rec in recs ]
    
    # ensure recommendations are not in likes already
    recommendations = list(set([i for i in recommendations if i not in user_likes]))

    return recommendations
