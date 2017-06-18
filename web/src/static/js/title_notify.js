// 新着投稿があるときに
// タイトルを "(1) kyoppie" のようにして
// ユーザーに知らせるためのライブラリ
// Vivaldiだとタブに①みたいな感じで付いて神
(function(){
    var isActive = true;
    var unreadCount = 0;
    var originalTitle = document.title
    $(window).blur(function () {
        isActive = false;
    })
    $(window).focus(function () {
        isActive = true;
        unreadCount = 0;
        document.title = "kyoppie";
    })
    $.extend({
        addUnreadCount: function(count){
            if(!count) count = 1
            if (!isActive) {
                unreadCount += count;
                document.title = "(" + unreadCount + ") "+originalTitle;
            }
        }
    })
})()
