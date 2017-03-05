from flask import Blueprint
from utils import render_template
import utils
import api
app = Blueprint(__name__,"dev",url_prefix="/dev")

@app.route('/')
@utils.login_required
def devIndex():
    res = api.get("applications/my",login=True)["response"]
    return render_template("dev/index.jade",apps=res)

@app.route('/app/<id>')
@utils.login_required
def devShow(id):
    res = api.get("applications/show",{"id":id},login=True)["response"]
    return render_template("dev/show.jade",app=res)
