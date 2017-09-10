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
    db: 'mongodb://localhost/almost-thea-blog-server-development'
  },

  test: {
    root: rootPath,
    app: {
      name: 'almost-thea-blog-server'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/almost-thea-blog-server-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'almost-thea-blog-server'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/almost-thea-blog-server-production'
  }
};

module.exports = config[env];
