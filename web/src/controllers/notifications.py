from flask import Blueprint,render_template,redirect
import api
import utils
app = Blueprint(__name__,"notifications",url_prefix="/notifications")

@app.route('/')
@utils.login_required
def notificationList():
    res = api.get("notifications/list",login=True)["response"]
    return render_template("notifications/index.jade",notifications = res)

@app.route('/<id>/user')
@utils.login_required
def notificationUser(id):
    res = api.get("notifications/show",{"id":id},login=True)["response"]
    res_ = api.post("notifications/read",{"id":id},login=True)["response"]
    return redirect("/u/"+res["targetUser"]["screenName"])

@app.route('/<id>/post')
@utils.login_required
def notificationPost(id):
    res = api.get("notifications/show",{"id":id},login=True)["response"]
    res_ = api.post("notifications/read",{"id":id},login=True)["response"]
    return redirect("/p/"+res["targetPost"]["id"])
