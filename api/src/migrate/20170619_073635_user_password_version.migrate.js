exports.up = function(models) {
    // write your migrate
    return models.users.update({passwordVersion: {$nin: [2]}}, {$set: {
        passwordVersion: 1
    }}, {multi: true})
}
