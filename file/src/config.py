# coding: utf-8
import os.path
import os
import sys
import re
import json
import base64
config_file = os.path.abspath(os.path.dirname(__file__)+os.sep+".."+os.sep+"config.json")
file={}
api={}
# コンフィグがあるか確認(更新される可能性もあるので)
configSchema = [
    {
        "name":"file_key",
        "text":"File Server Keyを入力してください\n無い場合、管理画面から作成してください > ",
        "type":"text"
    },
    {
        "name":"port",
        "text":"動作ポートを入力してください > ",
        "type":"text"
    },
    {
        "name":"is_debug",
        "text":"開発用機能を有効にしますか\n(インターネット上に公開される環境では有効にしないでください) (Y/N) > ",
        "type":"yorn"
    }
]
questionFlag = False
if(not os.path.exists(config_file)):
    print("設定ファイルが存在しません。対話モードで設定ファイルを作成します！")
    print("※URLを入力する場合、最後に/はいりません！")
    file={}
    f = open(config_file,"w")
    json.dump(file,f)
    f.close()
else:
    f = open(config_file,"r")
    file = json.load(f)
    f.close()
    questionFlag = True
for question in configSchema:
    if(file.get(question["name"]) == None):
        if(questionFlag):
            print("kyoppieのアップデートに伴い、いくつかの設定項目が追加されました。\nつきましては、お手数おかけしますが追加された設定項目に対話形式でお答えください。")
            questionFlag = False
        while(True):
            print("")
            try:
                _i = raw_input(question["text"])
            except:
                _i = input(question["text"])
            if(question["type"] == "text"):
                file[question["name"]] = _i
                break
            elif(question["type"] == "yorn"):
                if(_i == "y" or _i == "Y"):
                    file[question["name"]] = True
                    break
                elif(_i == "n" or _i == "N"):
                    file[question["name"]] = False
                    break
                else:
                    print("不正な文字列が指定されました。")
            elif(question["type"] == "int"):
                try:
                    file[question["name"]] = int(_i)
                    break
                except:
                    print("不正な文字列が指定されました。")
            else:
                print("なんかおかしい")
    f = open(config_file,"w")
    json.dump(file,f)
    f.close()
