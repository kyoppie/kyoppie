var models = require("../../models")
module.exports = async function (token,id) {
    var app = await models.apps.findById(id)
    if (app.user != token.user.id) {
        return Promise.reject("damedesu")
    }
    return app
}