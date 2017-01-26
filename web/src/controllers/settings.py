from flask import Blueprint
from utils import render_template
import utils
import api
app = Blueprint(__name__,"settings",url_prefix="/settings")

@app.route('/name')
@utils.login_required
def settingsName():
    res = api.get("account/show",login=True)["response"]
    return render_template("settings/name.jade",user=res)
@app.route('/password')
@utils.login_required
def settingsPassword():
    return render_template("settings/password.jade")
@app.route('/avatar')
@utils.login_required
def settingsAvatar():
    return render_template("settings/avatar.jade")
