const express = require('express'),
	config = require('./config/config');

const app = express();
require('./config/database')(config);
require('./config/express')(app, config);
require('./config/passport')(config);

app.listen(config.port, function () {
	console.log('Express server listening on port ' + JSON.stringify(config.port));
});

