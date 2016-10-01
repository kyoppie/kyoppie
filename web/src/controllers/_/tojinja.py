from flask import Blueprint,request,jsonify,session,Response
import pyjade.utils
import pyjade.ext.jinja
import config
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
    if(config.web["is_debug"]):
        print(html)
    html = "function template_"+name+"(locals){var template=\""+html+"\";return nunjucks.renderString(template,locals)}"
    return Response(html,mimetype="text/javascript")
templates = [
    "post",
]
for template_name in templates:
    @app.route('/'+template_name)
    def pf():
        return tojinja(template_name)
