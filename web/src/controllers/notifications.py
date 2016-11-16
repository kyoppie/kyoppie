from flask import Blueprint,render_template,redirect
import api
app = Blueprint(__name__,"notifications",url_prefix="/notifications")

@app.route('/')
def notificationList():
    res = api.get("notifications/list",login=True)["response"]
    return render_template("notifications/index.jade",notifications = res)
@app.route('/<id>/user')
def notificationUser(id):
    res = api.get("notifications/show",{"id":id},login=True)["response"]
    res_ = api.post("notifications/read",{"id":id},login=True)["response"]
    return redirect("/u/"+res["targetUser"]["screenName"])
@app.route('/<id>/post')
def notificationPost(id):
    res = api.get("notifications/show",{"id":id},login=True)["response"]
    res_ = api.post("notifications/read",{"id":id},login=True)["response"]
    return redirect("/p/"+res["targetPost"]["id"])
