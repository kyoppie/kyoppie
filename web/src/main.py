import config
import json
import utils
import api
import os
import controllers._.ajax
import controllers._.tojinja
import controllers.dev
import controllers.user
import controllers.settings
import controllers.admin
import controllers.help
import controllers.notifications
import controllers.talks
from flask import Flask,redirect,session,request,g,Response
from utils import render_template
from datetime import timedelta
app = Flask(__name__)
app.static_url_path=''
app.template_folder = "views"
app.jinja_env.add_extension("pyjade.ext.jinja.PyJadeExtension")
app.jinja_env.auto_reload=config.web["is_debug"]
app.debug=config.web["is_debug"]
app.config["web_config"]=config.public
app.config["web_config_json"]=json.dumps(config.public)
app.secret_key=config.web["secret_key"]
app.permanent_session_lifetime = timedelta(days=365) # 1 year

app.register_blueprint(controllers._.ajax.app)
app.register_blueprint(controllers._.tojinja.app)

app.register_blueprint(controllers.dev.app)
app.register_blueprint(controllers.user.app)
app.register_blueprint(controllers.settings.app)
app.register_blueprint(controllers.admin.app)
app.register_blueprint(controllers.help.app)
app.register_blueprint(controllers.notifications.app)
app.register_blueprint(controllers.talks.app)
@app.before_request
def beforeRequest():
    session.permanent = True
    if(session.get("access_token")):
        my = api.get("account/show",login=True)
        if(my["result"]):
            g.my = my["response"]
@app.route('/static/<git_commit>/<path:path>')
def staticFile(git_commit,path):
    if path == "tags":
        res = ""
        p = os.path.dirname(os.path.abspath(__file__))+'/static/tags'
        for file in os.listdir(p):
            res += open(p+"/"+file,"r").read() + "\n"
        return Response(res, mimetype="text/plain")
    return app.send_static_file(path)
@app.route('/')
@utils.login_required
def indexPage():
    return render_template("index.jade")
@app.route('/public')
def publicTimeline():
    return render_template("public.jade")

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

@app.route('/menu')
def menuPage():
    return render_template("menu.jade")

@app.route('/users')
def usersPage():
    res = api.get("users/list")["response"]
    return render_template("users.jade",users=res)

@app.route('/p/<postId>')
def postShow(postId):
    res = api.get("posts/show",{"id":postId})["response"]
    return render_template("post/index.jade",post=res)

@app.route('/p/<postId>/video_player')
def postVideoPlayer(postId):
    res = api.get("posts/show",{"id":postId})["response"]
    return render_template("post/video_player.jade",post=res)

@app.route('/rules')
def rulesShow():
    return render_template("rules.jade")

@app.route('/suspend')
def suspendPage():
    return render_template("suspend.jade")

@app.route('/logout')
def logout():
    session.clear()
    return utils.redirect("/")
@app.route('/rules_agree')
@utils.login_required(rulesAgree=False)
def rulesAgreePage():
    return render_template("rules_agree.jade")
if(__name__ == "__main__"):
    app.run(
        host="0.0.0.0",
        port=config.web["port"]
    )
