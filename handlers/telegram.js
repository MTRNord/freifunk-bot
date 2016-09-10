var telegram_token = process.env.telegram_api
if (typeof telegram_token == 'undefined' && !telegram_token) {
  console.log("No Telegram token defined")
}
var botan_token = process.env.botan_api
if (typeof botan_token == 'undefined' && !botan_token) {
  console.log("No Botan token defined")
}
var TelegramBot = require('node-telegram-bot-api');
var jsonfile = require('jsonfile')
var getNodes = require('./getNodes.js');
var botan = require('botanio')(botan_token);
var ent = require('ent');
var decode = require('ent/decode');
var util = require('util');
var async = require("async");
var _ = require("lodash");
// Setup polling way
var bot = new TelegramBot(telegram_token, {polling: true});
module.exports = {
  start: function () {
    async.auto({
      nodes: function (callback) {
        bot.onText(/\/nodes (.+)/, function (msg, match) {
          var fromId = msg.chat.id;
          var resp = match[1];
          bot.sendChatAction(fromId, "typing")
          jsonfile.readFile('handlers/tmp/communities.json', 'utf8', function (err,obj) {
            var communities = obj
            _.find(communities.communities, function (key) {
                var ccode = key["ccode"];
                if (ccode.toLowerCase() === resp.toLowerCase()) {
                  getNodes.countNodes(resp.toLowerCase(), "telegram", fromId, msg, "", bot, botan)
                }
            });
          });
        });
        callback()
      },
      communities: function (callback) {
        bot.onText(/\/communities/, function (msg, match) {
          var fromId = msg.chat.id;
          var resp = match[1];
          bot.sendChatAction(fromId, "typing")
          jsonfile.readFile('handlers/tmp/communities.json', 'utf8', function (err,obj) {
            var communities = obj
            var communities_list = ""
            _.find(communities.communities, function (key) {
                var ccode = decode(key["ccode"])
                var name = decode(key["name"])
                communities_list = communities_list + name + ": " + ccode + "\n"
            });
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
        callback()
      }
    },
    function(err, result) {
      if (err) {
        console.log(err)
      }
    }
    );
  }
}
