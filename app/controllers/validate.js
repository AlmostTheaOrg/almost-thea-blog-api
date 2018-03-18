const router = require('express').Router(),
	https = require('https');

router.post('/validate', (req, res) => {
	console.log(req.body);
	const body = Object.assign({}, req.body, { secret: '6LeGMUQUAAAAAKru-07iVdycVr8xE4krJddjQbgY', remoteip: 'localhost:3000' });
	const request = https.request({
		host: 'https://www.google.com/',
		path: '/recaptcha/api/siteverify',
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		}
	},
		(gRes => {
			console.log(gRes);
			res.end();
		}));

	request.write(JSON.stringify(body));
	request.end();
});

module.exports = (app) => {
	app.use('/api', router);
};
