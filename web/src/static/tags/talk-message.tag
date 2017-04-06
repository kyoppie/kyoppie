kyoppie-talk-message(data-is-me="{opts.message.user.isMe ? 1 : 0}",id="{opts.message.id}")
    .message
        span {opts.message.text}
        time(datetime="{opts.message.createdAt}",ref="created_at") {moment(this.refs.created_at.getAttribute("datetime")).format("HH:mm")}
    style.
        kyoppie-talk-message{
            display:block;
        }
        kyoppie-talk-message[data-is-me="1"]{
            text-align:right;
        }
        .message{
            border-radius:0.5em;
            padding:0.25em 0.5em;
            margin:0.5em 0;
            display:inline-block;
            max-width:80%;
            position:relative;
        }
        kyoppie-talk-message[data-is-me="1"]>.message{
            margin-left:auto;
            background:green;
            background:rgba(0,255,0,0.8);
        }
        kyoppie-talk-message[data-is-me="0"]>.message{
            background:white;
        }
        .message time{
            position:absolute;
            padding:0 0.5em;
            font-size:75%;
            bottom:0;
        }
        kyoppie-talk-message[data-is-me="1"]>.message time{
            right:100%;
            padding-left:0;
        }
        kyoppie-talk-message[data-is-me="0"]>.message time{
            left:100%;
            padding-right:0;
        }
