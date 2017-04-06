$.extend({
    showNotify:function(str,millisec){
        $("#notify").text(str);
        $("#notify").addClass("active");
        if(millisec) setTimeout($.hideNotify, millisec)
    },
    hideNotify:function(){
        $("#notify").removeClass("active");
    }
})
