kyoppie-talk-message
    .message(data-is-me="{opts.message.user.isMe ? 1 : 0}")
        span {opts.message.text}
        time(datetime="{opts.message.createdAt}",ref="created_at") {moment(this.refs.created_at.getAttribute("datetime")).format("HH:mm")}
    style.
        kyoppie-talk-message{
            display:block;
        }
        .message{
            border-radius:0.5em;
            padding:0.25em;
            margin:0.5em 0;
            position:relative;
        }
        .message[data-is-me="1"]{
            margin-left:20%;
            background:green;
            background:rgba(0,255,0,0.8);
        }
        .message[data-is-me="0"]{
            margin-right:20%;
            background:white;
        }
        .message time{
            position:absolute;
            padding:0 0.5em;
            font-size:75%;
            bottom:0;
            width:5em; /* とりあえず */
        }
        .message[data-is-me="1"] time{
            right:100%;
            text-align:right;
        }
        .message[data-is-me="0"] time{
            left:100%;
            text-align:left;
        }
