var irc = require('irc');
var request = require('request');
var command_config = require("../configs/commands.json");
var params_config = require("../configs/params.json");

//Set Params
var botname = params_config["botname"];
var autoupdate = params_config["autoupdate"];
var disconnect_meassage = params_config["disconnect_meassage"];
/* // TEMPLATE //
for (var key in params_config["servers"]) {
  if (params_config["servers"].hasOwnProperty(key)) {
    var servername = params_config["servers"][key]["servername"];
    var serveraddress = params_config["servers"][key]["serveraddress"];
    var main_channel = params_config["servers"][key]["main_channel"];
    var nickserv_pass = params_config["servers"][key]["nickserv_pass"];
    var active = params_config["servers"][key]["active"];
    var debug = params_config["servers"][key]["debug"];
    if (debug == 1) {
      var debug = true;
    }else{
      var debug = false;
    }
  }
}
*/


for (var key in params_config["servers"]) {
  if (params_config["servers"].hasOwnProperty(key)) {
    var serveraddress = params_config["servers"][key]["serveraddress"];
    var main_channel = params_config["servers"][key]["main_channel"];
    var active = params_config["servers"][key]["active"];
    var debug = params_config["servers"][key]["debug"];
    if (debug == 1) {
      var debug = true;
    }else{
      var debug = false;
    }
    if (debug == false) {
      console = console || {};
      console.log = function(){};
    }
    if (active == 1) {
      var bot = new irc.Client(serveraddress, botname, {
        debug: debug,
        channels: [main_channel, "#freifunk-flensburg"],
        autoRejoin: true,
        autoConnect: false,
        messageSplit: 1000000
      });
    }
  }
}

