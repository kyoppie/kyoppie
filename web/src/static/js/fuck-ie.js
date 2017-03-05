$(function(){
    var ua = navigator.userAgent.toLowerCase();
    var isIE = ~ua.indexOf("msie") || ~ua.indexOf("trident");
    if(!isIE) return;
    $("#fuckie").show();
})
