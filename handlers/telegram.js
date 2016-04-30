//TOKEN     165809140:AAEEpJP4hgcEsf6ry1Vd6Lp0_8rfRrXFB3A
var token = '165809140:AAEEpJP4hgcEsf6ry1Vd6Lp0_8rfRrXFB3A';
var TelegramBot = require('node-telegram-bot-api');
var jsonfile = require('jsonfile')
var async = require('async')
var getNodes = require('./getNodes.js');
var fs = require('fs')
var botan = require('botanio')(token);
var ent = require('ent');
var decode = require('ent/decode');
// Setup polling way
var bot = new TelegramBot(token, {polling: true});
module.exports = {
  start: function () {
    // Matches /echo [whatever]
    bot.onText(/\/echo (.+)/, function (msg, match) {
      var fromId = msg.from.id;
      var resp = match[1];
      bot.sendMessage(fromId, resp);
    });

    bot.onText(/\/nodes (.+)/, function (msg, match) {
      var fromId = msg.chat.id;
      var resp = match[1];
      bot.sendChatAction(fromId, "typing")
      jsonfile.readFile('handlers/tmp/communities.json', 'utf8', function (err,obj) {
        var communities = obj
        for (var key in communities.communities) {
          if (communities.communities.hasOwnProperty(key)) {
            var ccode = communities.communities[key].ccode;
            if (ccode.toLowerCase() === resp.toLowerCase()) {
              getNodes.countNodes(resp.toLowerCase(), "telegram", fromId, msg, "", bot, botan)
            }
          }
        }
      });
    });
    bot.onText(/\/communities/, function (msg, match) {
      var fromId = msg.chat.id;
      var resp = match[1];
      bot.sendChatAction(fromId, "typing")
      jsonfile.readFile('handlers/tmp/communities.json', 'utf8', function (err,obj) {
        var communities = obj
        var communities_list = ""
        for (var key in communities.communities) {
          if (communities.communities.hasOwnProperty(key)) {
            var ccode = decode(communities.communities[key].ccode)
            var name = decode(communities.communities[key].name)
            communities_list = communities_list + name + ": " + ccode + "\n"
          }
        }
        bot.sendMessage(fromId, communities_list);
        botan.track(msg, 'communities');
      });
    });
  }
}
