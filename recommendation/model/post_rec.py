import math
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import OneHotEncoder
from sklearn.metrics.pairwise import cosine_similarity
from scipy.sparse import csr_matrix, hstack

def get_matrix(posts, n):
    n = n+1    
    all_posts = [None]*n

    for post in posts:
        all_posts[post['id']] = post

    all_categories = [""]*n

    all_descriptions = [""]*n
    # TODO: insert date due
    all_titles = [""]*n
    all_image_prompts = [""]*n
    all_user_rating = [0]*n
    all_bid_counts = [0]*n
    all_likes = [0]*n



    for idx in range(0, len(all_posts)):
        item = all_posts[idx]
        if not item : continue
        all_categories[item['id']] =  item['category']
        all_descriptions[item['id']] = item['description']
        all_titles[item['id']]  = item['title']
                
        for image in item['images']:
            all_image_prompts[item['id']] += image['prompt']

        all_user_rating[item['id']]  = float(item['user']['userRating'])
        all_bid_counts[item['id']]  = len(item['bids'])
        all_likes[item['id']]  = len(item['likes'])

    # transform categories into proxy values for model
    cat_vect = OneHotEncoder()
    cat_features = cat_vect.fit_transform(np.array(all_categories).reshape(-1,1))

    desc_vect = TfidfVectorizer(stop_words='english')
    desc_features = desc_vect.fit_transform(all_descriptions)

    title_vect = TfidfVectorizer(stop_words='english')
    title_features = title_vect.fit_transform(all_titles)

    prompts_vect = TfidfVectorizer(stop_words='english')
    prompts_features = prompts_vect.fit_transform(all_image_prompts)

    # sparse matrix to save memory since we're using text
    normalized_ratings = np.array(all_user_rating)/5
    ratings_sparse = csr_matrix(normalized_ratings.reshape(-1, 1))

    bids_sparse = csr_matrix(np.array(all_user_rating).reshape(-1,1))
    
    likes_sparse = csr_matrix(np.array(all_likes).reshape(-1,1))

    combined_features = hstack(
        (cat_features, 
        desc_features,
        title_features,
        prompts_features,
        ratings_sparse,
        bids_sparse,
        likes_sparse
        ))

    print(cat_features)

    sim_matrix = cosine_similarity(combined_features)
    
    for row_idx in range(len(sim_matrix)):
        for col_idx in range(len(sim_matrix[row_idx])):
            if sim_matrix[row_idx][col_idx] == 1:
                sim_matrix[row_idx][col_idx] = 0

    return sim_matrix


def generateNGram(text, n=2):
    words = text.split()
    # get words from length 0 to n
    return [tuple(words[i:i+n]) for i in range(len(words)-n+1)]

def getTextSimilarity(all_items, n=2):
    all_scores = []

    for i in all_items:
        similarity_scores = []
        for j in all_items:
            n_grams1 = set(generateNGram(i, n))
            n_grams2 = set(generateNGram(j, n))

            
            intersection = n_grams1.intersection(n_grams2)
            union = n_grams1.union(n_grams2)

            # Normalize the similarity by dividing intersections by unions
            sim_score = len(intersection) / len(union) if union else 0

            similarity_scores.append(sim_score)
        
        all_scores.append(similarity_scores)

    return all_scores

def calculateNumSimilarityNorm(n1, n2, max_value):
    num1 = int(n1) + 1  
    num2 = int(n2) + 1
                                             
    normalized_score = 1 - (abs(num1 - num2)/ max_value)

    return normalized_score

def calculateNumSimilarity(n1, n2):
    log_num1 = math.log(int(n1) + 1)
    log_num2 = math.log(int(n2) + 1)
    
    # exp inherently ensures a value between 0 and 1
    # smaller values (1 and 2) will have less significance than large ones (4 and 6) --> more data points, certainity
    normalized_score = math.exp(-abs(log_num2 - log_num1))

    return normalized_score

def getNumericalSimilarity(all_items, max_value):
    all_scores = []
    
    # when there is a max value, easier to calculate similariry
    # normalized difference
    if max_value:
        for i in all_items:
            similarity_scores = []
            for j in all_items:  
                
                similarity_scores.append(calculateNumSimilarityNorm(i, j, max_value))

            all_scores.append(similarity_scores)

        return all_scores

    for i in all_items:
        similarity_scores = []
        for j in all_items:
            similarity_scores.append(calculateNumSimilarity(i, j))

        all_scores.append(similarity_scores)

    return all_scores

