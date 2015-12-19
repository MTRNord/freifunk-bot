var curl = require('curlrequest');
module.exports = {
	pushbulletSend: function (door_status){
		curl.request({ url: 'https://api.pushbullet.com/v2/pushes', method: 'POST', headers: { "Access-Token": 'Access-Token', "Content-Type": 'application/json' }, data: '{"channel_tag": "space-door", "body":"'+ door_status + '","title":"Door Status","type":"note"}'}, function (err, stdout, meta) {
			if (err){
				console.log(err);
			}
		});
	}
};