from functools import wraps
from flask import request,url_for,session,Response,g
import api
import urllib.parse
import flask
import os
SRC_DIR=os.path.dirname(os.path.realpath(__file__))
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
            if g.get("my"):
                my = g.my
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
    if g.get("my"):
        kwargs["my"]=g.my
    else:
        kwargs["my"]=None
    kwargs["git_commit"]=open(SRC_DIR+"/../.git/FETCH_HEAD","r").read(10)
    return flask.render_template(*wargs,**kwargs)
