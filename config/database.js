const mongoose = require('mongoose'),
	glob = require('glob');
mongoose.Promise = global.Promise;

module.exports = function (config) {
	mongoose.connect(config.db, { useMongoClient: true });

	let db = mongoose.connection;
	db.on('error', function () {
		throw new Error('Unable to connect to database at: ' + config.db);
	});
	db.on('open', () => {
		console.log(`Connected to database sucessfully at [${config.db}]!`);
	});

	let models = glob.sync(config.root + '/app/models/*.js');
	models.forEach(function (model) {
		require(model);
	});

	return db;
}