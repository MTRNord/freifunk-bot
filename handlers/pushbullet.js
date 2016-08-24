/**
 * Pushbullet Module
 * 
 * @module Main
 * @submodule pushbullet
 * @author Marcel Radzio
 */

//Load needed Features
var curl = require('curlrequest');

module.exports = {
	/**
	 * Send Status on change to Pushbullet Channel
	 * @class pushbullet
 	 * @constructor
	 */
	var token = process.env.pushbullet_api
	pushbulletSend: function (door_status){
		curl.request({ url: 'https://api.pushbullet.com/v2/pushes', method: 'POST', headers: { "Access-Token": 'token', "Content-Type": 'application/json' }, data: '{"channel_tag": "space-door", "body":"'+ door_status + '","title":"Door Status","type":"note"}'}, function (err, stdout, meta) {
			if (err){
				/**
        		 * Fired when an error occurs...
        		 *
        		 * @property err
        		 * @type String
        		 */
				console.log(err);
			}
		});
	}
};
