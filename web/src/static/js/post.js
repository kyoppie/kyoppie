$(function(){
    $(document).on("click",".post-favorite",function(){
        if($(this).hasClass("post-favorited")) return;
        $.api.post("posts/favorite",{id:$(this).data("post-id")})
        $(this).addClass("post-favorited")
        $(this).children("i.fa").removeClass("fa-star-o").addClass("fa-star")
        $(this).next().text((parseInt($(this).next().text())||0)+1);
    })
    $(document).on("click",".post-repost",function(){
        alert("未実装");
    })
    $(document).on("click",".post-reply",function(){
        alert("未実装")
    })
})
