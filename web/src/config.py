import os.path
import os
import sys
import re
import json
import base64
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
# Web特有コンフィグがあるか確認(更新される可能性もあるので)
configSchema = [
    {
        "name":"url",
        "text":"Webが動作するURLを入力してください (例:https://example.com ) > ",
        "type":"text"
    },
    {
        "name":"api",
        "text":"APIが動作しているURLを入力してください (例: https://api.example.com ) > ",
        "type":"text"
    },
    {
        "name":"port",
        "text":"Webが動作するポートを入力してください (例:8080) > ",
        "type":"int"
    },
    {
        "name":"is_debug",
        "text":"開発用機能を有効にしますか\n(インターネット上に公開される環境では有効にしないでください) (Y/N) > ",
        "type":"yorn"
    }
]
questionFlag = False
if(not os.path.exists(config_dir+os.sep+"web.json")):
    print("設定ファイルが存在しません。対話モードで設定ファイルを作成します！")
    print("※URLを入力する場合、最後に/はいりません！")
    web={}
    f = open(config_dir+os.sep+"web.json","w")
    json.dump(web,f)
    f.close()
else:
    f = open(config_dir+os.sep+"web.json","r")
    web = json.load(f)
    f.close()
    questionFlag = True
for question in configSchema:
    if(web.get(question["name"]) == None):
        if(questionFlag):
            print("kyoppieのアップデートに伴い、いくつかの設定項目が追加されました。\nつきましては、お手数おかけしますが追加された設定項目に対話形式でお答えください。")
            questionFlag = False
        while(True):
            print("")
            _i = input(question["text"])
            if(question["type"] == "text"):
                web[question["name"]] = _i
                break
            elif(question["type"] == "yorn"):
                if(_i == "y" or _i == "Y"):
                    web[question["name"]] = True
                    break
                elif(_i == "n" or _i == "N"):
                    web[question["name"]] = False
                    break
                else:
                    print("不正な文字列が指定されました。")
            elif(question["type"] == "int"):
                try:
                    web[question["name"]] = int(_i)
                    break
                except:
                    print("不正な文字列が指定されました。")
            else:
                print("なんかおかしい")
    f = open(config_dir+os.sep+"web.json","w")
    json.dump(web,f)
    f.close()
if(web.get("secret_key") == None):
    import os
    web["secret_key"]=base64.b64encode(os.urandom(24)).decode("utf-8")
    f = open(config_dir+os.sep+"web.json","w")
    json.dump(web,f)
    f.close()
public = dict(web)
del public["port"]
del public["secret_key"]