| require("./user-search.tag")
| require("./users.tag")
| require("./load-splash.tag")
kyoppie-talk-edit
    kyoppie-load-splash(if="{!loaded}")
    .panel(show="{false && room && !room.isOneToOne}")
        h2 名前変更
        input.input(type="text",ref="name",value="{room.name}")
        button.button(onclick="{name_update}")
            .no_disabled
                | 変更
            .yes_disabled
                | 変更中...
    .panel(show="{room && !room.isOneToOne}")
        h2 ユーザー管理
        kyoppie-user-search(base_url="javascript://",action_icon="plus",ref="search",ignore_user_ids="{ignore_user_ids()}")
        kyoppie-users(base_url="javascript://",ref="users", users="{users}", action_icon="minus")
        button.button(onclick="{user_update}")
            .no_disabled
                | 変更
            .yes_disabled
                | 変更中...
    script.
        this.room_id = opts.room_id
        this.users = []
        this.orig_users = []
        var self = this
        $.api.get("talks/rooms/show",{id:this.room_id}).then(function(res){
            self.loaded = true
            self.room = res.response
            self.users = self.room.users.filter(function(user){
                return user.id != ME.id
            })
            self.orig_users = [].concat(self.users) // copy
            self.update()
        })
        ignore_user_ids(){
            var array = this.users.map(function(user){return user.id})
            return array
        }
        this.name_update = function(e) {
            e.target.disabled = true
            $.api.post("talks/rooms/update_name",{
                id: this.room_id,
                name: this.refs.name.value
            }).then(function(res){
                location.href = "/talks/room/"+self.room_id
            })
        }.bind(this)
        this.user_update = function(e) {
            var new_user = []
            var del_user = []
            this.users.concat(this.orig_users).filter(function(item){
                console.log(self.orig_users, item, self.orig_users.includes(item))
                if(!self.orig_users.includes(item)) new_user.push(item)
                if(!self.users.includes(item)) del_user.push(item)
            })
            var promise = Promise.resolve()
            new_user.forEach(function(user) {
                promise = promise.then(function(){
                    return $.api.post("talks/rooms/members/add",{
                        id: self.room_id,
                        userId: user.id
                    })
                })
            })
            del_user.forEach(function(user) {
                promise = promise.then(function(){
                    return $.api.post("talks/rooms/members/remove",{
                        id: self.room_id,
                        userId: user.id
                    })
                })
            })
            promise.then(function(){
                location.reload()
            })
        }.bind(this)
        this.on("mount",function(){
            this.refs.search.on("clicked",function(user){ // ユーザー追加
                self.users.push(user)
                self.update()
            })
            this.refs.users.on("clicked",function(user){ // ユーザー削除
                self.users = self.users.filter(function(user_){
                    return user_.id != user.id
                })
                self.update()
            })
        })
