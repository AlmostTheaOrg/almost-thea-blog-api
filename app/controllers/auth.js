const express = require('express'),
	router = express.Router(),
	encryption = require('../security/encryption'),
	jwt = require('jsonwebtoken'),
	config = require('../../config/config'),
	User = require('../models/user'),
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

	User.findOne({ username: user.username })
		.then(persistedUser => {
			if (!persistedUser) {
				res.status(401).json({
					success: false,
					message: 'Username or password is invalid!',
					errors: []
				});
				return;
			}

			if (persistedUser.password !== encryption.hashPassword(user.password, persistedUser.salt)) {
				res.status(401).json({
					success: false,
					message: 'Username or password is invalid!',
					errors: []
				});
				return;
			}

			const payload = { id: persistedUser._id };
			const token = jwt.sign(payload, config.tokenKey, {
				expiresIn: '7 days'
			});
			res.json({
				success: true,
				message: 'You have successfully logged in!',
				token: token
			});
		})
		.catch((error) => {
			console.log(error);
		});
});
