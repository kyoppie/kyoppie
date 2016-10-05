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
app.post("/api/v1/upload",upload.single('file'),function(req,res){
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
        if(!info){
            return Promise.reject("invalid-file");
        }
        ext = info.ext;
        orig_ext = ext;
        type = info.mime.split("/")[0];
        if(
            type !== "image" && 
            type !== "movie"
        ) return Promise.reject("invalid-file")
        if(type === "image"){
            return easyimage.info(file.path).then(function(info){
                if(!info) return Promise.reject("invalid-image-info")
                console.log(info)
                ext = "png";
                if(info.type === "jpeg") ext="jpg";
            })
        }
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
        } else {
            fs.createReadStream(file.path).pipe(fs.createWriteStream(path))
        }
    }).then(function(){
        fs.unlink(file.path)
        res.send({url})
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
    })
})

app.listen(4009,function(){
    console.log("listen for 4009 port");
})