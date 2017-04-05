var main = require("../../../../endpoints/talks/rooms/from_user")
var wrap = require("../../wrap")

module.exports = async function () {
    await wrap(main(
        this.token,
        this.request.query.screenName,
        this.request.query.id
    ),this)
}
