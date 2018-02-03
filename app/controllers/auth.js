const express = require('express'),
	router = express.Router(),
	mongoose = require('mongoose'),
	passport = require('passport'),
	encryption = require('../security/encryption'),
	jwt = require('jsonwebtoken'),
	config = require('../../config/config');
const User = mongoose.model('User');

function validateField(value, valueName, minLength, maxLength) {
	let result = { errors: [] };
	if (!value) {
		result.errors.push(`${valueName} is empty!`);
	} else if (typeof value === String) {
		result.errors.push(`${valueName} value is not valid!`);
	} else if (value.length < minLength) {
		result.errors.push(`${valueName} length too small!`);
	} else if (value.length > maxLength) {
		result.errors.push(`${valueName} length too big!`);
	}

	return result;
}

function getLoginCheck(user) {
	let result = { errors: [] };

	let usernameValidation = validateField(user.username, 'Username', 6, 30);
	let passwordValidation = validateField(user.password, 'Password', 6, 30);

	result.errors = usernameValidation.errors.concat(passwordValidation.errors);

	result.result = result.errors.length === 0;
	return result;
}

module.exports = function (app) {
	app.use('/auth', router);
};

router.post('/login', (req, res) => {
	let user = req.body;
	let validationResult = getLoginCheck(user);

	if (!validationResult.result) {
		res.json({
			success: false,
			message: 'Form validation failed!',
			errors: validationResult.errors
		});
		return;
	}

	User.find().then(persistedUser => {
		if (!persistedUser) {
			res.json({
				success: false,
				message: 'Username or password is invalid!',
				errors: []
			});
			return;
		}

		if (persistedUser.password !== encryption.hashPassword(user.password, persistedUser.salt)) {
			res.json({
				success: false,
				message: 'Username or password is invalid!',
				errors: []
			});
			return;
		}

		let token = jwt.sign(persistedUser.id, config.tokenKey);
		persistedUser.token = token;
		persistedUser.save().then((updatedUser) => {
			res.sendStatus(200).json({
				success: true,
				message: 'You have successfully logged in!',
				token: updatedUser.token
			});
		});
	})
		.catch((error) => {
			console.log(error);
		});
});
