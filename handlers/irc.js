var irc = require('irc');
module.exports = {
	ircSend: function (door_status){
		var bot = new irc.Client('irc.lugfl.de', 'DoorBot', {
			debug: true,
			channels: ['#hackerspace']
		});
		bot.addListener('error', function(message) {
    		console.log('error: ', message);
		});
		bot.say('#hackerspace', "Door Staus changed to: " + door_status);
	}
};