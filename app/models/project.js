const mongoose = require('mongoose'),
	Schema = mongoose.Schema;

const ProjectSchema = new Schema({
	name: {
		type: Schema.Types.String,
		required: [true, 'Name is required!'],
		minlength: 3,
		maxlength: 30
	},
	thumbnail: {
		type: Schema.Types.ObjectId,
		ref: 'Image',
		required: [true, 'Thumbnail is required!']
	},
	photos: [{
		type: Schema.Types.ObjectId,
		ref: 'Image',
	}]
});

module.exports = mongoose.model('Project', ProjectSchema);
