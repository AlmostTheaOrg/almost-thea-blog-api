const mongoose = require('mongoose'),
	Schema = mongoose.Schema;

const FeedbackSchema = new Schema({
	name: {
		type: Schema.Types.String,
		required: [true, 'Name is required!'],
		minlength: 3,
		maxlength: 30
	},
	email: {
		type: Schema.Types.String,
	},
	content: {
		type: Schema.Types.String,
		required: [true, 'Content is required!'],
		minlength: 10,
		maxlength: 500
	},
	isRead: {
		type: Schema.Types.Boolean,
		default: false
	},
	datePosted: {
		type:Schema.Types.Date,
		default: Date.now()
	}
});

module.exports = mongoose.model('Feedback', FeedbackSchema);
