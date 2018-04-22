const User = require('../models/user'),
	encryption = require('../security/encryption'),
	jwt = require('jsonwebtoken'),
	config = require('../../config/config');

module.exports = {
	register(user) {
		const registerUser = Object.assign({}, user);
		validate(registerUser);

		registerUser.salt = encryption.generateSalt();
		registerUser.password = encryption.hashPassword(registerUser.password, registerUser.salt);

		return User.findOne({ username: registerUser.username }).then((existingUser) => {
			if (existingUser) {
				return {
					success: false,
					message: 'User already existing!'
				};
			}

			return User.create(registerUser).then(newUser => {
				return {
					success: true,
					user: { username: newUser.username }
				};
			});
		});
	},

	remove(user) {
		if (Object.keys({ user }).length != 1 || !user.username) {
			throw new Error('Invalid user!');
		}

		return User.findOne({ username: user.username }).then(foundUser => {
			if (!foundUser) {
				return { success: false, message: 'User not found!' };
			}

			return User.findOneAndRemove(user)
				.then(() => { return { success: true }; })
				.catch((error) => { return { success: false, message: error }; });
		});
	},

	login(user) {
		validate(user);

		return User.findOne({ username: user.username })
			.then(persistedUser => {
				if (!persistedUser) {
					return {
						success: false,
						message: 'Username or password is invalid!',
						errors: []
					};
				}

				if (persistedUser.password !== encryption.hashPassword(user.password, persistedUser.salt)) {
					return {
						success: false,
						message: 'Username or password is invalid!',
						errors: []
					};
				}

				const payload = { id: persistedUser._id };
				const token = jwt.sign(payload, config.tokenKey, {
					expiresIn: '7 days'
				});

				return {
					success: true,
					message: 'You have successfully logged in!',
					token: token
				};
			});
	}
};

function validate(user) {
	if (Object.keys(user).length != 2 || !user.username || !user.password) {
		throw new Error('Invalid user!');
	}
}
