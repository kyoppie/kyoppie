kyoppie-users
    ul(show="{opts.users.length}")
        li(each="{user in opts.users}")
            virtual(if="{!~ignore_user_ids.indexOf(user.id)}")
                a(href="{base_url}{user.screenName}",onclick="{click}")
                    img(src="{user.avatarUrl}")
                    span {user.name}
                    span.screenName @{user.screenName}
                    i(class="fa fa-{action_icon}",if="{action_icon}")
    style.
        :scope ul {
            margin: -0.5em;
            padding: 0;
            max-width:100vw;
            list-style-type:none;
        }
        :scope li a{
            display:block;
            margin:0;
            height:2.5em;
            padding:0.5em 1em;
            text-decoration:none;
            position:relative;
        }
        :scope li a:hover{
            background: #f52;
            color:white
        }
        :scope li a:hover .screenName{
            color:#888;
            color:rgba(255,255,255,0.5)
        }
        :scope img {
            height:2.5em;
            width:2.5em;
            border-radius:1.25em;
            vertical-align: middle;
            margin-right:0.5em;
        }
        :scope .screenName {
            margin-left:0.5em;
            color:#888;
            color:rgba(0,0,0,0.5)
        }
        :scope i{
            position:absolute;
            right:1em;
            top:50%;
            margin-top:-0.5em;
        }
        @media screen and (max-width:480px) {
            :scope li a{
                margin:0;
                padding:1em;
            }
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
        this.click = function(e){
            this.trigger("clicked",e.item.user)
        }.bind(this)
        riot.observable(this.observe)
