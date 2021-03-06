/* jshint unused: false */
'use strict';

var errorHandler = require('errorhandler'),
	app = require('../index'),
	config = require('../../config');

module.exports = function() {
	var logger = app.get('logger') || console;
	return app.get('env') === 'production' ?
	// return app.get('env') === 'development' ?
		function(err, req, res, next) {
			var msg = err.stack;
			if (err.mod) msg = '[' + err.mod + '] ' + msg;
			logger.error('[ERROR] -- ' + msg);

			if (err.status) res.statusCode = err.status;
			if (res.statusCode < 400) {
				res.statusCode = 500;
			}

			// 发生错误时统一定向到404错误页面
			res.status(res.statusCode).sendFile(config.dest + 'public/404.html');
			// res.end();
		} : errorHandler();
};
