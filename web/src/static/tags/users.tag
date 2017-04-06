kyoppie-users
    ul(show="{users.length}")
        li(each="{users}")
            a(href="{base_url}{screenName}")
                img(src="{avatarUrl}")
                span {name}
                span.screenName @{screenName}
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
