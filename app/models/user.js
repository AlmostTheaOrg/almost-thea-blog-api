const mongoose = require('mongoose'),
	encryption = require('../security/encryption'),
	Schema = mongoose.Schema;

var UserSchema = new Schema({
	username: {
		type: Schema.Types.String,
		required: [true, 'Username is required!'],
		unique: true,
		minlength: 6,
		maxlength: 30,
		path: 'Username is required!'
	},
	password: {
		type: Schema.Types.String,
		required: [true, 'Password is required!'],
		minlength: 6
	},
	salt: {
		type: Schema.Types.String,
		required: true
	}
});

UserSchema.method({
	authenticate: function (password) {
		return encryption.generateHashedPassword(this.salt, password) === this.password;
	}
});

module.exports = mongoose.model('User', UserSchema);
