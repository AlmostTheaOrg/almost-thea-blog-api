const mongoose = require('mongoose'),
	glob = require('glob'),
	encryption = require('../app/security/encryption');

mongoose.Promise = global.Promise;

module.exports = function (config) {
	mongoose.connect(config.db, { useMongoClient: true });

	let db = mongoose.connection;
	db.on('error', function () {
		throw new Error('Unable to connect to database at: ' + config.db);
	});

	db.on('open', () => {
		console.log(`Connected to database successfully at [${JSON.stringify(config.db)}]!`);

		isAnyUserRegistered()
			.then((isAny) => {
				if (!isAny) {
					registerDefaultUser()
						.then(defaultUser => {
							console.log('Default user registered: ' + defaultUser.username);
						});
				}
			});
	});

	let models = glob.sync(config.root + '/app/models/*.js');
	models.forEach(function (model) {
		require(model);
	});

	return db;
};

function isAnyUserRegistered() {
	const User = mongoose.model('User');
	return User.find()
		.then((users) => {
			return users.length > 0;
		});
}

function registerDefaultUser() {
	const User = mongoose.model('User');

	let user = { username: process.env.DEFAULT_USERNAME || 'username', password: process.env.DEFAULT_PASSWORD || 'password' };
	user.salt = encryption.generateSalt();
	user.password = encryption.hashPassword(user.password, user.salt);

	return User.create(user)
		.then(value => {
			return value;
		});
}
