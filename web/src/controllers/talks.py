from flask import Blueprint,redirect
import api
import utils
from utils import render_template
app = Blueprint(__name__,"talks",url_prefix="/talks")

@app.route('/')
@utils.login_required
def talkTop():
    rooms=api.get("talks/rooms/list")["response"]
    return render_template("talks/index.jade",rooms=rooms)

@app.route('/new_room')
@utils.login_required
def talkNewRoom():
    return render_template("talks/new_room.jade")

@app.route('/user/<username>')
@utils.login_required
def talkUserRedirect(username):
    room=api.get("talks/rooms/from_user",{"screenName":username})["response"]
    return redirect("/talks/room/"+room["id"])

@app.route('/room/<id>')
@utils.login_required
def talkRoomShow(id):
    return render_template("talks/room.jade",room_id=id)
@app.route('/room/<id>/edit')
@utils.login_required
def talkRoomEdit(id):
    return render_template("talks/room_edit.jade",room_id=id)
