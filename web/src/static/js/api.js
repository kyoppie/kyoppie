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
        websocket:function(endpoint){
            var ws = new WebSocket(CONFIG.api.replace("http","ws")+"/"+endpoint+"?access_token="+$.api.get_access_token());
            var wsTimer = setInterval(function(){
                ws.send(JSON.stringify({type:"ping"}))
            },20*1000);
            ws.addEventListener("close",function(){
                clearInterval(wsTimer);
            })
            return ws
        },
        upload:function(file){
            // ファイルがどのタイプかを判別
            if(file instanceof HTMLFormElement){ // [name="file"]が付いたform
                if(!window.FormData) {
                    alert("もうちょっと新しいブラウザを使ってください。。。");
                    return;
                }
                // ファイルのinputがなかったら帰る
                if(!file.file) return;
                var fd = new FormData(file);
                return $.ajax({
                    url:CONFIG.api+"/files/upload",
                    type:"POST",
                    data:fd,
                    processData:false,
                    contentType:false,
                    headers:{
                        "X-Kyoppie-Access-Token":$.api.get_access_token()
                    }
                })
            } else if(file instanceof Blob){ // blob
                alert("todo");
            } else {
                console.error("invalid file");
            }
        }
    }
})
