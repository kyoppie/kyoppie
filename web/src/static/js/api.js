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
            return new WebSocket(CONFIG.api.replace("http","ws")+"/"+endpoint+"?access_token="+$.api.get_access_token());
         }
    }
})
