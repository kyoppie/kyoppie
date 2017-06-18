var models = require("../../models")
var getHashedPassword = require("../../utils/getHashedPassword")
var bcrypt = require("bcrypt")
module.exports = async function (requestToken,screenName,password) {
    if (!requestToken) throw "require-requestToken"
    if (!screenName || typeof screenName !== "string") throw "require-screenName"
    if (!password || typeof password !== "string") throw "require-password"
    var request_token = await models.request_tokens.findOne({token:requestToken})
    if (!request_token) throw "requestToken-invalid"
    var user = await models.users.findOne({screenNameLower:screenName.toLowerCase()})
    if (!user) throw "user-not-found"
    // password auth
    if (user.passwordVersion == 1) {
        var salt = user.passwordSalt
        var hashPassword = getHashedPassword(password,salt)
        if (hashPassword != user.password) {
            throw "invalid-password"
        }
        user.passwordVersion = 2
        user.password = await bcrypt.hash(password, await bcrypt.genSalt(16))
        await user.save()
    } else if (user.passwordVersion == 2) {
        if (!await bcrypt.compare(password, user.password)) {
            throw "invalid-password"
        }
    }
    var pin_code = new models.pin_codes()
    pin_code.app = request_token.app
    pin_code.request_token = request_token.id
    pin_code.user = user
    return await pin_code.save()
}
