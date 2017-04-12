kyoppie-talk-new-room
    .panel
        input.input(ref="name_input",placeholder="ルーム名")
    .panel
        h2 メンバー
        kyoppie-user-search(base_url="javascript://",action_icon="plus",ref="search",ignore_user_ids="{ignore_user_ids()}")
    script.
        var self = this
        this.users = []
        ignore_user_ids(){
            return this.users.map(function(user){return user.id})
        }
        this.on("mount",function(){
            this.refs.search.on("clicked",function(user){
                self.users.push(user)
                self.update()
            })
        })
