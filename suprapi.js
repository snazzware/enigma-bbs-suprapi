/* jslint node: true */
'use strict';

//	ENiGMA½
const MenuModule = require('../../core/menu_module.js').MenuModule;
const events = require('../../core/events.js');

//	deps
const http = require('http');

exports.moduleInfo = {
	name: 'SupraPiModule',
	desc: 'SupraPiModule',
	author: 'snazzware',
	packageName: 'com.snazzware.enigma-bbs-suprapi'
};

exports.registerEvents = function() {
    events.on('codes.l33t.enigma.system.connect', function(args) {
        console.info('connect event received!');
        console.info('term is '+args.client.term.env.TERM+' at '+args.client.term.env.COLUMNS+'x'+args.client.term.env.ROWS);
    });
}

exports.getModule = class SupraPiModule extends MenuModule {
	constructor(options) {
		super(options);

		this.config = options.menuConfig.options;
	}

	mciReady(mciData, cb) {
		super.mciReady(mciData, err => {
			if (err) {
				return cb(err);
			}

			var httpOptions = {
				host: this.config.host,
				port: this.config.port,
				path: '/?message=OK&led1=000000&led4=110000&netleds=1',
				method: 'GET'
			};

			if (this.config.connect !== undefined) {
				httpOptions.path = '/?message=CD&led1=110000&led4=110000&netleds=1';
			} else
			if (this.config.login !== undefined) {
				httpOptions.path = '/?message=' + this.client.user.username + '%20%20%20&led1=110000&led4=110000&netleds=1';
			} else {
				httpOptions.path = '/?matrix=1';
			}

			http.request(httpOptions, function(res) {
				res.setEncoding('utf8');
				res.on('data', function(chunk) {
					// todo
				});
			}).end();

			return cb(err);
		});
	}
};
