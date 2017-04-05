kyoppie-talk-room
    kyoppie-load-splash(show="{loading === true}")
    script.
        this.room_id = opts.room_id
        this.loading = true
        var self = this
        $.api.get("talks/rooms/show",{id:this.room_id}).then(function(res){
            // self.loading = false
            self.update()
        })
