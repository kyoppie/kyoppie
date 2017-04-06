var main = require("../../../../endpoints/talks/rooms/show_message")
var wrap = require("../../wrap")

module.exports = async function () {
    await wrap(main(
        this.token,
        this.request.query.id
    ),this)
}
