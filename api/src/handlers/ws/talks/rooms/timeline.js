var getRedisConnection = require("../../../../utils/getRedisConnection")
var show = require("../../../../endpoints/talks/rooms/show_message")
module.exports = function(ws) {
    var streaming = getRedisConnection()
    streaming.subscribe("kyoppie:talks-room-timeline:"+ws.query.id)
    streaming.on("message",async function(_,msg) {
        var message = await show(ws.token, msg)
        console.log(message)
        console.log(await message.toResponseObject(ws.token))
        ws.sendJSON({
            result:true,
            response:await message.toResponseObject(ws.token)
        })
    })
    ws.on("close",function() {
        streaming.quit()
    })
}
