var request = require('request');
var curl = require('curlrequest');
request.get('http://www.nordlab-ev.de/doorstate/status.txt', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var door_status = body;
      //console.log(body);
    }else{
      var door_status = error;
      //console.log(error);
    }
    console.log(door_status);
    if (door_status == "geschlossen"){
      door_status = "closed";
    }else{
      door_status = "open";
    }

  curl.request({ url: 'https://api.pushbullet.com/v2/pushes', method: 'POST', headers: { "Access-Token": 'v1TpGyUfIoydWW1KZa4KWfjmMcfnDYyTdGuju3ZH58Y7E', "Content-Type": 'application/json' }, data: '{"channel_tag": "space-door", "body":"'+ door_status + '","title":"Door Status","type":"note"}'}, function (err, stdout, meta) {
    console.log(err);
    console.log('\n STDOUT: \n');
    console.log(stdout);
  });


});
