from functools import wraps
from flask import request,url_for,session,Response
import api
import urllib.parse
import flask
def redirect(path,next_path=None):
    print(next_path)
    if(next_path):
        if(next_path[-1]=="?"):
            next_path = next_path[:-1]
        next_path = urllib.parse.quote(next_path)
        path += "?next=" + next_path
    res = Response("Redirect...")
    res.headers["Content-Type"] = "text/plain"
    res.headers["Location"] = path
    res.autocorrect_location_header = False
    return res,302
def login_required(f=None,rulesAgree=True):
    def wrap_(f):
        @wraps(f)
        def df(*args,**kwargs):
            if(session.get("access_token")):
                my = api.get("account/show",login=True)
                if(my["result"] == False):
                    return my["error"]
                my = my["response"]
                if(my["isSuspended"]):
                    return redirect("/suspend")
                if(rulesAgree and not my.get("rulesAgree",False)):
                    if(api.get("web/rules_agree_period")["result"]):
                        return redirect("/rules_agree")
                return f(*args,**kwargs)
            else:
                return redirect('/login',request.full_path)
        return df
    if(f):
        wrap_ = wrap_(f)
    return wrap_
def render_template(*wargs,**kwargs):
    return flask.render_template(*wargs,**kwargs)
