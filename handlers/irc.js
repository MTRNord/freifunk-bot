var irc = require('irc');
var bot = new irc.Client('irc.lugfl.de', 'DoorBot', {
			debug: true,
			channels: ['#hackerspace'],
			autoRejoin: false,
			autoConnect: false,
			messageSplit: 1000000
		});
var request = require('request');
module.exports = {
	ircPreload: function (){
		bot.addListener('error', function(message) {
    		console.log('error: ', message);
    		setTimeout(function() { console.log("wait 7sek"); }, 7000);
    		irc.ircNick();
    		bot.say('NickServ', 'identify DoorBotPass');
		});
		setTimeout(function() { console.log("wait 7sek"); }, 7000);
		bot.connect(10, function() {
			bot.send('nick', 'DoorBot');
    		bot.say('NickServ', 'identify DoorBotPass');
			bot.join('#hackerspace');
			//bot.say('#hackerspace', 'Door Bot is starting to watch on the Door Status');
		})
	},
	ircSend: function (door_status){
    	bot.say('#hackerspace', 'Door Status changed to: ' + door_status);
    	console.log("IRC Door Status Chnaged");
	},
	ircStopp: function() {
		bot.disconnect('Bot was stopped!');
	},
	ircBotCommands: function(){
		bot.addListener('message', function (from, to, message) {
			if (message == "!help"){
    			console.log(from + ' => ' + to + ': ' + message);
    			bot.say(from, "Here is your Help!\nCommand List:\n- !help - Shows this page.\n- !DoorStatus - Shows the actual Door Status in an PM\n- !DoorStatus channel - Shows the actual Door Status in the channel drom where it was run\n- !where - Shows the address of the Nordlab e.V.\n- !who - Shows who is allowed to come to the Nordlab e.V.\n- !when - Shows who the Nordlab e.V. Hackerspace usually is open");
    		}
    		if (message == "!hilfe"){
    			console.log(from + ' => ' + to + ': ' + message);
    			bot.say(from, "Hier ist die Hilfe!\nBefehl-liste:\n- !hilfe - Zeigt diese Seite.\n- !DoorStatus - Sendet eine PM mit dem aktuellen Status\n- !DoorStatus channel - Sendet in den Channel wo der Befehl ausgeführt wurde den aktuellen Status\n- !where - Zeigt die Addresse vom Nordlab e.V.\n- !who - Zeigt wer alles kommen darf Nordlab e.V.\n- !when - Zeigt wann der Nordlab e.V. Hackerspace geöffnet hat");
    		}
    		if (message == "!where"){
    			console.log(from + ' => ' + to + ': ' + message);
    			bot.say(from, "You can find the Hackerspace in:\nOffener Kanal Flensburg\nSt.-Jürgen-Straße 95\n24937 Flensburg\nAt the very Top of the building");
    		}
    		if (message == "!who"){
    			console.log(from + ' => ' + to + ': ' + message);
    			bot.say(from, "Everybody can come to the Norlab e.V.");
    		}
    		if (message == "!when"){
    			console.log(from + ' => ' + to + ': ' + message);
    			bot.say(from, "The Hackerpace of Norlab e.V. is usually opened every Monday at 18pm o'clock.");
    		}
    		if (message == "!DoorStatus"){
    			request.get('http://www.nordlab-ev.de/doorstate/status.txt', function (error, response, body) {
    				if (!error && response.statusCode == 200) {
      					door_status = body;
      					//console.log(body);
    				}else{
      					door_status = error;
      					//console.log(error);
    				}
    				if (door_status == "geschlossen"){
          				door_status = "closed";
        			}else{
          				door_status = "open";
        			}
    				console.log(from + ' => ' + to + ': ' + message);
    				bot.say(from, "DoorStatus is: " + door_status);
    			}).setMaxListeners(0);
    		}
    		if (message == "!DoorStatus channel"){
    			request.get('http://www.nordlab-ev.de/doorstate/status.txt', function (error, response, body) {
    				if (!error && response.statusCode == 200) {
      					door_status = body;
      					//console.log(body);
    				}else{
      					door_status = error;
      					//console.log(error);
    				}
    				if (door_status == "geschlossen"){
          				door_status = "closed";
        			}else{
          				door_status = "open";
        			}
    				console.log(from + ' => ' + to + ': ' + message);
    				bot.say(to, "DoorStatus is: " + door_status);
    			}).setMaxListeners(0);
    		}
    		if (message == "!kill"){
    			if ((from == "DasNordlicht") || (from == "MTRNord")) {
    				console.log(from + ' => ' + to + ': ' + message);
    			 	if (process.platform === "win32") {
      					var rl = require("readline").createInterface({
        					input: process.stdin,
        					output: process.stdout
      					});
      					bot.disconnect('Bot was stopped!');
      					process.exit();
					}
      			}
    		}
		})
	},
	ircNick: function() {
		bot.send('nick', 'DoorBot'); 
	}
};