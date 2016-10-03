import config
import json
import utils
import api
import controllers._.ajax
import controllers._.tojinja
import controllers.dev
import controllers.user
import controllers.settings
import controllers.admin
from flask import Flask,render_template,redirect,session,request
app = Flask(__name__)
app.template_folder = "views"
app.jinja_env.add_extension("pyjade.ext.jinja.PyJadeExtension")
app.jinja_env.auto_reload=config.web["is_debug"]
app.debug=config.web["is_debug"]
app.config["web_config_json"]=json.dumps(config.public)
app.secret_key=config.web["secret_key"]

app.register_blueprint(controllers._.ajax.app)
app.register_blueprint(controllers._.tojinja.app)

app.register_blueprint(controllers.dev.app)
app.register_blueprint(controllers.user.app)
app.register_blueprint(controllers.settings.app)
app.register_blueprint(controllers.admin.app)
@app.route('/')
@utils.login_required
def indexPage():
    res = api.get("posts/timeline",login=True)["response"]
    return render_template("index.jade",posts=res)
@app.route('/public')
def publicTimeline():
    res = api.get("posts/public_timeline")["response"]
    return render_template("public.jade",posts=res)

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
    return render_template("post.jade",post=res)

if(__name__ == "__main__"):
    app.run(
        port=config.web["port"]
    )
