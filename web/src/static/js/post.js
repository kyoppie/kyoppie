$(function(){
    $(document).on("click",".post-favorite",function(){
        if($(this).hasClass("post-favorited")) return;
        $.api.post("posts/favorite",{id:$(this).data("post-id")})
        $(this).addClass("post-favorited")
        $(this).children("i.fa").removeClass("fa-star-o").addClass("fa-star")
        $(this).next().text((parseInt($(this).next().text())||0)+1);
    })
    $(document).on("click",".post-repost",function(){
        if(!confirm("この投稿をRePostしますか?")) return
        $.api.post("posts/repost",{id:$(this).data("post-id")})
        $(this).addClass("post-reposted")
        $(this).next().text((parseInt($(this).next().text())||0)+1);
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
