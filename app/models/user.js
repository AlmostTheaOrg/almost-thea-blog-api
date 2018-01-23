const mongoose = require('mongoose'),
  encryption = require('../security/encryption')
Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: { type: String, required: [true, 'Username is required!'], unique: true, minlength: 6, maxlength: 30, path: 'Username is required!' },
  email: { type: String, required: [true, 'Email is required!'], unique: true, minlength: 6, maxlength: 30, path: 'Username is required!' },
  password: { type: String, required: [true, 'Password is required!'], minlength: 6 },
  token: { type: String, default: '' },
  salt: { type: String, required: true }
});

mongoose.model('User', UserSchema);
