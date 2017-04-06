kyoppie-talk-room
    kyoppie-load-splash(show="{loading === true}")
    a(href="https://github.com/kyoppie/kyoppie/issues/23",target="_blank") この画面のデザインのフィードバック受付中！
    .panel
        textarea.input(ref="text",onkeydown="{textarea}")
        button(onclick="{send}")
            span.no_disabled
                i.fa.fa-paper-plane
                |  送信
            span.yes_disabled
                i.fa.fa-spinner.fa-pulse
                |  送信中
    .messages
        kyoppie-talk-message(each="{messages}", message="{this}")
    script.
        this.room_id = opts.room_id
        this.loading = true
        var self = this
        $.api.get("talks/rooms/show",{id:this.room_id}).then(function(res){
            self.room = res.response
            return $.api.get("talks/rooms/timeline",{id:self.room.id})
        }).then(function(res){
            self.messages = res.response
            self.loading = false
            self.update()
        })
        send(e) {
            e.target.disabled = true
            var text = this.refs.text.value
            $.api.post("talks/rooms/say",{id:this.room.id, text:text}).then(function(res){
                self.refs.text.value = ""
                e.target.disabled = false
            }).catch(function(err){
                console.log(err)
                if(err.responseJSON && err.responseJSON.error) alert(err.responseJSON.error)
                e.target.disabled = false
            })
        }
        textarea(e) {
            if((e.metaKey || e.ctrlKey) && e.keyCode === 13) { // (Ctrl|Cmd)+Enter
                $(e.target).parent().find("button").click()
            }
        }
        function newWebSocketConnection(){
            $.showNotify("ストリーミングに接続しています...")
            var ws = $.api.websocket("talks/rooms/timeline",{id:self.room_id});
            ws.onopen = function(){
                $.showNotify("ストリーミングに接続しました！",500)
            }
            ws.onmessage = function(e){
                e = JSON.parse(e.data)
                var message = e.response
                $.addUnreadCount()
                self.messages.unshift(message)
                self.update()
            }
            ws.onclose = function(){
                newWebSocketConnection();
            }
        }
        newWebSocketConnection()
