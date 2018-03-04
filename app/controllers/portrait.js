var express = require('express'),
	router = express.Router(),
	mongoose = require('mongoose'),
	Portrait = mongoose.model('Portrait'),
	validateField = require('../validation').validateField,
	authenticate = require('../security/auth').authenticate;

module.exports = function (app) {
	app.use('/api/portrait', router);
};

function validatePortraitName(name) {
	const result = validateField(name);
	return result;
}

router.get('/all', (req, res) => {
	Portrait.find().then((portraits) => {
		res.json({
			portraits: portraits
		});
	});
});

router.post('/add', authenticate, (req, res) => {
	const portrait = req.body;
	const validation = validatePortraitName(portrait);

	if (validation.result.errors && validation.result.errors.length > 0) {
		res.json(400, {
			success: false,
			message: 'Form validation failed!',
			errors: validation.errors
		});
		return;
	}

	Portrait.create(portrait).then(() => {
		Portrait.find().then((portraits) => {
			res.json({
				portraits: portraits
			});
		});
	});
});

router.get('/details/:id', (req, res) => {
	let queryParams = req.query;
	Portrait.findOne({
		id: queryParams.id,
		title: queryParams.title
	}).then((portrait) => {
		if (!portrait) {
			res.json({
				success: false,
				message: 'Portrait not found!',
				errors: [this.message]
			});
			return;
		}

		res.json({
			portrait: portrait
		});
	});
});

router.put('/edit/:id', authenticate, (req, res) => {
	let portrait = req.body;

	const validation = validatePortraitName(portrait);
	if (validation.result.errors && validation.result.errors.length > 0) {
		res.json({
			success: false,
			message: 'Form validation failed!',
			errors: validation.result.errors
		});
		return;
	}

	Portrait.findByIdAndUpdate(req.query.id, portrait).then(() => {
		res.json({
			success: true
		});
	});
});

router.delete('/delete/:id', authenticate, (req, res) => {
	Portrait.findByIdAndRemove(req.query.id).then(() => {
		res.json({
			success: true
		});
	});
});
