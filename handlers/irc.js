var irc = require('irc');
module.exports = {
	ircSend: function (door_status){
		var config = {
			channels: ["#hackerspace"],
			server: "irc.lugfl.de",
			botName: "DoorBot"
		};
		var bot = new irc.Client(config.server, config.botName, {
			channels: config.channels
		});
		bot.say('#hackerspace', "Door Staus changed to: " + door_status);
	}
};