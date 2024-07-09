from flask import Flask 
import model.model as model

app = Flask(__name__)

@app.route("/")
def hello_word():
    model.get_recommendations()
    return "<p>Hi How are you</p>"
