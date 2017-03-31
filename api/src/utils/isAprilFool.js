module.exports = function(year) {
    var nowDate = new Date()
    return nowDate.getMonth() == 3 && nowDate.getDate() == 1 && nowDate.getFullYear() >= year
}
