import config
import json
from flask import Flask,render_template
app = Flask(__name__)
app.template_folder = "views"
app.jinja_env.add_extension("pyjade.ext.jinja.PyJadeExtension")
app.jinja_env.auto_reload=config.web["is_debug"]
app.debug=config.web["is_debug"]
app.config["web_config_json"]=json.dumps(config.public)

@app.route('/')
def index():
    return render_template("index.jade")

if(__name__ == "__main__"):
    app.run(
        port=config.web["port"]
    )