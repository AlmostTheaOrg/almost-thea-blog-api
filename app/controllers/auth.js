const express = require('express'),
	router = express.Router(),
	authService = require('../services/auth.service'),
	validateField = require('../validation').validateField;

function getLoginCheck(user) {
	let result = {
		errors: []
	};

	let usernameValidation = validateField(user.username, 'Username', 5, 30);
	let passwordValidation = validateField(user.password, 'Password', 6, 30);

	result.errors = usernameValidation.errors.concat(passwordValidation.errors);

	result.result = result.errors.length === 0;
	return result;
}

module.exports = function (app) {
	app.use('/api', router);
};

router.post('/login', (req, res) => {
	let user = req.body;
	let validationResult = getLoginCheck(user);

	if (!validationResult.result) {
		res.status(401).json({
			success: false,
			message: 'Form validation failed!',
			errors: validationResult.errors
		});
		return;
	}

	authService.login(user)
		.then(loginResult => {
			res.json(loginResult);
		})
		.catch((error) => {
			console.log(error);
		});
});
