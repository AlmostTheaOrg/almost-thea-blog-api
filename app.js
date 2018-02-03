const express = require('express'),
	config = require('./config/config'),
	database = require('./config/database');

const app = express();
const dbConnection = database(config);
module.exports = require('./config/express')(app, config);

app.listen(config.port, function () {
	console.log('Express server listening on port ' + JSON.stringify(config.port));
});

