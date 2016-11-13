from flask import Blueprint,render_template
import utils
import api
app = Blueprint(__name__,"admin",url_prefix="/admin")

## 管理画面
@app.route('/')
@utils.login_required
def adminIndex():
    res = api.get("account/show",login=True)["response"]
    return render_template("admin/index.jade",user=res)

@app.route('/file_servers')
@utils.login_required
def fileserverIndex():
    res = api.get("admin/file_servers/list",login=True)["response"]
    return render_template("admin/file_servers/index.jade",servers = res)

@app.route('/file_servers/<id>')
@utils.login_required
def fileserverShow(id):
    res = api.get("admin/file_servers/show",{"id":id},login=True)["response"]
    return render_template("admin/file_servers/show.jade",server = res)

@app.route('/users')
def userIndex():
    res = api.get("admin/users/list",login=True)["response"]
    return render_template("admin/users/index.jade",users = res)

@app.route('/users/<id>')
@utils.login_required
def userShow(id):
    res = api.get("admin/users/show",{"id":id},login=True)["response"]
    return render_template("admin/users/show.jade",user = res)
