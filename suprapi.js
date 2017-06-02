/* jslint node: true */
'use strict';

//	ENiGMA½
const MenuModule		= require('../../core/menu_module.js').MenuModule;
const ViewController	= require('../../core/view_controller.js').ViewController;
const StatLog			= require('../../core/stat_log.js');
const User				= require('../../core/user.js');
const stringFormat		= require('../../core/string_format.js');

//	deps
const moment			= require('moment');
const async				= require('async');
const _					= require('lodash');
const http              = require('http');

/*
	Available listFormat object members:
	userId
	userName
	location
	affiliation
	ts

*/

exports.moduleInfo = {
	name		: 'SupraPiModule',
	desc		: 'SupraPiModule',
	author		: 'snazzware',
	packageName	: 'com.snazzware.suprapimodule'
};

exports.getModule = class SupraPiModule extends MenuModule {
	constructor(options) {
		super(options);

        this.config = options.menuConfig.options;
        console.log(options);
        console.log('a');
	}

	mciReady(mciData, cb) {
		super.mciReady(mciData, err => {
			if(err) {
				return cb(err);
			}

			const self		= this;
			const vc		= self.viewControllers.allViews = new ViewController( { client : self.client } );
            console.log('b');
			async.series(
				[
					function notifySupraPiModem(callback) {
                        var httpOptions = {};

			if (self.config.connect !== undefined) {
    						httpOptions = {
    						  host: '192.168.1.120',
    						  port: 80,
    						  path: '/?message=CD&led1=110000&led4=110000&netleds=1',
    						  method: 'GET'
    						};
                        } else 
                        if (self.config.login !== undefined) {
    						httpOptions = {
    						  host: '192.168.1.120',
    						  port: 80,
    						  path: '/?message=' + self.client.user.username + '%20%20%20&led1=110000&led4=110000&netleds=1',
    						  method: 'GET'
    						};
                        } else {
                            httpOptions = {
    						  host: '192.168.1.120',
    						  port: 80,
    						  path: '/?matrix=1',
    						  method: 'GET'
    						};
                        }

                        console.log(httpOptions);

						http.request(httpOptions, function(res) {
						  res.setEncoding('utf8');
						  res.on('data', function (chunk) {
                              console.log('received data');
						  });
						}).end();

						return callback(null);
					}
				],
				function complete(err) {
					if(err) {
						self.client.log.error( { error : err.message }, 'Error loading SupraPiModule');
					}
					return cb(err);
				}
			);
		});
	}
};

