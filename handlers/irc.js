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
var S = require('string');
var jsonfile = require('jsonfile')
var async = require("async");
var _ = require("lodash");
var rl = require("readline")


var command_config = require("../configs/commands.json");
var params_config = require("../configs/ircServer.json");
var getNodes = require('./getNodes.js');

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
_.find(params_config["servers"], function (key) {
  serveraddress = key["serveraddress"];
  main_channel = key["main_channel"];
  active = key["active"];
  debug = key["debug"];
  if (debug == false) {
    console = console || {};
    console.log = function(){};
  }
  if (active === 1) {
    bot[key] = new irc.Client(serveraddress, botname, {
      debug: debug,
      channels: [main_channel],
      autoRejoin: true,
      autoConnect: false,
      messageSplit: 1000000,
      floodProtection: true,
      floodProtectionDelay: 1000
    });
    clients.push(bot[key]);
  }
});

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
function list(event, callback) {
  clients.forEach(function(client) {
    client.list(event, callback);
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
      _.find(params_config["servers"], function (key) {
        /**
        * Password for the NickServ
        *
        * @property nickserv_pass
        * @type String
        */
        var nickserv_pass = key["nickserv_pass"];
        say('NickServ', 'identify ' + nickserv_pass);
      });
		});
		setTimeout(function() {
			console.log("wait 7sek");
		}, 7000);
		connect(10, function() {
			send('nick', botname);
			_.find(params_config["servers"], function (key) {
  			/**
				 * Password for the NickServ
				 *
			   * @property nickserv_pass
			   * @type String
				*/
    		var nickserv_pass = key["nickserv_pass"];
    		/**
				 * Main Channel of the Bot
				 *
			   * @property main_channel
			   * @type String
				*/
    		var main_channel = key["main_channel"];
    		say('NickServ', 'identify ' + nickserv_pass);
    		join(main_channel);
		  });
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
		_.find(params_config["servers"], function (key) {
      /**
        * Main Channel of the Bot
        *
		    * @property main_channel
		    * @type String
        */
  		var main_channel = key["main_channel"];
  		say(main_channel, 'Door Status changed to: ' + door_status);
  		say("#freifunk-flensburg", 'Door Status changed to: ' + door_status);
    });
    	//send('topic','#hackerspace "Hackerspace Flensburg - Treffen jeden Montag 18:00 Uhr im Offenen Kanal Flensburg! - Tür Status"' + door_status);
    	//console.log("IRC Door Status Chnaged");
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
      async.auto({
        commandFile: function (callback) {
          _.find(command_config["commands"], function (key) {
            if (S(message).contains("!" + key["keyword"])) {
              if (key["before"] === "from") {
      					if (key["target"] === "from") {
      						say(from, from + key["message"]);
      					} else {
      						say(to, from + key["message"]);
      					}
      				} else {
      					if (!key["before"]) {
      						if (key["target"] === "from") {
      							say(from, key["message"]);
      						} else {
      							say(to, key["message"]);
      						}
      					} else {
      						if (key["target"] === "from") {
      							say(from, to + key["message"]);
      						} else {
      							say(to, to + key["message"]);
      						}
      					}
      				}
      			}
      		});
        },
        channelList: function (callback) {
  		    /**
            * List of Channels on Server
            *
            * @property channel
            * @type Array
            *
            * @beta
            */
  		    channel = message.split(" ");
  		    channel = cleanArray(channel);
  		    if (S(channel[0] + " " + channel[1]).contains("!source this")) {
            console.log("!source " + channel[1]);
            if (channel[1] === "this") {
              join(to);
              say(to, "You can find the Source of this bot at https://github.com/MTRNord/nordlab-hackerspace-door");
            }
          }
        },
        nodes: function (callback) {
          if (S(message).contains("!nodes")) {
            jsonfile.readFile('handlers/tmp/communities.json', 'utf8', function (err,obj) {
              if (err) {console.log(err)}
              var communities = obj
              _.find(communities.communities, function (key) {
                var ccode = key["ccode"];
                if (ccode.toLowerCase() === channel[1]) {
                  clients.forEach(function(client) {
                    getNodes.countNodes(channel[1], "irc", "", "", "", client, "", to)
                  });
                }
              });
            });
          }
        },
        communities: function (callback) {
          if (S(message).contains("!communities")) {
            jsonfile.readFile('handlers/tmp/communities.json', 'utf8', function (err,obj) {
              if (err) {console.log(err)}
              var communities = obj
              var communities_list = ""
              _.find(communities.communities, function (key) {
                var ccode = key["ccode"]
                var name = key["name"]
                say(from, name + ": " + ccode + "  ")
              });
            })
          }
        },
        doorstatus: function (callback) {
      		if (S(message).contains("!doorstatus")) {
      			request.get('http://www.nordlab-ev.de/doorstate/status.txt', function (error, response, body) {
      			 if (!error && response.statusCode === 200) {
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
              if (!error && response.statusCode === 200) {
    	      	  if (door_status === "geschlossen") {
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
        },
        doorstatusThis: function (callback) {
      		if (S(channel[0] + " " + channel[1]).contains("!doorstatus this")) {
      			request.get('http://www.nordlab-ev.de/doorstate/status.txt', function (error, response, body) {
      				if (!error && response.statusCode === 200) {
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
    	      	  if (door_status === "geschlossen") {
                  door_status = "closed";
    	      	  } else {
    	      		 	door_status = "open";
    	      	  }
                console.log(message);
                list();
                console.log(channel[(channel.length-(channel.length-1))+1]);
                console.log(channel.length);
                if (channel[1] !== "this") {
                  if (channel[1] !== " ") {
                    addListener('channellist', function (channel_list) {
                      _.find(channel_list, function (key) {
                        if (key["name"] === channel[1]) {
                          join(channel[1]);
                          say(channel[1], "DoorStatus is: " + door_status);
                        }
    								  });
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
        },
        kill: function (callback) {
          if (S(message).contains("!kill")) {
            if ((from === "DasNordlicht") || (from === "MTRNord")) {
              console.log(from + ' => ' + to + ': ' + message);
        		  if (process.platform === "win32") {
        				rl.createInterface({
        					input: process.stdin,
        					output: process.stdout
        				});
        				disconnect(disconnect_meassage);
        				process.exit();
        			}
        		}
        	}
        },
        join: function (callback) {
          if (S(message).contains("!join")) {
            if ((from === "DasNordlicht") || (from === "MTRNord")) {
              console.log(from + ' => ' + to + ': ' + message);
              join(channel[1]);
            }
          }
        }
      },
      function(err, result) {
        if (err) {
          console.log(err)
        }
      }
    );
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