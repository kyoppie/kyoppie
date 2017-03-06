# kyoppie

[![Build Status](https://travis-ci.org/kyoppie/kyoppie.svg?branch=master)](https://travis-ci.org/kyoppie/kyoppie)

kyoppie is Open Source SNS.

## LICENSE
[The MIT License](LICENSE)

## How to run

### API

requirements: Node.js >= 7.0.0, MongoDB Server, Redis Server

```
cd api
npm install
npm run migrate
npm start
```

### Web

requirements: Python >= 3.5.0, pip

```
cd web/src
pip3 install flask pyjade requests
python3 main.py
```

### File

requirements: Python >= 3.5.0, pip, ffmpeg, graphicsmagick

```
cd file/src
pip3 install flask pillow python-magic
python3 main.py
```
