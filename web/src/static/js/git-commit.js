$(function(){
    $.get("/_/ajax/get_commit?nocache="+Date.now()).then(function(res){
        if(localStorage.getItem("commit") != res) {
            localStorage.setItem("commit",res);
            location.reload(true);
        }
    })
})
