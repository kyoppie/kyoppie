var readlineSync = require("readline-sync")
var fs = require("fs");
var config_json={};
try{
    config_json = require(__dirname+"/../config.json");
} catch(e) {
    /*
    console.log("設定ファイルが存在しません！")
    console.log("コンフィグファイルを作成します。\n")
    config_json.file_key = readlineSync.question("File Server Keyを入力してください\n無い場合、管理画面から作成してください > ")
    */
}
module.exports = config_json