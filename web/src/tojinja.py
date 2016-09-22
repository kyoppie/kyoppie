from flask import Blueprint,request,jsonify,session,Response
import pyjade.utils
import pyjade.ext.jinja
app = Blueprint(__name__,"tojinja",url_prefix="/_/tojinja")

def tojinja(name):
    path = "./views/common/"+name+".jade"
    html = pyjade.utils.process(
        open(path,"r").read(),
        compiler=pyjade.ext.jinja.Compiler,
        staticAttrs=True
    )
    html=str(html)
    html=html.replace("\\","\\\\")
    html=html.replace("\r","\\r")
    html=html.replace("\n","\\n")
    html=html.replace("\"","\\\"")
    print(html)
    html = "function template_"+name+"(locals){var template=\""+html+"\";return nunjucks.renderString(template,locals)}"
    return Response(html,mimetype="text/javascript")
@app.route('/post')
def pf():
    return tojinja("post")
