var request = require('request');
//LOAD MODULES DOWN HERE
var pushbullet = require('./handlers/pushbullet.js');
var irc = require('./handlers/irc.js');


function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}
var door_status2 = "1";
function MakePush(){
request.get('http://www.nordlab-ev.de/doorstate/status.txt', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var door_status = body;
      //console.log(body);
    }else{
      var door_status = error;
      //console.log(error);
    }
    console.log("Current Real State:" + door_status + "\n");
    console.log("Current Last State:" + door_status2 + "\n");
    console.log("Next Check!");
    if (door_status2 !== door_status){
      door_status2 = door_status;
      if (door_status == "geschlossen"){
        door_status = "closed";
      }else{
        door_status = "open";
      }
      //ADD MODULE RUNTIMES DOWN HERE
      pushbullet.pushbulletSend(door_status);
      //irc.ircSend(door_status);
    }
    console.log("WAIT!");
    sleep(9*1000);
    MakePush();
});
}
MakePush();
