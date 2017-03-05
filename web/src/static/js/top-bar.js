$(function(){
    $.api.get("account/show").then(function(res){
        if(!res.response.rulesAgree) $("#rulesagree").show();
    })
})
