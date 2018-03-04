const express = require('express'),
	glob = require('glob'),
	favicon = require('serve-favicon'),
	logger = require('morgan'),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
	compress = require('compression'),
	methodOverride = require('method-override'),
	title = require('express-title'),
	helmet = require('helmet'),
	passport = require('passport'),
	cors = require('cors');

module.exports = function (app, config) {
	const env = process.env.NODE_ENV || 'development';
	app.locals.ENV = env;
	app.locals.ENV_DEVELOPMENT = env == 'development';

	app.use(favicon(config.root + '/public/img/favicon.ico'));
	app.use(logger('dev'));

	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(bodyParser.json());
	app.use(cookieParser());
	app.use(compress());
	app.use(express.static(config.root + '/public'));
	app.use(methodOverride());
	app.use(title());
	app.use(helmet());
	app.use(passport.initialize());

	app.use((req, res, next) => {
		res.title(req.url);
		next();
	});

	app.use(cors());

	// Load all controllers without their specs.
	const controllers = glob.sync(config.root + '/app/controllers/**/!(*.spec).js');
	controllers.forEach(function (controller) {
		require(controller)(app);
	});

	app.use(function (req, res, next) {
		let err = new Error('Not Found');
		err.status = 404;
		next(err);
	});

	if (app.get('env') === 'development') {
		app.use(function (err, req, res) {
			res.status(err.status || 500);
			res.json({
				message: err.message,
				error: err,
				title: 'error'
			});
		});
	}

	app.use(function (err, req, res) {
		res.status(err.status || 500);
		res.json({
			message: err.message,
			error: err,
			title: 'error'
		});
	});

	return app;
};
