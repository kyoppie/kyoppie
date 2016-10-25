from flask import Blueprint,render_template
import utils
import api
app = Blueprint(__name__,"help",url_prefix="/help")

pages = [
    {"name":"アカウントの凍結","file":"suspend"}
]

for page in pages:
    @app.route('/'+page["file"])
    def showPage():
        return render_template("help/"+page["file"]+".jade",title=page["name"])
@app.route('/')
def showList():
    return render_template("help/index.jade",pages=pages)
