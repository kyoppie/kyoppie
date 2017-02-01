# coding: utf-8
import flask
import os.path
import mimetypes
import json
import utils
import magic
import PIL.Image
import config
app = flask.Flask(__name__)
app.config["MAX_CONTENT_LENGTH"] = 40*1024*1024 #40M
def api(f):
    def wrap():
        r = f()
        c = r[1]
        r = flask.Response(json.dumps(r[0]))
        r.headers["Content-Type"] = "application/json"
        return r,c
    return wrap
@app.route('/')
def indexPage():
    return "kyoppie file server with python"
@app.route('/<path:filename>')
def fileShow(filename):
    if(filename.count("..")):
        return "Forbidden",403
    path = "../files/"+filename
    if(not os.path.exists(path)):
        return "Not Found",404
    sc = 200
    sb = 0
    all_l = None
    if(flask.request.headers.get("Range")):
        all_l = os.path.getsize(path)
        sb,eb = utils.range_header(all_l,flask.request.headers)
        sb = int(sb)
        eb = int(eb)
        sc = 206
    r = flask.Response(open(path,"rb").read()[sb:])
    r.headers["Content-Type"] = mimetypes.guess_type(filename)[0]
    r.headers["Accept-Ranges"] = "bytes"
    r.headers["Content-Transfer-Encoding"] = "binary"
    if(sc == 206):
        r.headers["Content-Range"] = "bytes "+str(sb)+"-"+str(eb)+"/"+str(all_l)
        r.headers["Content-Length"] = str(eb-sb+1)
    return r,sc
@app.route('/api/v1/upload',methods=["POST"])
@api
def apiV1Upload():
    # filekeyがある？
    filekey = flask.request.headers.get("X-Kyoppie-File-Key")
    if(filekey != config.file["file_key"]):
        return {"result":False,"error":"invalid-filekey"},400
    file = flask.request.files.get("file")
    if(not file):
        return {"result":False,"error":"file-is-required"},400
    # とりあえずセーブ
    filename = "../upload_tmp/"+utils.get_temp_save_filename()
    file.save(filename)
    print(filename)
    # ファイルの種類を判断する
    path = "../files"
    mimetype = magic.Magic(mime=True).from_file(filename)
    print(mimetype)
    img = None
    res_obj = {
        "type":mimetype.split("/")[0]
    }
    if(mimetype == "image/png" or mimetype == "image/bmp"): #可逆圧縮な画像ファイル
        new_filename = utils.get_filename("png")
        img = PIL.Image.open(filename)
        img.save(path+new_filename,"png")
        res_obj["url"] = new_filename
    elif(mimetype == "image/jpeg" or mimetype == "image/jpg"):
        new_filename = utils.get_filename("jpg")
        img = PIL.Image.open(filename)
        img.save(path+new_filename,"jpeg",quality=80)
        res_obj["url"] = new_filename
    elif(mimetype == "image/gif"):
        new_filename = utils.get_filename("png")
        img = PIL.Image.open(filename)
        try:
            img.seek(1)
        except EOFError:
            img.save(path+new_filename,"png")
            res_obj["url"] = new_filename
        else:
            new_filename,img = utils.video_encode(filename)
            res_obj["type"] = "video"
            res_obj["url"] = new_filename
    elif(mimetype == "video/mp4" or mimetype == "video/quicktime"):
        new_filename,img = utils.video_encode(filename)
        res_obj["url"] = new_filename
    else:
        return {"result":False,"error":"invalid-file"},400
    if(img):
        img.thumbnail(utils.get_resize_size(img.size))
        if("".join(img.getbands()) == "RGBA"):
            img.save(path+new_filename+".thumbnail.png","png")
            res_obj["thumbnail"] = new_filename+".thumbnail.png"
        else:
            img.save(path+new_filename+".thumbnail.jpg","jpeg",quality=75)
            res_obj["thumbnail"] = new_filename+".thumbnail.jpg"
    return res_obj,200
    
app.run(host="0.0.0.0",port=config.file["port"],threaded=True,debug=config.file["is_debug"])