var riot = require("riot")

require("./header-bar.tag")
require("./timeline.tag")
require("./user-search.tag")
require("./talk-room.tag")

window.addEventListener("load", function(){
    riot.mount("*")
})
