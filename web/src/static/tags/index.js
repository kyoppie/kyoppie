var riot = require("riot")

require("./timeline.tag")
require("./user-search.tag")
require("./talk-room.tag")

console.log("うんこ")

window.addEventListener("load", function(){
    riot.mount("*")
})
