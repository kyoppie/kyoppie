kyoppie-text-render
    span(ref="html",base="{render_html()}")
    script.
        this.render_html = function (){
            var text = opts.text
            this.refs.html.innerHTML = text
                .replaceAll("<", "&lt;")
                .replaceAll(">", "&gt;")
                .replaceAll("&", "&amp;")
                .replaceAll("\n", "<br>")
                .replace(/(^| |\u3000)@([A-Za-z0-9_]+)/g,'$1<a href="/u/$2">@$2</a>')
                .replace(/(https?:)\/\/([a-zA-Z0-9-\.]+(:[0-9]+)?(\/?[a-zA-Z0-9-\._~\!#$&'\(\)\*\+,\/:;=\?@\[\]%]*))/g,function(match) {
                    return ('<a href="'+match+'" rel="nofollow" target="_blank">'+match+'</a>').replace(/\/\//g,"&#x2F;&#x2F;")
                })
                .replace(/moz:\/\/a/,'<a href="https:&#x2F;&#x2F;www.mozilla.org/">moz:&#x2F;&#x2F;a</a>')
            return ""
        }
