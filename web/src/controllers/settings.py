from flask import Blueprint,render_template
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
