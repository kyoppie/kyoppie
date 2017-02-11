from flask import Blueprint,render_template,redirect
import api
import utils
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