module.exports = {
	ircEndCustom: function (meassage) {
		bot.disconnect(meassage);
	},
	ircPreload: function () {
		bot.addListener('error', function(message) {
			setTimeout(function() { 
    			console.log("wait 7sek"); 
    		}, 7000);

			bot.send('nick', botname); 
      for (var key in params_config["servers"]) {
        if (params_config["servers"].hasOwnProperty(key)) {
          var nickserv_pass = params_config["servers"][key]["nickserv_pass"];
          bot.say('NickServ', 'identify ' + nickserv_pass);
        }
      }
		});
		setTimeout(function() { 
			console.log("wait 7sek"); 
		}, 7000);
		bot.connect(10, function() {
			bot.send('nick', botname);
			for (var key in params_config["servers"]) {
        if (params_config["servers"].hasOwnProperty(key)) {
          var nickserv_pass = params_config["servers"][key]["nickserv_pass"];   
          var main_channel = params_config["servers"][key]["main_channel"];
          bot.say('NickServ', 'identify ' + nickserv_pass);
          bot.join(main_channel);
        }
      }
			bot.say('#hackerspace', 'Door Bot is starting to watch on the Door Status');
		})
	},
	ircSend: function (door_status) {
    for (var key in params_config["servers"]) {
      if (params_config["servers"].hasOwnProperty(key)) {   
        var main_channel = params_config["servers"][key]["main_channel"];
        bot.say(main_channel, 'Door Status changed to: ' + door_status);
        bot.say("#freifunk-flensburg", 'Door Status changed to: ' + door_status);
      }
    }
    bot.send('topic','#hackerspace "Hackerspace Flensburg - Treffen jeden Montag 18:00 Uhr im Offenen Kanal Flensburg! - Tür Status"' + door_status);
    console.log("IRC Door Status Chnaged");
  },
  ircStopp: function() {
    bot.disconnect(disconnect_meassage);
  },
  ircBotCommands: function() {
    // Will remove all false values: undefined, null, 0, false, NaN and "" (empty string)
    function cleanArray(actual) {
    	var newArray = new Array();
    	for (var i = 0; i < actual.length; i++) {
    		if (actual[i]) {
    			newArray.push(actual[i]);
    		}
    	}
    	return newArray;
    }

    bot.addListener('message', function (from, to, message) {
    	message = message.toLowerCase();
    	for (var key in command_config["commands"]) {
    		if (command_config["commands"].hasOwnProperty(key)) {
          console.log("!" + JSON.stringify(command_config["commands"][key]["keyword"]));
          if (message == ("!" + command_config["commands"][key]["keyword"])) {
            if (command_config["commands"][key]["before"] == "from") {
  						if (command_config["commands"][key]["target"] == "from") {
  							bot.say(from, from + command_config["commands"][key]["message"]);
  						} else {
  							bot.say(to, from + command_config["commands"][key]["message"]);
  						}
  					} else {
  						if (!command_config["commands"][key]["before"]) {
  							if (command_config["commands"][key]["target"] == "from") {
  								bot.say(from, command_config["commands"][key]["message"]);
  							} else {
  								bot.say(to, command_config["commands"][key]["message"]);
  							}
  						} else {
  							if (command_config["commands"][key]["target"] == "from") {
  								bot.say(from, to + command_config["commands"][key]["message"]);
  							} else {
  								bot.say(to, to + command_config["commands"][key]["message"]);
  							}
  						}
  					}
  				}
  			}
  		}
  		var channel = message.split(" ");
  		channel = cleanArray(channel);
  		if (channel[0] + " " + channel[1] == "!source this") {
  			console.log("!source " + channel[1]);
  			if (channel[1] == "this") {
  				bot.join(to);
  				bot.say(to, "You can find the Source of this bot at https://github.com/MTRNord/nordlab-hackerspace-door");
  			}
  		}
  		if (message == "!doorstatus") {
  			request.get('http://www.nordlab-ev.de/doorstate/status.txt', function (error, response, body) {
  				if (!error && response.statusCode == 200) {
  					door_status = body;
	      		console.log(body);
	      	} else {
	      		door_status = error;
	      		console.log(error);
	      	}
          if (!error && response.statusCode == 200) {
	      	  if (door_status == "geschlossen") {
	      	    door_status = "closed";
	      	  } else {
	      		 door_status = "open";
	      	  }
			     console.log(from + ' => ' + to + ': ' + message);
			     bot.say(from, "DoorStatus is: " + door_status);
          }else{
            bot.say(from, "DoorStatus is not availible at this time");
          }
        }).setMaxListeners(0);
  		}
  		if (channel[0] + " " + channel[1] == "!doorstatus this") {
  			request.get('http://www.nordlab-ev.de/doorstate/status.txt', function (error, response, body) {
  				if (!error && response.statusCode == 200) {
  				  door_status = body;
	      		console.log(body);
	      	} else {
	      		door_status = error;
	      		console.log(error);
	      	}
          if (!error && response.statusCode == 200) {
	      	  if (door_status == "geschlossen") {
	      		 door_status = "closed";
	      	  } else {
	      		 door_status = "open";
	      	  }
            console.log(message);
            bot.list();
            console.log(channel[(channel.length-(channel.length-1))+1]);
            console.log(channel.length);
            if (channel[1] !== "this") {
              if (channel[1] !== " ") {
                bot.addListener('channellist', function (channel_list) {
                  for (var key in channel_list) {
                    if (channel_list.hasOwnProperty(key)) {
                      if (channel_list[key]["name"] == channel[1]) {
                        bot.join(channel[1]);
                        bot.say(channel[1], "DoorStatus is: " + door_status);
                      }
                    }
								  }
                });
              } else {
                bot.say(from, "DoorStatus is: " + door_status);
              }
            } else {
              bot.join(to);
              bot.say(to, "DoorStatus is: " + door_status);
            }
          }else{
            bot.say(from, "DoorStatus is not availible at this time");
          }
        }).setMaxListeners(0);
      }
      if (message == "!kill") {
        if ((from == "DasNordlicht") || (from == "MTRNord")) {
          console.log(from + ' => ' + to + ': ' + message);
    			if (process.platform === "win32") {
    				var rl = require("readline").createInterface({
    					input: process.stdin,
    					output: process.stdout
    				});
    				bot.disconnect(disconnect_meassage);
    				process.exit();
    			}
    		}
    	}
    })
  },
  ircNick: function() {
	 bot.send('nick', botname); 
  }
};
