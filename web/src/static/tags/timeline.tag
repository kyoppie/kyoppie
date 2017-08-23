kyoppie-timeline
    span(if="{!loaded}") Loading...
    virtual(each="{post in filterposts()}")
        kyoppie-post(post="{post}")
    script.
        import './post.tag'
        var self = this
        this.loaded = false
        this.posts = []
        this.filterposts = function (){
            return this.posts.map(function(post){
                if(post.repostTo){
                    var original = post
                    post = post.repostTo
                    post.original = original
                }
                return post
            })
        }.bind(this)
        this.on("mount",function(){
            var query = self.opts.query || {}
            query.limit = 20
            $.api.get(self.opts.endpoint, query).then(function(posts){
                console.log(posts)
                self.posts = posts.response
                self.loaded = true
                self.update()
            })
            if(self.opts.streaming) {
                function newWebSocketConnection(){
                    $.showNotify("ストリーミングに接続しています...");
                    var ws = $.api.websocket(self.opts.endpoint);
                    ws.onopen = function(){
                        $.showNotify("ストリーミングに接続しました！",500)
                    }
                    ws.onmessage = function(e){
                        e = JSON.parse(e.data);
                        var post = e.response;
                        $.addUnreadCount()
                        self.posts.unshift(post)
                        self.update()
                    }
                    ws.onclose = function(){
                        newWebSocketConnection();
                    }
                }
                newWebSocketConnection();
            }
        })
