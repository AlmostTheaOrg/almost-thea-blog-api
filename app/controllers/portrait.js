var express = require('express'),
	router = express.Router(),
	mongoose = require('mongoose'),
	Portrait = mongoose.model('Portrait');

module.exports = function (app) {
	app.use('api/portrait', router);
};

router.get('/all', (req, res) => {
	Portrait.find().then((portraits) => {
		res.json({ portraits: portraits });
	});
});

router.post('/create', (req, res) => {
	let portrait = req.body;

	// TODO: Validate portrait.
	Portrait.create(portrait).then(() => {
		Portrait.find().then((portraits) => {
			res.json({ portraits: portraits });
		});
	});
});

router.get('/details/:id/:title', (req, res) => {
	let queryParams = req.query;
	Portrait.findOne({ id: queryParams.id, title: queryParams.title }).then((portrait) => {
		res.json({ portrait: portrait });
	});
});

router.put('/edit/:id', (req, res) => {
	let updatedportrait = req.body;

	// TODO: Validate portrait.
	Portrait.findByIdAndUpdate(req.query.id, updatedportrait).then(() => {
		res.json({ success: true });
	});
});

router.delete('/delete/:id', (req, res) => {
	Portrait.findByIdAndRemove(req.query.id).then(() => {
		res.json({ success: true });
	});
});
