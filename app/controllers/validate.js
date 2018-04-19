const https = require('https'),
	qs = require('querystring'),
	router = require('express').Router();

router.post('/', (req, res) => {
	const postData = qs.stringify({ secret: process.env.RECAPTCHA_SECRET_KEY, response: req.body.response });
	const options = {
		host: process.env.RECAPTCHA_HOST,
		path: process.env.RECAPTCHA_PATH,
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Length': postData.length
		}
	};

	var validationRequest = https.request(options, function (validationResponse) {
		var result = '';
		validationResponse.on('data', function (chunk) {
			result += chunk;
		});
		validationResponse.on('end', function () {
			res.send(result);
		});
		validationResponse.on('error', function (err) {
			res.json({ error: err, success: false });
		});
	});

	validationRequest.on('error', function (err) {
		res.json({ error: err, success: false });
	});

	validationRequest.write(postData);
	validationRequest.end();
});

module.exports = (app) => {
	app.use('/api/validate', router);
};
