var models = require("../../models")
module.exports = function* (token,id) {
    // validate
    if (!id) return Promise.reject("id-is-required")
    var post = yield models.posts.findById(id).populate("user")
    if (!post) return Promise.reject("post-not-found")
    if (post.user.isSuspended) return Promise.reject("post-not-found")
    // 重複チェック
    if (yield models.favorites.findOne({post:post.id,user:token.user.id})) return Promise.reject("already-favorite")
    var favorite = new models.favorites()
    favorite.user = token.user
    favorite.post = post
    yield favorite.save()
    post.favoriteCount += 1
    yield post.save()
    // 通知
    try {
        var notification = new models.notifications()
        notification.type = "favorite"
        notification.receiveUser = post.user.id
        notification.targetUser = favorite.user.id
        notification.targetPost = favorite.post.id
        yield notification.save()
    } catch (e) {
        console.log("notification-error")
    }
    return {status:"ok"}
}