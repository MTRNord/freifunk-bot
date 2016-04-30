/**
 * Slack-ChatBot Module
 *
 * @module Main
 * @class slack
 * @submodule slack
 * @author Marcel Radzio
 */
//Load needed Features
var command_config = require("../configs/commands.json");
var params_config = require("../configs/slackServer.json");
var SlackBot = require('slackbots');
var S = require('string');

//Set Params
/**
 * Param Botname
 *
 * @property botname
 * @type String
 */
var botname = params_config["botname"];
/**
 * Param disconnect_meassage
 *
 * @property disconnect_meassage
 * @type String
 */
var disconnect_meassage = params_config["disconnect_meassage"];
var session;
for (var key in params_config["servers"]) {
  if (params_config["servers"].hasOwnProperty(key)) {
    var serveraddress = params_config["servers"][key]["serveraddress"];
    var devChannel = params_config["servers"][key]["devChannel"];
    var token = params_config["servers"][key]["token"];
    var active = params_config["servers"][key]["active"];
    var debug = params_config["servers"][key]["debug"];// create a bot
    var bot = new SlackBot({
      token: token,
      name: 'FreifunkBot'
    });
  }
}
function getDateTime() {
    var date = new Date();
    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;
    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;
    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;
    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;
    return day + "." + month + "." + year + "  "  + hour + ":" + min + ":" + sec;
}
module.exports = {
  /**
 	* Connects to Server
 	*
 	* @method slackPreload
	*/
	slackPreload: function () {
	},
  slackSend: function (channel, message) {
    bot.postMessage(channel, message)
  }
}

// more information about additional params https://api.slack.com/methods/chat.postMessage
var params = {
    icon_emoji: ':cat:'
};

bot.on('start', function() {
    // define existing username instead of 'user_name'
    bot.postMessageToUser('mtrnord', 'Starting at ' + getDateTime() + '!', params);
});
bot.on('message', function(data) {
    // all ingoing events https://api.slack.com/rtm
    console.log(data);
    var textmessage = data["text"];
    var channel = data["channel"];
    var subtype = data["subtype"];
    if (textmessage != null){
      textmessage = textmessage.toLowerCase();
    }
    // if (S(textmessage).contains('!help')) {
    //   console.log(channel);
    //   bot.postMessage(channel, 'help!', params);
    // }
    for (var key in command_config["commands"]) {
      if (command_config["commands"].hasOwnProperty(key)) {
        if (subtype != "bot_message"){
          if (S(textmessage).contains("!" + command_config["commands"][key]["keyword"])) {
            bot.postMessage(channel, command_config["commands"][key]["message"], params);
          }else {
            console.log("");
          }
        }
      }
    }
});
