#!/bin/bash
source ~/.nvm/nvm.sh
nvm install 7.4.0
nvm use 7.4.0
git clone https://github.com/kyoppie/kyoppie-api
cd kyoppie-api
npm install
npm run migrate
npm install -g forever
forever start -c "node --harmony" src/main.js
until curl localhost:4005 > /dev/null 2> /dev/null do
    sleep 1
done
cd ..
cp kyoppie-api/web_config.json config/api.json
cp .ci-files/web.json config/
pip3 install flask pyjade requests
cd src
forever start -c "python3" main.py
until curl localhost:4006 > /dev/null 2> /dev/null
do
sleep 1
done
