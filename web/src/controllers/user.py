from flask import Blueprint
from utils import render_template
import api
app = Blueprint(__name__,"user",url_prefix="/u")

@app.route('/<screenName>')
def userShow(screenName):
    res = api.get("users/show",{"screenName":screenName})["response"]
    res2 = api.get("users/timeline",{"screenName":screenName})["response"]
    return render_template("user-profile/index.jade",user=res,posts=res2)
@app.route('/<screenName>/following')
def userFollowingShow(screenName):
    res = api.get("users/show",{"screenName":screenName})["response"]
    res2 = api.get("users/following",{"screenName":screenName})["response"]
    return render_template("user-profile/following.jade",user=res,users=res2)
@app.route('/<screenName>/followers')
def userFollowersShow(screenName):
    res = api.get("users/show",{"screenName":screenName})["response"]
    res2 = api.get("users/followers",{"screenName":screenName})["response"]
    return render_template("user-profile/followers.jade",user=res,users=res2)
