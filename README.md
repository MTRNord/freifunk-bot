Nordlab Bot
===========
Modular parser for the hackerspace door status with handlers for multiple services  and IRC Bot for the Nordlab e.V.

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
```!doorstatus [arg]``` - If the arg is "this" it sends in the actual channel the Door Status or is there an existing channel as argument it sends to the channel which is the argument<br>
```!where``` - Send an PM with the address of the Hackerspace<br>
```!who``` - Send an PM with information about who can go to the Hackerspace<br>
```!when``` - Send an PM with information about when the Hackerspace usually is open<br>
```!source``` - Send an PM with the Link of this Repo<br>
```!license``` - Send an PM with the link of the Bot license<br>
```!afk``` - Send in the actual channel that you are A(way) F(rom) K(eyboard)<br>
```!alone``` - Send in the actual channel that you are Alone in the channel<br>
```!freifunk``` - Send in the actual channel a link with an Meme about Freifunk<br>
