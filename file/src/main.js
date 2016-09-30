var express = require("express");
var multer = require("multer");
var upload = multer({dest:__dirname+"/../upload_tmp"})
var fs = require("fs");
var app = express();
var config = require("./config")
var rndstr = require("rndstr");
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
            console.log(arguments)
            if(err){
                if(err.code == "ENOENT") {
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
                if(err.code == "ENOENT") {
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
    console.log(file)
    if(!req.body.type) return res.send({error:"type-is-required"});
    switch(req.body.type){
        case 'image':
            getDir().then(function(dir){
                return getNewPath(dir,req.body.ext);
            }).then(function(path){
                fs.createReadStream(file.path).pipe(fs.createWriteStream(path))
                fs.unlink(file.path)
                res.send({url:path.replace(save_dir,"")})
            });
            break;
        default:
            fs.unlink(file.path)
            res.send({error:"invalid-type"})
            break;
    } 
})

app.listen(4009,function(){
    console.log("listen for 4009 port");
})