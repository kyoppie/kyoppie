var main = require("../../../endpoints/users/timeline")
var wrap = require("../wrap")

module.exports = async function () {
    await wrap(main(
        this.request.query.screenName,
        this.request.query.id,
        this.request.query.limit
    ),this)
}
