var request = require('request');
var curl = require('curlrequest');

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

      curl.request({ url: 'https://api.pushbullet.com/v2/pushes', method: 'POST', headers: { "Access-Token": 'Access-Token', "Content-Type": 'application/json' }, data: '{"channel_tag": "space-door", "body":"'+ door_status + '","title":"Door Status","type":"note"}'}, function (err, stdout, meta) {
        console.log(err);
        console.log('\n STDOUT: \n');
        console.log(stdout);
      });
    }
    console.log("WAIT!");
    sleep(9*1000);
    MakePush();
});
}
MakePush();
