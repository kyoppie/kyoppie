from functools import wraps
from flask import request,url_for,session,Response
import api
import urllib.parse
def redirect(path,next_path=None):
    print(next_path)
    if(next_path):
        next_path = urllib.parse.quote(next_path)
        path += "?next=" + next_path
    res = Response("Redirect...")
    res.headers["Content-Type"] = "text/plain"
    res.headers["Location"] = path
    res.autocorrect_location_header = False
    return res,302
def login_required(f):
    @wraps(f)
    def df(*args,**kwargs):
        if(session.get("access_token")):
            my = api.get("account/show",login=True)
            if(my["result"] == False):
                return my["error"]
            my = my["response"]
            if(my["isSuspended"]):
                return redirect("/suspend")
            return f(*args,**kwargs)
        else:
            return redirect('/login',request.full_path)
    return df
