const User = require('../app/models/user'),
	authService = require('../app/services/auth.service');

module.exports = () => {
	return new Promise((resolve) => {
		(async () => {
			const isAny = await isAnyUserRegistered();
			if (!isAny) {
				const defaultUser = await registerDefaultUser();
				console.log('Default user registered: ' + defaultUser.username);
			}

			resolve();
		})();
	});
};

async function isAnyUserRegistered() {
	return User.find().then((users) => users.length > 0);
}

async function registerDefaultUser() {
	let user = {
		username: process.env.DEFAULT_USERNAME || 'username',
		password: process.env.DEFAULT_PASSWORD || 'password'
	};

	return authService.register(user).then(result => result.user);
}
