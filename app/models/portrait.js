const mongoose = require('mongoose'),
	Schema = mongoose.Schema;

const PortraitSchema = new Schema({
	name: {
		type: Schema.Types.String,
		required: [true, 'Name is required!'],
		minlength: 3,
		maxlength: 30
	},
	image: {
		type: Schema.Types.ObjectId,
		ref: 'Image',
		required: [true, 'Image is required!']
	}
});

module.exports = mongoose.model('Portrait', PortraitSchema);
