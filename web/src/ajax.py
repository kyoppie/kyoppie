from flask import Blueprint,request,jsonify
import api

app = Blueprint(__name__,"ajax",url_prefix="/_/ajax")

@app.route('/login',methods=["POST"])
def login():
    print(api.login(request.form["screenName"],request.form["password"]))
    return jsonify(status="ok")