/**
 * IRC-ChatBot Module
 *
 * @module Main
 * @class irc
 * @submodule irc
 * @author Marcel Radzio
 */
//Load needed Features
var irc = require('irc');
var request = require('request');
var command_config = require("../configs/commands.json");
var params_config = require("../configs/params.json");

//Set Params
/**
 * Param Botname
 *
 * @property botname
 * @type String
 */
var botname = params_config["botname"];
/**
 * Param autoupdate
 *
 * @property autoupdate
 * @type String
 */
var autoupdate = params_config["autoupdate"];
/**
 * Param disconnect_meassage
 *
 * @property disconnect_meassage
 * @type String
 */
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
var clients = [];
var bot = [];
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
      bot[key] = new irc.Client(serveraddress, botname, {
        debug: debug,
        channels: [main_channel],
        autoRejoin: true,
        autoConnect: false,
        messageSplit: 1000000,
        floodProtection: true,
        floodProtectionDelay: 1000,
      });
    }
    clients.push(bot[key]);
  }
}

function addListener(event, callback) {
  clients.forEach(function(client) {
    client.addListener(event, callback);
  });
}
function join(event, callback) {
  clients.forEach(function(client) {
    client.join(event, callback);
  });
}
function disconnect(event, callback) {
  clients.forEach(function(client) {
    client.disconnect(event, callback);
  });
}

function connect(event, callback) {
  clients.forEach(function(client) {
    client.connect(event, callback);
  });
}

function send(event, callback) {
  clients.forEach(function(client) {
    client.send(event, callback);
  });
}

