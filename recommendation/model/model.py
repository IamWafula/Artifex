import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import OneHotEncoder
from sklearn.metrics.pairwise import cosine_similarity

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

# need a way to store similarity matrix and only update when posts are increased instead of redoing
def get_matrix():
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


def get_recommendations():
    sim_scores = list(enumerate(get_matrix()[0]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    for idx in [i for i in sim_scores]:
        print(all_posts[idx[0]], idx )
