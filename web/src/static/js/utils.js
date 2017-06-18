$.extend({
    api:{
        get_access_token:function(){
            return $("meta[name=access_token]").attr("content");
        },
        request:function(method,endpoint,params){
            return $.ajax({
                url:CONFIG.api+"/"+endpoint,
                type:method,
                data:params,
                headers:{
                    "X-Kyoppie-Access-Token":$.api.get_access_token()
                }
            })
        },
        get:function(endpoint,params){
            return $.api.request("GET",endpoint,params);
        },
        post:function(endpoint,params){
            return $.api.request("POST",endpoint,params);
        },
        websocket:function(endpoint,params){
            if(!params) params = {}
            params.access_token = $.api.get_access_token()
            params = Object.keys(params).map(function(name){
                return name+"="+encodeURIComponent(params[name])
            }).join("&")
            var ws = new WebSocket(CONFIG.api.replace("http","ws")+"/"+endpoint+"?"+params);
            var wsTimer = setInterval(function(){
                ws.send(JSON.stringify({type:"ping"}))
            },20*1000);
            ws.addEventListener("close",function(){
                clearInterval(wsTimer);
            })
            return ws
        },
        upload:function(file, progress_callback){
            if(!window.FormData) {
                alert("もうちょっと新しいブラウザを使ってください。。。");
                return;
            }
            if(!progress_callback) progress_callback=function(){}
            // ファイルがどのタイプかを判別
            if(file instanceof FormData) {
                return $.ajax({
                    url:CONFIG.api+"/files/upload",
                    type:"POST",
                    data:file,
                    processData:false,
                    contentType:false,
                    xhr:function(){
                        var xhr = $.ajaxSettings.xhr()
                        console.log(xhr)
                        xhr.upload.onprogress=function(e){
                            console.log(e)
                            progress_callback(e)
                            console.log(e)
                        }
                        return xhr
                    },
                    headers:{
                        "X-Kyoppie-Access-Token":$.api.get_access_token()
                    }
                })
            } else if(file instanceof HTMLFormElement){ // [name="file"]が付いたform
                // ファイルのinputがなかったら帰る
                if(!file.file) return;
                var fd = new FormData(file);
                return $.api.upload(fd, progress_callback);
            } else if(file instanceof Blob){ // blob
                var fd = new FormData();
                fd.append("file",file);
                return $.api.upload(fd, progress_callback);
            } else {
                console.error("invalid file");
            }
        }
    },
    showNotify:function(str,millisec){
        $("#notify").text(str);
        $("#notify").addClass("active");
        if(millisec) setTimeout($.hideNotify, millisec)
    },
    hideNotify:function(){
        $("#notify").removeClass("active");
    },
    getUrlVars: function(){ // by http://jquery-howto.blogspot.jp/2009/09/get-url-parameters-values-with-jquery.html
        var vars = [], hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for(var i = 0; i < hashes.length; i++){
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
    },
    getUrlVar: function(name){
        return $.getUrlVars()[name];
    }
});
// nunjucks config
nunjucks.configure({ autoescape: false });

String.prototype.replaceAll = function(target, dest) {
    return this.split(target).join(dest)
}
