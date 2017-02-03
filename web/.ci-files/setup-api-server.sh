#!/bin/sh
cd ~
git clone https://github.com/kyoppie/kyoppie-api
cd kyoppie-api
npm install
npm run migrate
npm install forever
./node_modules/.bin/forever start -c "node --harmony" src/main.js
