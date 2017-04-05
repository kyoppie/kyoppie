kyoppie-talk-message
    .message(data-is-me="{opts.message.user.isMe ? 1 : 0}")
        span {opts.message.text}
    style.
        kyoppie-talk-message{
            display:block;
        }
        .message{
            border-radius:0.5em;
            padding:0.25em;
            margin:0.5em 0;
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
