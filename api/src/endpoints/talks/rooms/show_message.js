var models = require("../../../models")
module.exports = async function (token, id) {
    var message = await models.talk_messages.findById(id).populate("app user files room")
    if (!message) throw "post-not-found"
    if (message.room.users.indexOf(token.user.id)) throw "post-not-found"
    return message
}
