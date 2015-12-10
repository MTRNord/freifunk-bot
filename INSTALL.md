Main
====
!!!IMPORTANT!!! RUN HANDLER INSTALL BEFORE SCRIPT START!!!

1. npm install request
2. node main.js

Pushbullet Handler
==================
1. npm install curlrequest
2. Add ``var pushbullet = require('./handlers/pushbullet.js');`` to main.js at the Load section in the Top
3. Add ``pushbullet.pushbulletSend(door_status);`` to main.js at the Runtime section in the middle
4. add your own pushbullet API key in "handler/pushbullet.js"

IRC Handler
===========
1. npm install irc
2. Add ``var irc = require('./handlers/irc.js');`` to main.js at the Load section in the Top
3. Add ``irc.ircSend(door_status);`` to main.js at the Runtime section in the middle
