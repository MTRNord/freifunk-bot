var irc = require('irc');
module.exports = {
	ircPreload: function (){
		var bot = new irc.Client('irc.lugfl.de', 'DoorBot', {
			debug: true,
			channels: ['#hackerspace'],
			messageSplit: 1000000
		});
		bot.addListener('error', function(message) {
    		console.log('error: ', message);
		});
		bot.say('#hackerspace', 'Door Bot is starting to watch on the Door Status');
	},
	ircSend: function (door_status){
		bot.say('#hackerspace', 'Door Status changed to: ');
	}
};