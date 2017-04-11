kyoppie-talk-edit
    kyoppie-load-splash(if="{!loaded}")
    .panel(if="{room && !room.isOneToOne}")
        h3 名前変更
        input.input(type="text",ref="name")
        button.button(onclick="{name_update}")
            .no_disabled
                | 変更
            .yes_disabled
                | 変更中...
    script.
        this.room_id = opts.room_id
        var self = this
        $.api.get("talks/rooms/show",{id:this.room_id}).then(function(res){
            self.loaded = true
            self.room = res.respoonse
            self.update()
        })
