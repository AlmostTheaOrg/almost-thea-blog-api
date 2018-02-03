var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var PortraitSchema = new Schema({
	title: Schema.Types.String,
	imageUrl: Schema.Types.String,
});

mongoose.model('Portrait', PortraitSchema);

