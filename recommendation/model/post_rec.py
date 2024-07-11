import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import OneHotEncoder
from sklearn.metrics.pairwise import cosine_similarity


def get_matrix(posts, n):
    n = n+1    
    all_posts = [None]*n

    for post in posts:
        all_posts[post['id']] = post

    all_categories = [""]*n

    all_descriptions = [""]*n
    # insert date due
    all_titles = [""]*n
    all_image_prompts = [""]*n
    all_user_rating = [""]*n
    all_bid_counts = [""]*n
    all_likes = [""]*n



    for idx in range(0, len(all_posts)):
        item = all_posts[idx]
        if not item : continue
        all_categories[item['id']] =  item['category']
        all_descriptions[item['id']] = item['description']
        all_titles[item['id']]  = item['title']
                
        for image in item['images']:
            all_image_prompts[item['id']] += image['prompt']

        all_user_rating[item['id']]  = item['user']['userRating']
        all_bid_counts[item['id']]  = len(item['bids'])
        all_likes[item['id']]  = len(item['likes'])

    # transform categories into proxy values for model
    cat_vect = OneHotEncoder()
    cat_features = cat_vect.fit_transform(np.array(all_categories).reshape(-1,1))

    desc_vect = TfidfVectorizer(stop_words='english')
    desc_features = desc_vect.fit_transform(all_descriptions)

    combined_features = np.hstack((cat_features.toarray(), desc_features.toarray()))

    sim_matrix = cosine_similarity(combined_features)
    
    for row_idx in range(len(sim_matrix)):
        for col_idx in range(len(sim_matrix[row_idx])):
            if sim_matrix[row_idx][col_idx] == 1:
                sim_matrix[row_idx][col_idx] = 0

    return sim_matrix


def getPostRecommendations(user_likes, sim_matrix):

    sim_scores = []        
    
    for like in user_likes:
        # sort by similarity scores
        sorted_sims = sorted(list(enumerate(sim_matrix[like['post']['id']])), key=lambda x: x[1], reverse=True)
        
        # get only the top recommendations with 0.4 threshold         
        scores = [ sim_scores.append(score) for score in sorted_sims if float(score[1]) > 0.4 ]
        sim_scores.append(scores)
    
    recommendations = []
    for recs in sim_scores:
        if not recs: continue        
        recommendations.append(recs[0])
    
    user_likes = [ like['post']['id'] for like in user_likes]

    # ensure recommendations are not in likes already
    recommendations = list(set([i for i in recommendations if i not in user_likes]))
    recommendations = [i for i in recommendations if i is not None]

    return recommendations
