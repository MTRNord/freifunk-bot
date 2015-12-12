var request = require('request');
var git = require('simple-git');
var schedule = require('node-schedule');
var argv = require('yargs').argv;
//LOAD MODULES DOWN HERE
var pushbullet = require('./handlers/pushbullet.js');
var irc = require('./handlers/irc.js');

//Constants
var SIGINT = "SIGINT";


function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}
console.log("Starting up...");
var door_status2 = "1";
irc.ircPreload();
function MakePush(){
request.get('http://www.nordlab-ev.de/doorstate/status.txt', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      door_status = body;
      //console.log(body);
    }else{
      door_status = error;
      //console.log(error);
    }
    // console.log("Current Real State:" + door_status + "\n");
    // console.log("Current Last State:" + door_status2 + "\n");
    // console.log("Next Check!");
    if (door_status2 !== door_status){
      if (door_status2 !== "1") {
        door_status2 = door_status;
        if (door_status == "geschlossen"){
          door_status = "closed";
        }else{
          door_status = "open";
        }
        //ADD MODULE RUNTIMES DOWN HERE
        pushbullet.pushbulletSend(door_status);
        irc.ircSend(door_status);
      }else{
        door_status2 = door_status;
      }
    }
    // console.log("WAIT!");
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
    setTimeout(function() { MakePush(); }, 10000);
}).setMaxListeners(0);
}
irc.ircBotCommands();
if (!argv.noupdate) {
  var j = schedule.scheduleJob('* 2 * * *', function(){
    console.log('Start Update!');
    bot.ircEndCustom('Start update! Coming back in a few Seconds!');
    git.pull(function(err, update) {
      if(update && update.summary.changes) {
        require('child_process').exec('npm restart');
      }
    });
  });
}
if (argv.noupdate) {
  var j = schedule.scheduleJob('* 2 * * *', function(){
    console.log('Daily restart!');
    bot.ircEndCustom('Daily restart! Coming back in a few Seconds!');
    require('child_process').exec('npm restart');
  });
}
setTimeout(function() { MakePush(); }, 20000);
