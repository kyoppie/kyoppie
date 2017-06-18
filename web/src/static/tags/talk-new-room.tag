kyoppie-talk-new-room
    .panel
        input.input(ref="name_input",placeholder="ルーム名")
    .panel
        h2 メンバー
        kyoppie-user-search(base_url="javascript://",action_icon="plus",ref="search",selectable=true)
    script.
        var self = this
        this.users = []
        ignore_user_ids(){
            return this.users.map(function(user){return user.id})
        }
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
