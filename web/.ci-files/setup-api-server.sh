#!/bin/bash
git clone git://github.com/creationix/nvm.git ~/.nvm
source ~/.nvm/nvm.sh
nvm install 7.4.0
nvm use 7.4.0
cd ~
git clone https://github.com/kyoppie/kyoppie-api
cd kyoppie-api
npm install
npm run migrate
npm install -g forever
forever start -c "node --harmony" src/main.js
