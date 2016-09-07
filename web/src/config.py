import os.path
import os
import sys
import re
config_dir = os.path.abspath(os.path.dirname(__file__)+os.sep+".."+os.sep+"config"+os.sep)
# APIのコンフィグがあるか確認
if(not os.path.exists(config_dir+os.sep+"api.json")):
    print("APIのコンフィグ(config/api.json)が存在しません。APIのweb_config.jsonをconfig/api.jsonにコピーしてください。")
    sys.exit(1)
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
    