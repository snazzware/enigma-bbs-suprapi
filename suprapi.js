/* jslint node: true */
'use strict';

//	ENiGMA½
const MenuModule = require('../../core/menu_module.js').MenuModule;
const ViewController = require('../../core/view_controller.js').ViewController;
const StatLog = require('../../core/stat_log.js');
const User = require('../../core/user.js');
const stringFormat = require('../../core/string_format.js');

//	deps
const http = require('http');

exports.moduleInfo = {
	name: 'SupraPiModule',
	desc: 'SupraPiModule',
	author: 'snazzware',
	packageName: 'com.snazzware.enigma-bbs-suprapi'
};

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

			const self = this;
			const vc = self.viewControllers.allViews = new ViewController({
				client: self.client
			});

			var httpOptions = {
				host: self.config.host,
				port: self.config.port,
				path: '/?message=OK&led1=000000&led4=110000&netleds=1',
				method: 'GET'
			};

			if (self.config.connect !== undefined) {
				httpOptions.path = '/?message=CD&led1=110000&led4=110000&netleds=1';
			} else
			if (self.config.login !== undefined) {
				httpOptions.path = '/?message=' + self.client.user.username + '%20%20%20&led1=110000&led4=110000&netleds=1';
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
