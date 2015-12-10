var irc = require('irc');
module.exports = {
	ircPreload: function (){
		var bot = new irc.Client('irc.lugfl.de', 'DoorBot', {
			debug: true,
			channels: ['#hackerspace']
		});
		bot.addListener('error', function(message) {
    		console.log('error: ', message);
		});
	},
	ircSend: function (door_status){
		bot.say('#hackerspace', 'Door Status changed to: ');
	}
};