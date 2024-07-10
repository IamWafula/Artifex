import requests
import os

def getUsers():
    url = f"{os.getenv("DATABASE_URL")}/user"

    r = requests.get(url)

    return r.json()
