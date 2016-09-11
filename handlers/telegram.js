var telegram_token = process.env.telegram_api
if (typeof telegram_token === 'undefined' && !telegram_token) {
  console.log("No Telegram token defined")
}
var botan_token = process.env.botan_api
if (typeof botan_token === 'undefined' && !botan_token) {
  console.log("No Botan token defined")
}
var TelegramBot = require('node-telegram-bot-api');
var jsonfile = require('jsonfile')
var getNodes = require('./parseNodes.js');
var botan = require('botanio')(botan_token);
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
            if (err) {throw new Error(err);}
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
      node: function (callback) {
        bot.onText(/\/node (.+)/, function (msg, match) {
          var fromId = msg.chat.id;
          var resp = match[1];
          var args = _.split(resp, ' ');
          bot.sendChatAction(fromId, "typing")
          jsonfile.readFile('handlers/tmp/communities.json', 'utf8', function (err,obj) {
            if (err) {throw new Error(err);}
            var communities = obj
            _.find(communities.communities, function (key) {
                var ccode = key["ccode"];
                if (ccode.toLowerCase() === args[0].toLowerCase()) {
                  getNodes.NodeInfo(args[0].toLowerCase(), args[1].toLowerCase(), "telegram", fromId, msg, "", bot, botan)
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
                var ccode = key["ccode"]
                var name = key["name"]
                communities_list = communities_list + name + ": " + ccode + "\n"
            });
            botan.track(msg, 'communities', function (err, res, body) {
              if (err) {
                throw new Error("[BOTAN] ERR: " + err);
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
        throw new Error(err)
      }
    }
    );
  }
}
