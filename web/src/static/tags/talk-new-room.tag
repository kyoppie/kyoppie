| require("./user-search.tag")
| require("./users.tag")
kyoppie-talk-new-room
    h1 ルーム作成
    .panel
        input.input(ref="name_input",placeholder="ルーム名",required)
    .panel
        h2 メンバー
        kyoppie-user-search(base_url="javascript://",action_icon="plus",ref="search",ignore_user_ids="{ignore_user_ids()}")
        kyoppie-users(ref="users", users="{users}", action_icon="minus")
    button(onclick="{create}")
        i.fa.fa-plus
        |  ルームを作成
    script.
        var self = this
        this.users = []
        ignore_user_ids(){
            var array = this.users.map(function(user){return user.id})
            array.push(ME.id)
            return array
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
        create() {
            if(this.refs.name_input.value.length < 1) return alert("ルーム名を入力してください。")
            if(this.refs.name_input.value.length > 20) return alert("ルーム名は20文字までです。")
            $.api.post("talks/rooms/create", {
                name: this.refs.name_input.value,
            }).then(function(res){
                var room = res.response
                console.log(room)
                var promise = Promise.resolve()
                self.users.forEach(function(user){
                    promise = promise.then(function(){
                        return $.api.post("talks/rooms/members/add",{
                            id: room.id,
                            userId: user.id
                        })
                    })
                })
                promise.then(function(){
                    location.href="/talks/room/"+room.id
                })
            })
        }
