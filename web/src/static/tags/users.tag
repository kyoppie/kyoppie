kyoppie-users
    ul(show="{opts.users.length}")
        li(each="{user in opts.users}")
            virtual(if="{!ignore_user_ids.indexOf(user.id)}")
                a(href="{base_url}{user.screenName}",onclick="{click}")
                    img(src="{user.avatarUrl}")
                    span {user.name}
                    span.screenName @{user.screenName}
                    i(class="fa fa-{action_icon}",if="{action_icon}")
    style.
        ul {
            margin: -1em;
            padding: 0.5em;
            list-style-type:none;
        }
        li a{
            display:block;
            margin:0;
            height:2.5em;
            padding:0.5em 1em;
            text-decoration:none;
            position:relative;
        }
        li a:hover{
            background: #f52;
            color:white
        }
        li a:hover .screenName{
            color:#888;
            color:rgba(255,255,255,0.5)
        }
        img {
            height:2.5em;
            width:2.5em;
            border-radius:1.25em;
            vertical-align: middle;
            margin-right:0.5em;
        }
        .screenName {
            margin-left:0.5em;
            color:#888;
            color:rgba(0,0,0,0.5)
        }
        i{
            position:absolute;
            right:1em;
            top:50%;
            margin-top:-0.5em;
        }
    script.
        this.base_url = this.opts.base_url
        this.action_icon = this.opts.action_icon
        this.ignore_user_ids = this.opts.ignore_user_ids || []
        this.on("update",function(){
            this.base_url = this.opts.base_url
            this.action_icon = this.opts.action_icon
            this.ignore_user_ids = this.opts.ignore_user_ids || []
        })
        click(e){
            this.trigger("clicked",e.item.user)
        }
        riot.observable(this.observe)
