import os.path
import os
import sys
import re
import json
config_dir = os.path.abspath(os.path.dirname(__file__)+os.sep+".."+os.sep+"config"+os.sep)
web={}
api={}
# APIのコンフィグがあるか確認
if(not os.path.exists(config_dir+os.sep+"api.json")):
    print("APIのコンフィグ(config/api.json)が存在しません。APIのweb_config.jsonをconfig/api.jsonにコピーしてください。")
    sys.exit(1)
else:
    f = open(config_dir+os.sep+"api.json","r")
    api = json.load(f)
    f.close()
# Web特有コンフィグがあるか確認
if(not os.path.exists(config_dir+os.sep+"web.json")):
    print("設定ファイルが存在しません。対話モードで設定ファイルを作成します！")
    print("※URLを入力する場合、最後に/はいりません！")
    # 欲しいものは
    # - WebのURL
    # - APIのURL
    # - Webの稼働ポート
    WebUrl = input("Webが動作するURLを入力してください (例:https://example.com ) > ")
    ApiUrl = input("APIが動作しているURLを入力してください (例: https://api.example.com ) > ")
    WebPort = input("Webが動作するポートを入力してください (例:8080) > ")
    web={
        "url":WebUrl,
        "port":int(WebPort),
        "api":ApiUrl
    }
    f = open(config_dir+os.sep+"web.json","w")
    json.dump(web,f)
    f.close()
else:
    f = open(config_dir+os.sep+"web.json","r")
    web = json.load(f)
    f.close()