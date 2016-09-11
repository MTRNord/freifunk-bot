/**
 * Main-functionality for handling the Modules :)
 *
 * @main Main
 * @module Main
 * @author Marcel Radzio
 */
//Load needed Features
var request = require('request');
var git = require('simple-git');
var schedule = require('node-schedule');
var argv = require('yargs').argv;
var params_config = require("./configs/ircServer.json");
var autoupdate = params_config["autoupdate"];
var async = require("async");
var _ = require("lodash");
var child = require('child_process')

//LOAD MODULES DOWN HERE
require('./helper/heroku.js');
var pushbullet = require('./handlers/pushbullet.js');
var irc = require('./handlers/irc.js');
var slack = require('./handlers/slack.js');
var getNodes = require('./handlers/parseNodes.js');
var telegram = require('./handlers/telegram.js');

//Constants
var SIGINT = "SIGINT";
var door_status2 = "1";


/**
 * Get door-status from the Web
 *
 * @class GetData
 * @return {String} Door Status
 */
function GetData(){
  /**
   * Actual pulled Door Status
   *
   * @property door_status
   * @type String
   */
	request.get('http://www.nordlab-ev.de/doorstate/status.txt', function (error, response, body) {
    	if (!error && response.statusCode === 200) {
    		/**
         * Content of status_page
         *
         * @property body
         * @type String
         */
      	door_status = body;
    	}else{
        /**
         * Fired when an error occurs...
         *
         * @property error
         * @type String
         */
    		//TODO Add real Error Handler
      		door_status = error;
          throw new Error(err)
   		}
   		//If no error -> go on
    	if (!error && response.statusCode === 200) {
      		if (door_status2 !== door_status){
      			//Handle first run
        		if (door_status2 !== "1") {
              /**
               * Save Old Door Status
               *
               * @property door_status2
               * @type String
               */
          			door_status2 = door_status;
          			//Translate var's
         			if (door_status === "geschlossen"){
            		door_status = "closed";
         			}else{
            		door_status = "open";
          		}

          		//ADD MODULES DOWN HERE
          		//Call Module send/main Functions
          		pushbullet.pushbulletSend(door_status);
          		//irc.ircSend(door_status);
              return door_status;

        		}else{
        			//Save Last Status
          			door_status2 = door_status;
                return door_status;
        		}
      		}
    	}
    }).setMaxListeners(0);
	//Rerun Function after 10 seconds
	setTimeout(function() {}, 10000);
}
//Handle "[CTRL]+[C]"
if (process.platform === "win32") {
	var rl = require("readline").createInterface({
		input: process.stdin,
		output: process.stdout
	}).setMaxListeners(0);
	rl.on(SIGINT, function () {
		process.emit(SIGINT);
	}).setMaxListeners(0);
}
process.on(SIGINT, function () {
	irc.ircStopp();
	process.exit();
}).setMaxListeners(0);

/**
 * Update - Pull last master from Github
 *
 * @method update
 */
function update(){
  git.pull("origin", "master", function(err, update) {
    if (err) {throw new Error(err)}
    if(update && update.summary.changes) {
      console.log('Start Update!');
      restart();
    }
  });
}

/**
 * Restart - Restart the Bot completly
 *
 * @method restart
 */
function restart(){
  console.log('Daily restart!');
  irc.ircEndCustom('Restart! Coming back in a few Seconds!');
  child.exec('npm restart');
}

// var j = schedule.scheduleJob('59 3 * * *', function(){
//   if (!argv.noupdate && autoupdate == 1) {
//     //Run update at 3am and 59min
//     update();
//   }else{
//     restart();
//   }
// });

//Startup
async.auto({
    ircPreload: function (callback) {
      // callback has to be called by `uploadImage` when it's done
      irc.ircPreload(callback)
    },
    ircBotCommands: function (callback) {
      //Activate IRC-Bot Command Handler
      irc.ircBotCommands(callback)
    },
    saveNodes: function (callback) {
      getNodes.saveNodes(callback)
    },
    telegramStart: function (callback) {
      telegram.start(callback)
    },
    GetData: function (callback) {
      async.forever(
        function(next) {
          GetData()
          callback(next)
        },
        function(err) {
          // if next is called with a value in its first parameter, it will appear
          // in here as 'err', and execution will stop.
          callback(err)
        }
      );
    }
  },
  function(err, result) {
    if (err) {
      console.log(err)
    }
  }
);