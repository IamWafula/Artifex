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

    r = requests.get(url)

    return r.json()

    return
