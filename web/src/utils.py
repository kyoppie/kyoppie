from functools import wraps
from flask import request,url_for,redirect,session
def login_required(f):
    @wraps(f)
    def df(*args,**kwargs):
        if(session.get("access_token")):
            return f(*args,**kwargs)
        else:
            return redirect(url_for('loginPage',next=request.url))
    return df