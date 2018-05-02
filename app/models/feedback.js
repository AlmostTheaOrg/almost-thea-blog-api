const mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	util = require('util'),
	constants = require('./constants');

const FeedbackSchema = new Schema({
	name: {
		type: Schema.Types.String,
		required: [true, util.format(constants.PROPERTY_REQUIRED, 'Name')],
		minlength: [3, util.format(constants.PROPERTY_MIN_LENGTH, 'Name', 3)],
		maxlength: [30, util.format(constants.PROPERTY_MAX_LENGTH, 'Name', 30)]
	},
	email: {
		type: Schema.Types.String,
	},
	content: {
		type: Schema.Types.String,
		required: [true, util.format(constants.PROPERTY_REQUIRED, 'Content')],
		minlength: [10, util.format(constants.PROPERTY_MIN_LENGTH, 'Content', 10)],
		maxlength: [500, util.format(constants.PROPERTY_MAX_LENGTH, 'Content', 500)]
	},
	isRead: {
		type: Schema.Types.Boolean,
		default: false
	},
	datePosted: {
		type: Schema.Types.Date,
		default: function () {
			return Date.now();
		}
	}
});

module.exports = mongoose.model('Feedback', FeedbackSchema);
