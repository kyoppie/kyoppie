exports.up = function(models) {
    // write your migrate
    return models.users.update({}, {$set: {
        passwordVersion: 1
    }}, {multi: true})
}
