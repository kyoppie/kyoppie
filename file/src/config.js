var readlineSync = require("readline-sync")
var fs = require("fs");
var config_json={};
try{
    config_json = require(__dirname+"/../config.json");
} catch(e) {
    console.log("設定ファイルが存在しません！")
    console.log("コンフィグファイルを作成します。\n")
}
var schemas = [
    {name:"file_key",question:"File Server Keyを入力してください\n無い場合、管理画面から作成してください"},
    {name:"port",question:"動作ポートを入力してください"}
]
schemas.forEach(function(schema){
    if(config_json[schema.name]) return;
    config_json[schema.name] = readlineSync.question(schema.question+" > ")
    fs.writeFileSync(__dirname+"/../config.json",JSON.stringify(config_json))
})
module.exports = config_json