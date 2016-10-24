from functools import wraps
from flask import request,url_for,redirect,session
import api
def login_required(f):
    @wraps(f)
    def df(*args,**kwargs):
        if(session.get("access_token")):
            my = api.get("account/show",login=True)
            if(my["result"] == False):
                return my["error"]
            my = my["response"]
            if(my["isSuspended"]):
                return redirect(url_for('suspendPage'))
            return f(*args,**kwargs)
        else:
            return redirect(url_for('loginPage',next=request.url))
    return df
