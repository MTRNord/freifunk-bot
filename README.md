[![Code Climate](https://codeclimate.com/github/MTRNord/nordlab-hackerspace-door/badges/gpa.svg)](https://codeclimate.com/github/MTRNord/nordlab-hackerspace-door) [![Total alerts](https://img.shields.io/lgtm/alerts/g/MTRNord/freifunk-bot.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/MTRNord/freifunk-bot/alerts/)
Nordlab Bot
===========

[![Greenkeeper badge](https://badges.greenkeeper.io/MTRNord/nordlab-hackerspace-door.svg)](https://greenkeeper.io/)
Modular parser for the hackerspace door status with handlers for multiple services and IRC Bot for the Nordlab e.V.

How to install
==============
1. npm install
2. npm start

Commandline options
===================
When using commandline arguments use ```node main.js``` to start.<br>
```--noupdate``` - stops bot from getting updates <br>

Commands
========
```!help | !hilfe``` - Lists all commands in a PM<br>
```!doorstatus``` - Send an PM with the actual Door Status<br>
```!doorstatus [arg]``` - If the arg is <b>"this"</b> it sends in the actual channel the Door Status or is there an <b>existing channel as argument</b> it sends to the channel which is the argument<br>
```!where``` - Send an PM with the address of the Hackerspace<br>
```!who``` - Send an PM with information about who can go to the Hackerspace<br>
```!when``` - Send an PM with information about when the Hackerspace usually is open<br>
```!source``` - Send an PM with the link of this repo. If you add <b>"this"</b> after it you can post it in the actual channel<br>
```!license``` - Send an PM with the link of the bot license<br>
```!afk``` - Send in the actual channel that you are A(way) F(rom) K(eyboard)<br>
```!alone``` - Send in the actual channel that you are alone in the channel<br>
```!freifunk``` - Send in the actual channel a link with an meme about Freifunk<br>

Updates
=======
The Bot pulls the repo every day at 2am (if not deativated) and restarts the bot. So it is always UpTo-Date :)<br>