def getCustomMatrix(posts, n):
    n = n+1    
    all_posts = [None for _ in range(n)]

    for post in posts:
        all_posts[post['id']] = post

    all_categories = [""]*n
    all_descriptions = [""]*n
    # TODO: insert date due
    all_titles = [""]*n
    all_image_prompts = [""]*n
    all_user_rating = [0]*n
    all_bid_counts = [0]*n
    all_likes = [0]*n


    for idx in range(0, len(all_posts)):
        item = all_posts[idx]
        if not item : continue
        all_categories[item['id']] =  item['category']
        all_descriptions[item['id']] = item['description']
        all_titles[item['id']]  = item['title']
                
        for image in item['images']:
            all_image_prompts[item['id']] += image['prompt']

        all_user_rating[item['id']]  = float(item['user']['userRating'])
        all_bid_counts[item['id']]  = len(item['bids'])
        all_likes[item['id']]  = len(item['likes'])

    # using n-grams for text features
    cat_features = getTextSimilarity(all_categories, 1)
    desc_features = getTextSimilarity(all_descriptions, 3)        
    title_features = getTextSimilarity(all_titles, 1)
    prompts_features = getTextSimilarity(all_image_prompts, 1)  

    # using logs for numerical values
    rating_features = getNumericalSimilarity(all_user_rating, 5)
    bids_features = getNumericalSimilarity(all_bid_counts, False)
    likes_features = getNumericalSimilarity(all_likes, False)

    n_items = len(cat_features[0])
    
    # previous blocker where pointers were to the same object and matrix was duplicated 
    sim_matrix = [[None for _ in range(n_items)] for _ in range(n_items)]

    
    # for each post
    for row_idx in range(n_items):

        # for each of the other posts, get calculated feature
        for col_idx in range(n_items): 
        

            w_cat = cat_features[row_idx][col_idx]
            w_desc = desc_features[row_idx][col_idx]
            w_title = title_features[row_idx][col_idx]    
            w_prompt = prompts_features[row_idx][col_idx]

            w_rating = rating_features[row_idx][col_idx]
            w_bids = bids_features[row_idx][col_idx]
            w_likes = likes_features[row_idx][col_idx]

            total_sim = (w_cat, w_desc, w_title , w_prompt, w_rating, w_bids, w_likes)

            if all_posts[col_idx] is not None:                
                sim_matrix[row_idx][col_idx] = total_sim
            else:
                sim_matrix[row_idx][col_idx] = []
        
        if row_idx == 6:                
            weights = [0.2, 0.2, 0.2, 0.3, 0.05, 0.05, 0.05 ]

            for col_idx in range(n_items):
                total_sim = 0
                if not sim_matrix[row_idx][col_idx]: continue                    

                for i in range(len(weights)):
                    total_sim += (sim_matrix[row_idx][col_idx][i] * weights[i])                    
                    
    return sim_matrix, n_items


def getPostRecommendations(user_recs, user_likes, weights, n, post_matrix):    
    sim_scores = []

    sim_matrix = [[0 for _ in range(n)] for _ in range(n)]

    # for each post
    for row_idx in range(n):

        # for each of the other posts, get calculated feature
        for col_idx in range(n): 
            if not post_matrix[row_idx][col_idx]: 
                sim_matrix[row_idx][col_idx] = 0
                continue

            total_sim = 0        
            for i in range(len(weights)):                
                total_sim += (post_matrix[row_idx][col_idx][i] * weights[i])
            
            sim_matrix[row_idx][col_idx] = total_sim if total_sim <= 1 else 1

    liked_ids = [like['post']['id'] for like in user_likes]
    liked_recs = set()

    threshold = 0.3
    for like in user_likes:
        # sort by similarity scores
        sorted_sims = sorted(list(enumerate(sim_matrix[like['post']['id']])), key=lambda x: x[1],reverse=True)

        # get only the top recommendations with threshold         
        scores = [ idx for idx,score in sorted_sims if (float(score) > threshold and idx not in liked_ids) ]
        # remove None values and empty arrays
        scores = [score for score in scores if score]
        
        [ liked_recs.add(id_rec) for id_rec in scores if id_rec  ]
    
    
    similar_user_recs = set()    

    for rec in user_recs:
        sorted_sims = sorted(list(enumerate(sim_matrix[rec])), key=lambda x: x[1], reverse=True)
        # get only the top recommendations with threshold         
        scores = [ idx for idx,score in sorted_sims if (float(score) > threshold and idx not in liked_ids) ]

        # remove None and empty arrays
        scores = [score for score in scores if score]
        
        [ similar_user_recs.add(id_rec) for id_rec in scores if id_rec]


    recommendations = list(liked_recs) + list(similar_user_recs)
    
    return recommendations

def postRecTests():
    """
        Text Similarity Tests
    """
    text1 = "A big bad apple"
    text2 = "The dog jumps hard"
    text3 = "an apple bad big"

    # testing text similarities
    text_marix = getTextSimilarity([text1, text2, text3], 1)
    assert text_marix[0][0] == text_marix[1][1] == text_marix[2][2] == 1.0
    assert text_marix[0][2] >  text_marix[0][1]
    
    phrase_1 = "I like piggy backs rather than riding on horse back because it is less frightening"
    phrase_2 = "The quick brown fox jumps over the lazy horse"
    phrase_3 = "I understand that you like piggy backs but for me riding on a horse is more frightening"
    
    phrase_marix = getTextSimilarity([phrase_1, phrase_2, phrase_3], 2)
    assert phrase_marix[0][0] == phrase_marix[1][1] == phrase_marix[2][2] == 1.0
    assert phrase_marix[0][2] >  phrase_marix[0][1]
    
    # update the number n to 3 for 3 word counts per phrase
    phrase_marix = getTextSimilarity([phrase_1, phrase_2, phrase_3], 3)
    assert phrase_marix[0][0] == phrase_marix[1][1] == phrase_marix[2][2] == 1.0
    assert phrase_marix[0][2] >  phrase_marix[0][1]
    
    
    """
        Numerical Similarity Tests
    """
    num_1 = 1
    num_2 = 2    
    num_5 = 5
    
    num_1k = 1000
    num_10k = 10_000
    num_100k = 100_000
    
    num_similarity1_2 = calculateNumSimilarity(num_1, num_2)
    num_similarity1_5 = calculateNumSimilarity(num_1, num_5)
    
    num_similarity_1k_10k = calculateNumSimilarity(num_1k, num_10k)
    num_similarity_1k_100k = calculateNumSimilarity(num_1k, num_100k)
    
    assert num_similarity1_2 > num_similarity1_5
    assert num_similarity_1k_10k > num_similarity_1k_100k
    # smaller differences are weighted more than larger ones, although numerically smaller
    assert num_similarity1_2 > num_similarity_1k_10k     
    
