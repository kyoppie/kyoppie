#!/bin/bash
cp ../api/web_config.json config/api.json
cp .ci-files/web.json config/
cd src
forever start -c "python3" main.py
until curl localhost:4006 > /dev/null 2> /dev/null
do
sleep 1
done
