kyoppie-user-search
    input.input(type="text",name="query",placeholder="ユーザーを検索",onchange="{edit}",onkeyup="{edit}",autocomplete="off")
    kyoppie-users(base_url="{base_url}",users="{users}",action_icon="{action_icon}",ref="users",ignore_user_ids="{opts.ignore_user_ids}")
    .notfound-message(show="{users.length == 0 && text.length}") ユーザーが見つかりませんでした！別の名前などで検索してみてください。
    style.
        kyoppie-user-search{
            display:block;
        }
        .empty-message,.notfound-message {
            padding: 0.5em 0;
            color:#666666;
            color:rgba(0,0,0,0.6)
        }
    script.
        import "./users.tag"
        this.users = []
        this.text = ""
        var now_request = 0
        this.base_url=opts.base_url || "/u/"
        this.action_icon = opts.action_icon
        this.on("mount",function(){
            var self = this
            this.refs.users.on("clicked",function(user){
                self.trigger("clicked",user)
            })
        })

        this.edit = function(e) {
            if(this.text == e.target.value) return
            this.text = e.target.value
            var search_text = e.target.value
            if(this.text == "") return
            var my_request = ++now_request
            var _this = this
            this.trigger("search",this.text)
            $.api.get("users/search",{text:this.text}).then(function(res){
                if(my_request != now_request) return console.log("cancel search:"+search_text)
                _this.users = res.response
                _this.update()
            })
        }.bind(this)

        this.edit({target:{value:""}})
