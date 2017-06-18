$(function(){
    $.api.get("account/show").then(function(res){
        window.ME=res.response
        if(!res.response.rulesAgree) $("#rulesagree").show();
    })
})
