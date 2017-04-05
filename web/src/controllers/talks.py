from flask import Blueprint,redirect
import api
import utils
from utils import render_template
app = Blueprint(__name__,"talks",url_prefix="/talks")

@app.route('/')
@utils.login_required
def talkTop():
    return render_template("talks/index.jade")

@app.route('/user/<username>')
@utils.login_required
def talkUserRedirect(username):
    room=api.get("talks/rooms/from_user",{"screenName":username})["response"]
    return redirect("/talks/room/"+room["id"])

@app.route('/room/<id>')
@utils.login_required
def talkRoomShow(id):
    return render_template("talks/room.jade",room_id=id)
