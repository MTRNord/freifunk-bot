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
		bot.connect(5, function() {
    		bot.send('msg', 'NickServ identify DoorBot');
			bot.say('#hackerspace', 'Door Bot is starting to watch on the Door Status');
		});
		
	},
	ircSend: function (door_status){
		bot.connect(5, function() {
    		bot.send('say', 'Door Status changed to: ' + door_status);
		});
		
	}
};