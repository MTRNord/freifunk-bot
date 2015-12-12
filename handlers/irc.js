var irc = require('irc');
var bot = new irc.Client('irc.lugfl.de', 'NordlabBot', {
			debug: false,
			channels: ['#hackerspace'],
			autoRejoin: false,
			autoConnect: false,
			messageSplit: 1000000
		});
var request = require('request');
var command_config = require("../commands.json");
module.exports = {
	ircEndCustom: function (meassage){
		bot.disconnect(meassage);
	},
	ircPreload: function (){
		bot.addListener('error', function(message) {
    		setTimeout(function() { 
    			// console.log("wait 7sek"); 
    		}, 7000);
    		bot.send('nick', 'NordlabBot'); 
    		bot.say('NickServ', 'identify NordlabBotPass');
		});
		setTimeout(function() { 
			// console.log("wait 7sek"); 
		}, 7000);
		bot.connect(10, function() {
			bot.send('nick', 'NordlabBot');
    		bot.say('NickServ', 'identify NordlabBotPass');
			bot.join('#hackerspace');
			//bot.say('#hackerspace', 'Door Bot is starting to watch on the Door Status');
		})
	},
	ircSend: function (door_status){
    	bot.say('#hackerspace', 'Door Status changed to: ' + door_status);
    	// bot.send('topic','#hackerspace "Hackerspace Flensburg - Treffen jeden Montag 18:00 Uhr im Offenen Kanal Flensburg! - Tür Status"' + door_status);
    	// console.log("IRC Door Status Chnaged");
	},
	ircStopp: function() {
		bot.disconnect('Bot was stopped!');
	},
	ircBotCommands: function(){
		bot.addListener('message', function (from, to, message) {
			message = message.toLowerCase();
    		for (var key in command_config["commands"]) {
  				if (command_config["commands"].hasOwnProperty(key)) {
  					// console.log("!" + JSON.stringify(command_config["commands"][key]["keyword"]));
					if (message == ("!" + command_config["commands"][key]["keyword"])) {
						if (command_config["commands"][key]["before"] == "from") {
    						if (command_config["commands"][key]["target"] == "from") {
								bot.say(from, from + command_config["commands"][key]["message"]);
							}else{
								bot.say(to, from + command_config["commands"][key]["message"]);
							}
						}else{
							if (!command_config["commands"][key]["before"]) {
    							if (command_config["commands"][key]["target"] == "from") {
									bot.say(from, command_config["commands"][key]["message"]);
								}else{
									bot.say(to, command_config["commands"][key]["message"]);
								}
							}else{
								if (command_config["commands"][key]["target"] == "from") {
									bot.say(from, to + command_config["commands"][key]["message"]);
								}else{
									bot.say(to, to + command_config["commands"][key]["message"]);
								}
							}
						}
					}
  				}
			}
    		if (message == "!doorstatus"){
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
    				// console.log(from + ' => ' + to + ': ' + message);
    				bot.say(from, "DoorStatus is: " + door_status);
    			}).setMaxListeners(0);
    		}
			var channel = message.split(" ");
    		if (message == "!doorstatus " + channel[channel.length-1]){
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
        			// console.log(message);
        			bot.list();
        			// console.log(channel[(channel.length-(channel.length-1))+1]);
        			// console.log(channel.length);
        			if (channel[channel.length-1] !== "this"){
        				if (channel[channel.length-1] !== " ") {
        					bot.addListener('channellist', function (channel_list) {
        						for (var key in channel_list) {
  									if (channel_list.hasOwnProperty(key)) {
										if (channel_list[key]["name"] == channel[channel.length-1]) {
											// console.log("1");
    										bot.join(channel[channel.length-1]);
    										bot.say(channel[channel.length-1], "DoorStatus is: " + door_status);
										}
  									}
								}
							});
						}else{
							bot.say(from, "DoorStatus is: " + door_status);
						};
        			}else{
        				bot.join(to);
    					bot.say(to, "DoorStatus is: " + door_status);
        			}
    			}).setMaxListeners(0);
    		}
    		if (message == "!kill"){
    			if ((from == "DasNordlicht") || (from == "MTRNord")) {
    				// console.log(from + ' => ' + to + ': ' + message);
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
		bot.send('nick', 'NordlabBot'); 
	}
};