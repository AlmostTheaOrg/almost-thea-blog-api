const passport = require('passport'),
	PassportJsonWebToken = require('passport-jwt'),
	JwtStrategy = PassportJsonWebToken.Strategy,
	ExtractJwt = PassportJsonWebToken.ExtractJwt,
	User = require('mongoose').model('User');

module.exports = (config) => {
	passport.use(new JwtStrategy({
		jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
		secretOrKey: config.tokenKey
	}, (payload, done) => {

		User.findById(payload.id).then(user => {
			if (user) {
				done(null, user);
			} else {
				done(null, false);
			}
		});
	}));

	passport.serializeUser((user, done) => {
		if (user) {
			return done(null, user._id);
		}
	});

	passport.deserializeUser((id, done) => {
		User.findById(id).then(user => {
			if (!user) {
				return done(null, false);
			}

			return done(null, user);
		});
	});
};
