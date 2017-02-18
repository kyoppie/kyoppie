$(function(){
    $(document).on("click",".post-favorite",function(){
        var $this=$(this)
        if($this.hasClass("post-favorited")) return
        $.api.post("posts/favorite",{id:$(this).data("post-id")}).then(function(res){
            if(res.result){
                $this.next().text(res.result.favoriteCount)
            }
        })
        $this.addClass("post-favorited")
        $this.children("i.fa").removeClass("fa-star-o").addClass("fa-star")
    })
    $(document).on("click",".post-repost",function(){
        var $this = $(this)
        if($this.hasClass("post-reposted")) return
        if(!confirm("この投稿をRePostしますか?")) return
        $.api.post("posts/repost",{id:$this.data("post-id")}).then(function(res){
            if(res.result){
                // TODO
                // $this.next().text(res.response.repostTo.repostCount)
                $.api.get("posts/show",{id:$this.data("post-id")}).then(function(res){
                    $this.next().text(res.response.repostCount);
                })
            }
        })
        $this.addClass("post-reposted")
    })
    $(document).on("click",".post-reply",function(){
        var message = prompt("reply message","@"+$(this).parents(".post").data("user-screen-name")+" ")
        if (message === null) return
        $.api.post("posts/create",{
            text:message,
            replyTo:$(this).data("post-id")
        })
    })
})
