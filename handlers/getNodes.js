/**
 * NodeHelper Module
 *
 * @module Main
 * @class getNodes
 * @submodule getNodes
 * @author Marcel Radzio
 */
//Load needed Features
var request = require('request')
//require('request-debug')(request);
var fs = require('fs');
var jsonfile = require('jsonfile')
var slack = require('./slack.js');
var _ = require("underscore");
/**
 * Get Community Config at start
 *
 * @property communities
 * @type String
 */
module.exports = {
  saveNodes: function () {
    request.get('https://cdn.rawgit.com/MTRNord/gluon-web-remote/5d0c3a2c49b79d2971b8b3cc24398d45833ad1c6/configs/communities.json', function (err, res, body) {

      if (!err && res.statusCode == 200) {
        /**
          * Content of communities
          *
          * @property communities
          * @type String
          */
       communities = body;
       if (!fs.existsSync("handlers/tmp")){
         fs.mkdirSync("handlers/tmp");
       }
       fs.writeFile("handlers/tmp/communities.json", communities, { flag: 'w' }, function(err) {
         if(err) {
           console.log(err);
           return err
        }
      });
     }else{
       /**
        * Fired when an error occurs...
        *
        * @property error
        * @type String
        */
        //TODO Add real Error Handler
        console.log(err);
        return err
        }
      })
    },
  countNodes: function (ccode_func, handler, TfromId, Tmsg, channel, bot, botan, IRCto) {
    jsonfile.readFile('handlers/tmp/communities.json', 'utf8', function (err,obj) {
      if (err) {
        return console.log(err);
      }
      var communities = obj
      _.find(communities.communities, function (key) {
        var ccode = key["ccode"];
        if (ccode.toLowerCase() === ccode_func.toLowerCase()) {
          var nodesFile_link = key["nodesURL"];
          var name = key["name"];
          request.get(nodesFile_link, function (err, res, body) {
            if (!err && res.statusCode == 200) {
              /**
                * Content of communities
                *
                * @property communities
                * @type String
                */
                // console.log(body);
                // onlineNodes = body.nodes.length
                // onlineNodes = Object.keys(body.nodes).length;
                var count = 0;
                nodes = JSON.parse(body)
                _.find(nodes.nodes, function (key) {
                  if (key.hasOwnProperty('flags')) {
                    if (key["flags"]["online"] == true) {
                      count++;
                    }
                    if (key.hasOwnProperty('status')) {
                      if (key["status"]["online"] == true) {
                        count++;
                      }
                    }
                  }
                });
                var output = "Current nodes in " + name + ": " + count
                if(handler === "telegram"){
                  bot.sendMessage(TfromId, output);
                  botan.track(Tmsg, 'nodes ' + ccode_func)
                }else {
                  if(handler === "irc"){
                    bot.say(IRCto, output);
                  }else {
                    if(handler === "slack"){
                      slack.slackSend(Schannel, output);
                    }
                  }
                }
           }else{
             /**
              * Fired when an error occurs...
              *
              * @property error
              * @type String
              */
              //TODO Add real Error Handler
              console.log(err);
              return err
              }
          })
        }
      });
    });
  }
}
