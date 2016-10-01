from flask import Blueprint,request,jsonify,session
import api

app = Blueprint(__name__,"ajax",url_prefix="/_/ajax")

@app.route('/login',methods=["POST"])
def login():
    res = api.login(request.form["screenName"],request.form["password"])
    if(res["result"] == False):
        return jsonify(status="ng",message=res["error"])
    session["access_token"] = res["response"]["token"]
    return jsonify(status="ok")

@app.route('/register',methods=["POST"])
def register():
    res = api.register(request.form["screenName"],request.form["password"])
    if(res["result"] == False):
        return jsonify(status="ng",message=res["error"])
    session["access_token"] = res["response"]["token"]
    return jsonify(status="ok")
