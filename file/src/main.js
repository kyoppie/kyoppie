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
app.get("/",function(req,res){
    res.send("kyoppie file server");
});
app.use(express.static(save_dir));

// utils function

function getDayStr(){
    function s(n){
        return ""+(n<10 ? "0"+n : n);
    }
    var day = new Date;
    var daystr = day.getFullYear()+s(day.getMonth()+1)+s(day.getDay())
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
        url = path.replace(save_dir,"")
        if(type === "image"){
            var convert_option = {
                src:file.path,
                dst:path,
            }
            if(ext == "png") convert_option.quality=10;
            if(ext == "jpg") convert_option.quality=80;
            return easyimage.convert(convert_option)
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
                "'"+path+"'"
            ].join(" ")
            var thumbnailCommand = [
                "ffmpeg",
                "-i","'"+file.path+"'",
                "-vframes","1",
                "-f","image2",
                "'"+path+".thumbnail.jpg'"
            ].join(" ")
            if(file.path.indexOf("'") != -1) return Promise.reject("invalid-filename")
            if(path.indexOf("'") != -1) return Promise.reject("invalid-filename")
            console.log(encodeCommand)
            return execPromise(checkCommand).then(function(){
                console.log(file.size,orig_ext)
                var encodeFlag = (
                    (/* orig_ext == "mp4" || */orig_ext == "mov") && // 動画のタイプがあっているかつ
                    file.size <= (10*1000*1000) // ファイルがそれほど大きくない(〜10MB)なら
                ) // エンコードしない
                if(!encodeFlag) return execPromise(encodeCommand)
                fs.createReadStream(file.path).pipe(fs.createWriteStream(path))
            }).then(function(){
                return execPromise(thumbnailCommand).then(function(){
                },function(){
                    fs.unlink(path)
                    return Promise.reject("thumbnail-create-failed")
                })
            },function(){
                fs.unlink(path)
                return Promise.reject("encode-failed")
            })
        } else {
            fs.createReadStream(file.path).pipe(fs.createWriteStream(path))
        }
    }).then(function(){
        var thumbnailUrl = url+".thumbnail.jpg";
        var return_obj = {type,url}
        if(type === "video") return_obj.thumbnail = thumbnailUrl;
        res.send(return_obj)
    }).catch(function(err){
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
    })
})

app.listen(4009,function(){
    console.log("listen for 4009 port");
})