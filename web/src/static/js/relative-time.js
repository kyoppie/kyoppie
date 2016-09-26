$(function(){
    var f = Math.floor;
    var ssf = function(num){
        return num < 10 ? "0"+f(num) : f(num);
    }
    setInterval(function(){
        var now_time = f(Date.now()/1000);
        var offset = -(new Date().getTimezoneOffset()*60);
        now_time += offset;
        $(".relative_time").each(function(){
            var target_time = new Date(this.getAttribute("datetime")).getTime()/1000;
            target_time += offset;
            var sabun = f(now_time-target_time);
            var text = "";
            if(sabun < 120) {
                text = sabun+"秒前";
            } else if(sabun < 60*60) {
                text = f(sabun/60)+"分前";
            } else if(sabun < 120*60) {
                text = f(sabun/60/60)+"時間と"+f(sabun/60)+"分前";
            } else if(f(target_time/60/60/24) == f(now_time/60/60/24)) {
                text = "今日の"+ssf(target_time/60/60%24)+":"+ssf(target_time/60%60)
            } else if(sabun < 30*24*60*60) {
                text = (f(now_time/60/60/24) - f(target_time/60/60/24))+"日前の"+ssf(target_time/60/60%24)+":"+ssf(target_time/60%60)
            } else {
                text = "むっちゃ前";
            }
            if(this.innerText != text) this.innerText = text;
            console.log(sabun)
        })
    },1000)
})
