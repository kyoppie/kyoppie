var express = require("express");
var multer = require("multer");
var upload = multer({dest:__dirname+"/../upload_tmp"})
var fs = require("fs");
var app = express();
var config = require("./config")
var rndstr = require("rndstr");
var fileType = require("file-type");
var readChunk = require("read-chunk");
var easyimage = require("easyimage")
var exec = require("child_process").exec
var save_dir = __dirname+"/../files";
app.disable('x-powered-by');
app.get("/",function(req,res){
    res.send("kyoppie file server");
});
app.get("/:day/:file",function(req,res){
    var path = req.params.day+"/"+req.params.file
    console.log(req.ip,req.ips,path)
    res.sendFile(path,{
        root:save_dir
    },function(err){
        try{
            if(err){
                console.log(err)
                res.status(403).send("403 Forbidden");
            }
        }catch(e){
            res.end();
        }
    })
})

// utils function

function getDayStr(){
    function s(n){
        return ""+(n<10 ? "0"+n : n);
    }
    var day = new Date;
    var daystr = day.getFullYear()+s(day.getMonth()+1)+s(day.getDate())
    return daystr;
}
function getDir(){
    return new Promise(function(resolve,reject){
        var daypath = save_dir + "/" + getDayStr();
        fs.stat(daypath,function(err,_){
            if(err){
                if(err.code === "ENOENT") {
                    fs.mkdir(daypath,function(err){
                        if(err) reject(err)
                        resolve(daypath)
                    })
                } else {
                    reject(err)
                }
            }
            resolve(daypath)
        })
    })
}
function getNewPath(dir,ext){
    return new Promise(function(resolve,reject){
        var s = dir+"/"+rndstr({
            length:16,
            chars:'A-Za-z'
        })+"."+ext
        fs.stat(s,function(err,_){
            if(err){
                if(err.code === "ENOENT") {
                    resolve(s)
                } else {
                    reject(err)
                }
            }
            getNewPath(dir,ext).then(resolve,reject);
        })
    })
}
function execPromise(command){
    return new Promise(function(resolve,reject){
        exec(command,function(err,stdout,stderr){
            if(err) reject(err);
            resolve([stdout,stderr])
        })
    })
}
function copyPromise(src,dist){
    return new Promise(function(resolve,reject){
        var r = fs.createReadStream(src);
        var w = fs.createWriteStream(dist);
        r.on("error",(e) => reject(e));
        w.on("error",(e) => reject(e));
        w.on("close",() => resolve());
        r.pipe(w);
    })
}
app.post("/api/v1/upload",upload.single('file'),function(req,res){
    if(req.headers["x-kyoppie-file-key"] !== config.file_key){
        res.status(403).send({error:"invalid-file-key"})
        return;
    }
    var file = req.file;
    var info = {};
    var orig_ext = "";
    var ext = ""
    var url = ""
    var type = ""
    var _path
    var thumbnailUrl
    if(file.size > (15*1024*1024)){
        res.status(400).send({error:"too-big-file"})
        return;
    }
    console.log(file)
    // MIMEタイプを推定
    readChunk(file.path,0,256).then(function(chunk){
        info = fileType(chunk)
        console.log(info)
        if(!info){
            return Promise.reject("invalid-file");
        }
        ext = info.ext;
        orig_ext = ext;
        type = info.mime.split("/")[0];
        if(
            type !== "image" && 
            type !== "video"
        ) return Promise.reject("invalid-file")
        if(type === "image"){
            return easyimage.info(file.path).then(function(info){
                if(!info) return Promise.reject("invalid-image-info")
                console.log(info)
                ext = "png";
                if(info.type === "jpeg") ext="jpg";
                if(info.name.split(" ").length >= 2 && info.type == "gif"){ //アニメーションGIF
                    type="video";
                    ext="mp4";
                }
            })
        } else if (type === "video") {
            ext = "mp4";
        }
        if(req.body.image_only && type !== "image") return Promise.reject("invalid-image")
    }).then(function(){
        return getDir()
    }).then(function(dir){
        return getNewPath(dir,ext);
    }).then(function(path){
        _path=path
        url = path.replace(save_dir,"")
        if(type === "image"){
            var convert_command = [
                "convert",
                file.path,
                "-strip",
                "-quality 80",
                path
            ].join(" ");
            return execPromise(convert_command).then(function(){
                // TODO: 変換後のファイルサイズを見る
                if(file.size >= (500*1000)){ // ファイルがでかい(500KB以上)
                    var thumbnail_command = [
                        "convert",
                        file.path,
                        "-thumbnail 640x640",
                        "-quality 60",
                        path+".thumbnail.jpg"
                    ].join(" ");
                    thumbnailUrl=url+".thumbnail.jpg";
                    return execPromise(thumbnail_command);
                }
                thumbnailUrl=url;
            })
        } else if(type === "video") {
            var checkCommand = [
                "ffprobe",
                "'"+file.path+"'"
            ].join(" ")
            var encodeCommand = [
                "ffmpeg",
                "-t","120",
                "-i","'"+file.path+"'",
                "-vcodec","libx264",
                "-movflags","+faststart",
                "-pix_fmt","yuv420p",
                "-b:v","400k",
                "-b:a","128k",
                "-ar","44100",
                "-r","30",
                "-vf","scale=640:-1",
                "'"+path+"'"
            ].join(" ")
            var thumbnailCommand = [
                "ffmpeg",
                "-i","'"+file.path+"'",
                "-vframes","1",
                "-f","image2",
                "'"+path+".thumbnail.jpg'"
            ].join(" ")
            thumbnailUrl = url+".thumbnail.jpg"
            if(file.path.indexOf("'") != -1) return Promise.reject("invalid-filename")
            if(path.indexOf("'") != -1) return Promise.reject("invalid-filename")
            console.log(encodeCommand)
            return execPromise(checkCommand).then(function(){
                console.log(file.size,orig_ext)
                var encodeFlag = (
                    (orig_ext == "mp4" || orig_ext == "mov") // 動画のタイプがあっているなら
                ) // エンコードしない
                if(!encodeFlag) return Promise.reject("invalid-file-type") // 再エンコードはやめました
                return copyPromise(file.path,path)
            }).then(function(){
                return execPromise(thumbnailCommand).then(function(){
                },function(){
                    return Promise.reject("thumbnail-create-failed")
                })
            },function(e){
                if(typeof e === "string") return Promise.reject(e)
                fs.unlink(path,function(){});
                return Promise.reject("encode-failed")
            })
        } else {
            fs.createReadStream(file.path).pipe(fs.createWriteStream(path))
        }
    }).then(function(){
        var return_obj = {type,url}
        if(type === "video" || type === "image") return_obj.thumbnail = thumbnailUrl;
        res.send(return_obj)
    }).catch(function(err){
        if(_path) fs.unlink(_path)
        if(typeof err === "string")
            if(err.indexOf("invalid") !== -1)
                res.status(400).send({result:false,error:err})
            else
                res.status(500).send({result:false,error:err})
        else{
            res.status(500).send({result:false,error:"server-side-error"})
            console.log(err)
        }
    }).then(function(){
        fs.unlink(file.path)
    }).catch(function(err){
        console.log(err)
    })
})

app.listen(config.port,function(){
    console.log("listen for 4009 port");
})