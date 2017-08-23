kyoppie-header-bar
    .container
        ul.left-items
            li: a(href="/")
                i.fa.fa-home
                span Home
            li: a(href="/notifications/")
                i.fa.fa-bell
                span Notifications
            li: a(href="/talks/")
                i.fa.fa-comments
                span Talks
        ul.right-items
            li: a(href="/menu")
                if my
                    img(src=my.avatarThumbnailUrl,title="@"+my.screenName).headerBarIcon
                else
                    i.fa.fa-bars
    style.
        :scope{
            font-size:16px;
            height:40px;
            position:fixed;
            top:0;
            left:0;
            width:100%;
            background:rgba(255,255,255,0.9);
            box-shadow:0px 1px 0px rgba(192,192,192,0.9);
            z-index:999;
        }
        body{
            padding-top:40px;
        }
        :scope ul{
            display:inline-block;
            padding:0;
            margin:0;
        }
        :scope ul li{
            display:inline-block;
            font-size:20px;
        }
        :scope a{
            display:inline-block;
            height:40px;
            line-height:40px;
            padding: 0px 10px;
            text-decoration:none !important;
        }
        :scope ul li a span {
            display:none;
        }
        :scope .container{
            margin:0 auto;
            position:relative;
            max-width:660px;
        }
        :scope .left-items li:first-child{
            padding-left:10px;
        }
        :scope .right-items {
            position:absolute;
            right:0;
        }
        :scope .right-items li:first-child{
            padding-right:10px;
        }
        @media (min-width:640px){
            :scope ul li a span{
                display:inline-block;
                font-size:0.75em;
                margin-left:0.25em;
            }
        }
        #fuckie{
            display:none;
        }
        .headerBarIcon {
            height:30px;
            width:30px;
            margin-top:5px;
        }
