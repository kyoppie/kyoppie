$.extend({
    showNotify:function(str,millisec){
        $("#notify").text(str);
        $("#notify").addClass("active");
        if(millisec) setTimeout($.hidenotify, millisec)
    },
    hideNotify:function(){
        $("#notify").removeClass("active");
    }
})
