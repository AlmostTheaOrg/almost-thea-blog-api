const passport = require('passport'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	HttpBearerStrategy = require('passport-http-bearer').Strategy;

module.exports = new HttpBearerStrategy({
	usernameField: 'username',
	passwordField: 'password',
	session: false,
},
(token, done) => {

	User.findOne({ token: token }, (err, user) => {
		if (err) {
			return done(err);
		}

		if (!user) {
			const error = new Error('Incorrect email or password');
			error.name = 'IncorrectCredentialsError';

			return done(error, false);
		}

		return done(null, user);
	});
});
