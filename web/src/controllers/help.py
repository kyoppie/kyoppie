from flask import Blueprint,render_template,abort
import utils
import api
app = Blueprint(__name__,"help",url_prefix="/help")

pages = [
    {"name":"アカウントの凍結","file":"suspend"},
    {"name":"Internet Explorerについて","file":"internet-explorer"},
    {"name":"JavaScriptを有効にしてください","file":"noscript"}
]

index = {}
for page in pages:
    index[page["file"]] = page
@app.route('/')
def showList():
    return render_template("help/index.jade",pages=pages)
@app.route('/<pagename>')
def showPage(pagename):
    if(index.get(pagename) is None):
        return abort(404)
    page = index[pagename]
    return render_template("help/"+page["file"]+".jade",title=page["name"])
