const mongoose = require('mongoose'),
	encryption = require('../security/encryption'),
	Schema = mongoose.Schema;

var UserSchema = new Schema({
	username: { type: Schema.Types.String, required: [true, 'Username is required!'], unique: true, minlength: 6, maxlength: 30, path: 'Username is required!' },
	password: { type: Schema.Types.String, required: [true, 'Password is required!'], minlength: 6 },
	token: { type: Schema.Types.String, default: '' },
	salt: { type: Schema.Types.String, required: true }
});

mongoose.model('User', UserSchema);
