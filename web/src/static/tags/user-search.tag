kyoppie-user-search
    input.input(type="text",name="query",placeholder="ユーザーを検索",onchange="{edit}",onkeyup="{edit}")
    kyoppie-suggest(show="{users.length}")
        ul(show="{text.length}")
            li(each="{ users }")
                img(src="{ avatarUrl }")
                span { name }
                span.screenName { "@"+screenName }
    .empty-message(show="{text.length == 0}") 上のテキストボックスにユーザー名を入力して、検索しましょう！
    .notfound-message(show="{users.length == 0 && text.length}") ユーザーが見つかりませんでした！別の名前などで検索してみてください。
    style.
        kyoppie-user-search{
            display:block;
        }
        kyoppie-suggest ul {
            margin: -1em;
            padding: 0.5em;
            list-style-type:none;
        }
        kyoppie-suggest li{
            height:2em;
            padding:0.5em 1em;
        }
        kyoppie-suggest li:hover{
            background: #f52;
            color:white
        }
        kyoppie-suggest li:hover .screenName{
            color:#888;
            color:rgba(255,255,255,0.5)
        }
        kyoppie-suggest img {
            height:2em;
            width:2em;
            border-radius:100%;
            vertical-align: middle;
            margin-right:0.5em;
        }
        kyoppie-suggest .screenName {
            margin-left:0.5em;
            color:#888;
            color:rgba(0,0,0,0.5)
        }
        .empty-message,.notfound-message {
            padding: 0.5em 0;
            color:#666666;
            color:rgba(0,0,0,0.6)
        }
    script.
        this.users = []
        this.text = ""

        edit(e) {
            if(this.text === e.target.value) return
            this.text = e.target.value
            if(this.text == "") return
            _this = this
            now_request = $.api.get("users/search",{text:this.text}).then(function(res){
                _this.users = res.response
                _this.update()
            })
        }

        this.edit({target:{value:""}})
