from flask import Blueprint,render_template
import utils
import api
app = Blueprint(__name__,"admin",url_prefix="/admin")

## 管理画面
@app.route('/')
@utils.login_required
def adminIndex():
    res = api.get("account/show",login=True)
    return render_template("admin/index.jade",user=res)
