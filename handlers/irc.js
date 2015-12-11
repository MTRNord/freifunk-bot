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
			bot.say('#hackerspace', 'Door Bot is starting to watch on the Door Status');
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
    			bot.say(from, "Here is your Help!\nCommand List:\n- !help - Shows this page.\n- !DoorStatus - Shows the actual Door Status in an PM\n- !DoorStatus channel - Shows the actual Door Status in the channel drom where it was run");
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