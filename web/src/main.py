import config
import json
import ajax
import utils
from flask import Flask,render_template,redirect,session,request
app = Flask(__name__)
app.template_folder = "views"
app.jinja_env.add_extension("pyjade.ext.jinja.PyJadeExtension")
app.jinja_env.auto_reload=config.web["is_debug"]
app.debug=config.web["is_debug"]
app.config["web_config_json"]=json.dumps(config.public)
app.secret_key=config.web["secret_key"]

app.register_blueprint(ajax.app)

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

if(__name__ == "__main__"):
    app.run(
        port=config.web["port"]
    )
