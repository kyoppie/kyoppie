var models = require("../../../models")
module.exports = function* (token,id) {
    if (!token.user.adminFlag.fileServer) return Promise.reject("damedesu")
    return yield models.file_servers.findById({
        _id:id
    })
}