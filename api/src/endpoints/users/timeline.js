var models = require("../../models")
module.exports = async function (screenName,id,limit) {
    if (!screenName && !id) throw "screenName-or-id-require"
    if (isFinite(limit)) {
        if (typeof limit !== "number") limit = Number(limit)
        if (limit < 1) throw "invalid-limit"
    } else limit = 100
    var user
    if (screenName) {
        user = await models.users.findOne({screenNameLower:screenName.toLowerCase()}).populate("avatar")
    } else {
        user = await models.users.findById(id).populate("avatar")
    }
    if (!user) throw "user-not-found"
    if (user.isSuspended) throw "this-user-is-suspended"
    var posts = await models.posts.find({
        user:user.id
    }).populate("app files replyTo repostTo").sort('-createdAt').limit(limit)
    posts = posts.map(function(post) {
        post.user = user
        return post
    })
    return posts
}
