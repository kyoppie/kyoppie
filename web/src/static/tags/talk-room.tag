| require("./load-splash.tag")
| require("./talk-message.tag")
kyoppie-talk-room
    kyoppie-load-splash(show="{loading === true}")
    virtual(if="{room}")
        h1(if="{room}") {room.name}
        virtual(if="{!room.isOneToOne}")
            a(href="/talks/room/{room.id}/edit",if="{!room.isOneToOne}")
                i.fa.fa-edit
                |  編集
            br
            br
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
            virtual(each="{message, i in messages}")
                kyoppie-talk-message(message="{message}")
                .date(if="{i != messages.length-1 && dateNum(message._date) != dateNum(messages[i+1]._date)}")
                    hr
                    span {messages[i+1]._date.getMonth()+1}月 {messages[i+1]._date.getDay()}日
    style.
        .date {
            text-align:center;
        }
        .date span {
            background: rgba(0,0,0,0.6);
            color:white;
            font-size:0.75em;
            padding: 0.5em;
            border-radius: 0.5em;
        }
        .date hr {
            border:1px solid rgba(0,0,0,0.8);
        }
    script.
        this.room_id = opts.room_id
        this.loading = true
        var self = this
        $.api.get("talks/rooms/show",{id:this.room_id}).then(function(res){
            self.room = res.response
            return $.api.get("talks/rooms/timeline",{id:self.room.id})
        }).then(function(res){
            self.messages = res.response.map(function(message) {
                message._date = new Date(message.createdAt)
                return message
            })
            self.loading = false
            self.update()
        })
        this.send = function(e) {
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
        }.bind(this)
        this.textarea = function(e) {
            if((e.metaKey || e.ctrlKey) && e.keyCode === 13) { // (Ctrl|Cmd)+Enter
                $(e.target).parent().find("button").click()
            }
        }.bind(this)
        this.dateNum = function(date) {
            return (date.getFullYear()*12*31) + (date.getMonth() * 31) + (date.getDay()-1)
        }.bind(this)
        function newWebSocketConnection(){
            $.showNotify("ストリーミングに接続しています...")
            var ws = $.api.websocket("talks/rooms/timeline",{id:self.room_id});
            ws.onopen = function(){
                $.showNotify("ストリーミングに接続しました！",500)
            }
            ws.onmessage = function(e){
                e = JSON.parse(e.data)
                var message = e.response
                message._date = new Date(message.createdAt)
                $.addUnreadCount()
                self.messages.unshift(message)
                self.update()
            }
            ws.onclose = function(){
                newWebSocketConnection();
            }
        }
        newWebSocketConnection()
