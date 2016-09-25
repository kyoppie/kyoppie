import config
import json
import ajax
import tojinja
import utils
import api
from flask import Flask,render_template,redirect,session,request
app = Flask(__name__)
app.template_folder = "views"
app.jinja_env.add_extension("pyjade.ext.jinja.PyJadeExtension")
app.jinja_env.auto_reload=config.web["is_debug"]
app.debug=config.web["is_debug"]
app.config["web_config_json"]=json.dumps(config.public)
app.secret_key=config.web["secret_key"]

app.register_blueprint(ajax.app)
app.register_blueprint(tojinja.app)

@app.route('/')
@utils.login_required
def indexPage():
    return render_template("index.jade")

@app.route('/login')
def loginPage():
    if(session.get("access_token")):
        return redirect(request.args.get("next","/"))
    return render_template("login.jade")

@app.route('/register')
def registerPage():
    if(session.get("access_token")):
        return redirect(request.args.get("next","/"))
    return render_template("register.jade")

@app.route('/dev/')
@utils.login_required
def devIndex():
    res = api.get("applications/my",token=session["access_token"])["response"]
    return render_template("dev/index.jade",apps=res)

@app.route('/dev/app/<id>')
@utils.login_required
def devShow(id):
    res = api.get("applications/show",{"id":id},token=session["access_token"])["response"]
    return render_template("dev/show.jade",app=res)

@app.route('/u/<screenName>')
def userShow(screenName):
    res = api.get("users/show",{"screenName":screenName},token=session["access_token"])["response"]
    return render_template("user-profile/index.jade",user=res)
@app.route('/settings/password')
@utils.login_required
def settingsPassword():
    return render_template("settings/password.jade")
@app.route('/menu')
@utils.login_required
def menuPage():
    return render_template("menu.jade")
@app.route('/users')
def usersPage():
    res = api.get("users/list")["response"]
    return render_template("users.jade",users=res)

if(__name__ == "__main__"):
    app.run(
        port=config.web["port"]
    )
