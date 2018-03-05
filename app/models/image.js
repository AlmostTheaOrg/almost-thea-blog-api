const mongoose = require('mongoose'),
	Schema = mongoose.Schema;

const ImageSchema = new Schema({
	id: {
		type: Schema.Types.String,
		required: [true, 'Id is required!'],
	},
	url: {
		type: Schema.Types.String,
		required: [true, 'ImageUrl is required!'],
	},
});

module.exports = mongoose.model('Image', ImageSchema);