function say(event, callback) {
  clients.forEach(function(client) {
    client.say(event, callback);
  });
}
module.exports = {
	/**
 	* Stops Bot with custom meassage
 	*
 	* @method ircEndCustom
 	* @constructor
	*/
	ircEndCustom: function (meassage) {
		disconnect(meassage);
	},
	/**
 	* Connects to Server, logs in to NickServ, sets Name
 	*
 	* @method ircPreload
	*/
	ircPreload: function () {
		addListener('error', function(message) {
			setTimeout(function() {
    			console.log("wait 7sek");
    		}, 7000);

			send('nick', botname);
      		for (var key in params_config["servers"]) {
        		if (params_config["servers"].hasOwnProperty(key)) {
        			/**
   					 * Password for the NickServ
   					 *
    				 * @property nickserv_pass
    				 * @type String
   					 */
          			var nickserv_pass = params_config["servers"][key]["nickserv_pass"];
          			say('NickServ', 'identify ' + nickserv_pass);
        		}
      		}
		});
		setTimeout(function() {
			console.log("wait 7sek");
		}, 7000);
		connect(10, function() {
			send('nick', botname);
			for (var key in params_config["servers"]) {
        		if (params_config["servers"].hasOwnProperty(key)) {
        			/**
   					 * Password for the NickServ
   					 *
    				 * @property nickserv_pass
    				 * @type String
   					 */
          			var nickserv_pass = params_config["servers"][key]["nickserv_pass"];
          			/**
   					 * Main Channel of the Bot
   					 *
    				 * @property main_channel
    				 * @type String
   					 */
          			var main_channel = params_config["servers"][key]["main_channel"];
          			say('NickServ', 'identify ' + nickserv_pass);
          			join(main_channel);
        		}
      		}
			//say(main_channel, 'Door Bot is starting to watch on the Door Status');
		})
	},
	/**
 	* Send DoorStatus to selected Channels
 	*
 	* @method ircSend
 	* @constructor
	*/
	ircSend: function (door_status) {
		for (var key in params_config["servers"]) {
      		if (params_config["servers"].hasOwnProperty(key)) {
      			/**
   				 * Main Channel of the Bot
   				 *
    			 * @property main_channel
    			 * @type String
   				 */
        		var main_channel = params_config["servers"][key]["main_channel"];
        		say(main_channel, 'Door Status changed to: ' + door_status);
        		say("#freifunk-flensburg", 'Door Status changed to: ' + door_status);
      		}
    	}
    	send('topic','#hackerspace "Hackerspace Flensburg - Treffen jeden Montag 18:00 Uhr im Offenen Kanal Flensburg! - Tür Status"' + door_status);
    	console.log("IRC Door Status Chnaged");
  	},
	/**
 	* Stops Bot with Stop measseagew freom config file
 	*
 	* @method ircStopp
	*/
  	ircStopp: function() {
    	disconnect(disconnect_meassage);
  	},
	/**
 	* Handels Commands from the Bot
 	*
 	* @method ircBotCommands
	*/
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

    	addListener('message', function (from, to, message) {
    		/**
   			 * Recived meassage
   			 *
    		 * @property message
    		 * @type String
   			 */
    		message = message.toLowerCase();
    		for (var key in command_config["commands"]) {
    			if (command_config["commands"].hasOwnProperty(key)) {
          			console.log("!" + JSON.stringify(command_config["commands"][key]["keyword"]));
          			if (message == ("!" + command_config["commands"][key]["keyword"])) {
            			if (command_config["commands"][key]["before"] == "from") {
  							if (command_config["commands"][key]["target"] == "from") {
  								say(from, from + command_config["commands"][key]["message"]);
  							} else {
  								say(to, from + command_config["commands"][key]["message"]);
  							}
  						} else {
  							if (!command_config["commands"][key]["before"]) {
  								if (command_config["commands"][key]["target"] == "from") {
  									say(from, command_config["commands"][key]["message"]);
  								} else {
  									say(to, command_config["commands"][key]["message"]);
  								}
  							} else {
  								if (command_config["commands"][key]["target"] == "from") {
  									say(from, to + command_config["commands"][key]["message"]);
  								} else {
  									say(to, to + command_config["commands"][key]["message"]);
  								}
  							}
  						}
  					}
  				}
  			}
  			/**
   			 * List of Channels on Server
   			 *
    		 * @property channel
    		 * @type Array
    		 *
    		 * @beta
   			 */
  			var channel = message.split(" ");
  			channel = cleanArray(channel);
  			if (channel[0] + " " + channel[1] == "!source this") {
  				console.log("!source " + channel[1]);
  				if (channel[1] == "this") {
  					join(to);
  					say(to, "You can find the Source of this bot at https://github.com/MTRNord/nordlab-hackerspace-door");
  				}
  			}
  			if (message == "!doorstatus") {
  				request.get('http://www.nordlab-ev.de/doorstate/status.txt', function (error, response, body) {
  					if (!error && response.statusCode == 200) {
  						/**
        				 * Content of status_page
        				 *
        				 * @property body
        				 * @type String
        				 */
  						door_status = body;
	      				console.log(body);
	      			} else {
	      				/**
        				 * Fired when an error occurs...
        				 *
        				 * @property error
        				 * @type String
        				 */
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
			     		say(from, "DoorStatus is: " + door_status);
          			}else{
            			say(from, "DoorStatus is not availible at this time");
          			}
        		}).setMaxListeners(0);
  			}
  			if (channel[0] + " " + channel[1] == "!doorstatus this") {
  				request.get('http://www.nordlab-ev.de/doorstate/status.txt', function (error, response, body) {
  					if (!error && response.statusCode == 200) {
  						/**
        				 * Content of status_page
        				 *
        				 * @property body
        				 * @type String
        				 */
  				  		door_status = body;
	      				console.log(body);
	      			} else {
	      				/**
        				 * Fired when an error occurs...
        				 *
        				 * @property error
        				 * @type String
        				 */
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
                        						join(channel[1]);
                        						say(channel[1], "DoorStatus is: " + door_status);
                      						}
                    					}
									}
                				});
              				} else {
                				say(from, "DoorStatus is: " + door_status);
              				}
            			} else {
              				join(to);
              				say(to, "DoorStatus is: " + door_status);
            			}
          			}else{
            			say(from, "DoorStatus is not availible at this time");
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
    					disconnect(disconnect_meassage);
    					process.exit();
    				}
    			}
    		}
    	})
  	},
	/**
 	* Updates the NickName
 	*
 	* @method ircNick
	*/
  	ircNick: function() {
		send('nick', botname);
  	}
};
