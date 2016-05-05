//TOKEN     165809140:AAEEpJP4hgcEsf6ry1Vd6Lp0_8rfRrXFB3A
var token = '165809140:AAEEpJP4hgcEsf6ry1Vd6Lp0_8rfRrXFB3A';
var TelegramBot = require('node-telegram-bot-api');
var jsonfile = require('jsonfile')
var getNodes = require('./getNodes.js');
var botan = require('botanio')("H4dyFijDsUeCfwvMe-_nDuzdOYFyo_SR");
var ent = require('ent');
var decode = require('ent/decode');
var util = require('util');
// Setup polling way
var bot = new TelegramBot(token, {polling: true});
module.exports = {
  start: function () {
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
        botan.track(msg, 'communities', function (err, res, body) {
          if (err) {
            console.log("[BOTAN] ERR: " + err);
          }
          console.log("[BOTAN] RES: " + res.statusCode);
          console.log("[BOTAN] BODY: " + util.inspect(body, {showHidden: false, depth: null}));
        });
        bot.sendMessage(fromId, communities_list);
      });
    });
  }
}
