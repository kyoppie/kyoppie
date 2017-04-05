kyoppie-talk-room
    kyoppie-load-splash(show="{loading === true}")
    textarea(ref="text")
    button(onclick="{send}")
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
            var text = this.refs.text.value
            $.api.post("talks/rooms/say",{id:this.room.id, text:text}).then(function(res){
                alert("sended!")
            })
        }
