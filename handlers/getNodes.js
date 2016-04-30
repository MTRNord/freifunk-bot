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
/**
 * Get Community Config at start
 *
 * @property communities
 * @type String
 */
module.exports = {
  saveNodes: function () {
    request.get('http://cdn.rawgit.com/MTRNord/gluon-web-remote/develop/configs/communities.json', function (err, res, body) {

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
      for (var key in communities.communities) {
        if (communities.communities.hasOwnProperty(key)) {
          var ccode = communities.communities[key]["ccode"];
          if (ccode.toLowerCase() === ccode_func.toLowerCase()) {
            var nodesFile_link = communities.communities[key]["nodesURL"];
            var name = communities.communities[key]["name"];
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
                  for(var key in JSON.parse(body).nodes) {
                    if(JSON.parse(body).nodes.hasOwnProperty(key)) {
                      if (JSON.parse(body).nodes[key].hasOwnProperty('flags')) {
                        if (JSON.parse(body).nodes[key]["flags"]["online"] == true) {
                          count++;
                        }
                      }
                        if (JSON.parse(body).nodes[key].hasOwnProperty('status')) {
                          if (JSON.parse(body).nodes[key]["status"]["online"] == true) {
                            count++;
                          }
                        }
                    }
                  }
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
        }
      }
    });
  }
}
