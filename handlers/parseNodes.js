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
//var slack = require('./slack.js');
var _ = require("lodash");
/**
 * Get Community Config at start
 *
 * @property communities
 * @type String
 */
module.exports = {
  saveNodes: function () {
    request.get('https://cdn.rawgit.com/MTRNord/gluon-web-remote/01677d6f/configs/communities.json', function (err, res, body) {
      if (!err && res.statusCode === 200) {
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
        if (ccode.toLowerCase() == ccode_func.toLowerCase()) {
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
              var count = 0;
              nodes = JSON.parse(body)
              _.find(nodes.nodes, function (key) {
                if (key.hasOwnProperty('flags')) {
                  if (key["flags"]["online"] == true) {
                    count++;
                  }
                }
                if (key.hasOwnProperty('status')) {
                  if (key["status"]["online"] == true) {
                    count++;
                  }
                }
              });
              var output = "Current nodes in " + name + ": " + count
              if(handler == "telegram"){
                bot.sendMessage(TfromId, output)
                botan.track(Tmsg, 'nodes ' + ccode_func)
              }else {
                if(handler == "irc"){
                  bot.say(IRCto, output);
                }else {
                  //if(handler == "slack"){
                    //slack.slackSend(Schannel, output);
                  //}
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
              throw new Error(err);
            }
          })
        }
      });
    });
  },
  NodeInfo: function (ccode_func, askedNode, handler, TfromId, Tmsg, channel, bot, botan, IRCto) {
    jsonfile.readFile('handlers/tmp/communities.json', 'utf8', function (err,obj) {
      if (err) {
        throw new Error(err);
      }
      var communities = obj
      _.find(communities.communities, function (key) {
        var ccode = key["ccode"];
        if (ccode.toLowerCase() == ccode_func.toLowerCase()) {
          var nodesFile_link = key["nodesURL"];
          request.get(nodesFile_link, function (err, res, body) {
            if (!err && res.statusCode == 200) {
              /**
                * Content of communities
                *
                * @property communities
                * @type String
                */
              var count = 0;
              nodes = JSON.parse(body)
              var output = "Some error"
              var name = ""
              var router = ""
              var version = ""
              var autoupdate = ""
              var autoupdateBranch = ""
              var clients = ""
              var status = ""
              var since = ""
              _.find(nodes.nodes, function (key) {
                name = key["nodeinfo"]["hostname"]
                if (name.toLowerCase() == askedNode.toLowerCase()){
                  router = key["nodeinfo"]["hardware"]["model"]
                  version = key["nodeinfo"]["software"]["firmware"]["release"]
                  autoupdate = key["nodeinfo"]["software"]["autoupdater"]["enabled"]
                  if (autoupdate === true) {
                    autoupdate = "active"
                  }else{
                    autoupdate = "unactive"
                  }
                  autoupdateBranch = key["nodeinfo"]["software"]["autoupdater"]["branch"]
                  clients = key["statistics"]["clients"]
                  status = key["flags"]["online"]
                  since = key["firstseen"]
                  if(handler == "telegram"){
                    output = "<b>Name: </b>" + name + "\n<b>Router Model: </b>" + router + "\n<b>Firmware Version: </b>" + version + "\n<b>Autoupdater Status: </b>" + autoupdate + "\n<b>Autoupdater Branch: </b>" + autoupdateBranch + "\n<b>Clients Connected: </b>" + clients + "\n<b>Online Status: </b>" + status + "\n<b>First Seen: </b>" + since
                  }
                  if(handler == "irc"){
                    output = "Name: " + name + "\nRouter Model: " + router + "\nFirmware Version: " + version + "\nAutoupdater Status: " + autoupdate + "\nAutoupdater Branch: " + autoupdateBranch + "\nClients Connected: " + clients + "\nOnline Status: " + status + "\nFirst Seen: " + since
                  }
                  //if(handler == "slack"){
                    //output = "<b>Name: </b>" + name + "\n<b>Router Model: </b>" + router + "\n<b>Firmware Version: </b>" + version + "\n<b>Autoupdater Status: </b>" + autoupdate + "\n<b>Autoupdater Branch: </b>" + autoupdateBranch + "\n<b>Clients Connected: </b>" + clients + "\n<b>Online Status: </b>" + status + "\n<b>First Seen: </b>" + since
                  //}
                }
              });
              if (askedNode.toLowerCase() !== "noarg") {
                if(handler == "telegram"){
                  bot.sendMessage(TfromId, output, {"parse_mode": "HTML"})
                  botan.track(Tmsg, 'node ' + ccode_func + " " + askedNode.toLowerCase())
                }
                if(handler == "irc"){
                  bot.say(IRCto, output);
                }
                //if(handler == "slack"){
                  //slack.slackSend(Schannel, output);
                //}
              }
            }else{
              /**
                * Fired when an error occurs...
                *
                * @property error
                * @type String
                */
              //TODO Add real Error Handler
              throw new Error(err);
            }
          })
        }
      });
    });
  }
}
