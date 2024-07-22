import requests
import os

def getUsers():
    url = f"{os.getenv("DATABASE_URL")}/user"

    r = requests.get(url)

    return r.json()


def getPosts():
    url = f"{os.getenv("DATABASE_URL")}/posts"

    r = requests.get(url)

    return r.json()

def submitRecs(user_id, recs):
    url = f"{os.getenv("DATABASE_URL")}/user/recommendations"
    body= {
        "userId" : user_id,
        "recommendations" : recs
    }
    r = requests.post(url, json=body)
    
    return r.json()
