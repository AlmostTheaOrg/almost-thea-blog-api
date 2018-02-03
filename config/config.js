var path = require('path'),
	rootPath = path.normalize(__dirname + '/..'),
	env = process.env.NODE_ENV || 'development';

var config = {
	development: {
		root: rootPath,
		app: {
			name: 'almost-thea-blog-server'
		},
		port: process.env.PORT || 3000,
		db: 'mongodb://localhost/almost-thea-blog-db-dev',
		tokenKey: 'Random_String'
	},

	test: {
		root: rootPath,
		app: {
			name: 'almost-thea-blog-server'
		},
		port: process.env.PORT || 3200,
		db: 'mongodb://localhost/almost-thea-blog-db-test',
		tokenKey: 'Random_String'
	},

	production: {
		root: rootPath,
		app: {
			name: 'almost-thea-blog-server'
		},
		port: process.env.PORT || 3000,
		db: 'mongodb://localhost/almost-thea-blog-server-production',
		tokenKey: process.env.TOKEN_KEY
	}
};

module.exports = config[env];
