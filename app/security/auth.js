const passport = require('passport');

module.exports = {
	authenticate: passport.authenticate('jwt', {
		session: false
	})
};
