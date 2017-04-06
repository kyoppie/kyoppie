kyoppie-user-search
    input.input(type="text",name="query",placeholder="ユーザーを検索",onchange="{edit}",onkeyup="{edit}",autocomplete="off")
    kyoppie-users(base_url="{base_url}",users="{users}")
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
        this.users = []
        this.text = ""
        var now_request = 0
        this.base_url=opts.base_url || "/u/"

        edit(e) {
            if(this.text == e.target.value) return
            this.text = e.target.value
            var search_text = e.target.value
            if(this.text == "") return
            var my_request = ++now_request
            _this = this
            $.api.get("users/search",{text:this.text}).then(function(res){
                if(my_request != now_request) return console.log("cancel search:"+search_text)
                _this.users = res.response
                _this.update()
            })
        }

        this.edit({target:{value:""}})
