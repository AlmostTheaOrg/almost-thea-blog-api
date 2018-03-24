const express = require('express'),
	router = express.Router(),
	Portrait = require('../models/portrait'),
	Image = require('../models/image'),
	validateField = require('../validation').validateField,
	authenticate = require('../security/auth').authenticate,
	imageStorageService = require('../services/image-storage.service'),
	parseFiles = require('../services/file-parser.middleware');

function validatePortraitName(name) {
	const result = validateField(name, 'name', 3, 30);
	return result;
}

router.get('/all', (req, res) => {
	Portrait.find()
		.populate('image')
		.then((portraits) => {
			res.json(portraits);
		});
});

router.post('/add', authenticate, parseFiles, (req, res) => {
	const data = req.formData;
	const validation = validatePortraitName(data.name);
	if (validation.errors && validation.errors.length > 0) {
		res.json(400, {
			success: false,
			message: 'Form validation failed!',
			errors: validation.errors,
		});
		return;
	}

	imageStorageService
		.upload(data.streams[0])
		.then((image) => {
			Image.create({ url: image.secure_url, id: image.public_id }).then((image) => {
				Portrait.create({ name: data.name, image: image }).then((portrait) => {
					res.json(portrait);
				});
			});
		})
		.catch((error) => {
			res.status(error.http_code || 400).send({
				success: false,
				message: error.message,
			});
		});
});

router.put('/edit/:id',
	authenticate,
	parseFiles,
	(req, res) => {
		const data = req.formData;

		const validation = validatePortraitName(data.name);
		if (validation.errors && validation.errors.length > 0) {
			res.json({
				success: false,
				message: 'Form validation failed!',
				errors: validation.result.errors,
			});
			return;
		}

		const portrait = { name: data.name };
		if (data.streams && data.streams.length > 0) {
			// Fire and go.
			Portrait.findById(req.params.id).populate('image').then(p => {
				imageStorageService.remove(p.image.id);
			});

			imageStorageService.upload(data.streams[0]).then(image => {
				Image.create({ url: image.secure_url, id: image.public_id })
					.then(image => {
						portrait.image = image;
						updatePortrait(req.params.id, portrait, res);
					});
			});
			return;
		}

		updatePortrait(req.params.id, portrait, res);
	});

router.delete('/delete/:id',
	authenticate,
	(req, res) => {
		Portrait.findByIdAndRemove(req.params.id).populate('image')
			.then((portrait) => {
				imageStorageService.remove(portrait.image.id).then(() => {
					res.json({
						success: true,
					});
				});
			})
			.catch(error => {
				res.json(400, {
					success: false,
					title: 'Error while deleting portrait',
					errors: [error]
				});
			});
	});


function updatePortrait(id, editPortraitData, res) {
	Portrait.findByIdAndUpdate(id, editPortraitData, { new: true }).populate('image').then((portrait) => {
		res.json({
			success: true,
			portrait: portrait
		});
	});
}

module.exports = (app) => {
	app.use('/api/portrait', router);
};
