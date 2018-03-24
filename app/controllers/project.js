const express = require('express'),
	router = express.Router(),
	Project = require('../models/project'),
	Image = require('../models/image'),
	imageStorageService = require('../services/image-storage.service'),
	validateField = require('../validation/').validateField,
	parseFiles = require('../services/file-parser.middleware'),
	authenticate = require('../security/auth').authenticate;

function validateProjectName(name) {
	const result = validateField(name, 'name', 3, 30);
	return result;
}

router.get('/all', (req, res) => {
	Project.find({}).populate('thumbnail photos').then(projects => {
		res.json(projects);
	});
});

router.post('/add',
	authenticate,
	parseFiles,
	(req, res) => {
		const data = req.formData;
		const validation = validateProjectName(data.name);
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
					Project.create({ name: data.name, thumbnail: image, photos: [image] }).then((project) => {
						Project.findById(project.id).populate('thumbnail photos').then(p => {
							console.log(p);
							res.json(p);
						});
					});
				});
			})
			.catch((error) => {
				console.log('error');
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
		// TODO: validate.
		const projectId = req.params['id'];
		const data = req.formData;

		if (data.streams && data.streams.length > 0) {
			imageStorageService.upload(data.streams[0]).then(image => {
				Image.create({ url: image.secure_url, id: image.public_id }).then(thumbnail => {
					Project.findByIdAndUpdate(projectId, {
						$set: { thumbnail: thumbnail, name: data.name },
						$push: { photos: thumbnail }
					}, { new: true })
						.populate('thumbnail photos')
						.then(project => {
							res.json(project);
						});
				});
			});
		} else {
			Project.findByIdAndUpdate(projectId, { $set: { name: data.name } }, { new: true }).populate('thumbnail photos').then(project => {
				res.json(project);
			});
		}
	});

router.delete('/delete/:id',
	authenticate,
	(req, res) => {
		const projectId = req.params['id'];
		Project.findByIdAndRemove(projectId).populate('photos').then(project => {
			const promises = [];
			for (const photo of project.photos) {
				promises.push(Image.findByIdAndRemove(photo._id).then(image => {
					return imageStorageService.remove(image.id);
				}));
			}

			Promise.all(promises).then(() => {
				// TODO: Handle failure.
				res.sendStatus(200);
			});
		});
	});

router.put('/add/:id/photo',
	authenticate,
	parseFiles,
	(req, res) => {
		const projectId = req.params['id'];
		const data = req.formData;

		imageStorageService
			.upload(data.streams[0])
			.then(image => {
				Image.create({ url: image.secure_url, id: image.public_id }).then((image) => {
					Project.findByIdAndUpdate(projectId, { $push: { photos: image } }, { new: true }).populate('photos').then(project => {
						res.json(project);
					});
				});
			});
	});

router.put('/delete/:projectId/photo/:photoId',
	authenticate,
	(req, res) => {
		const projectId = req.params['projectId'];
		const photoId = req.params['photoId'];
		Image.findByIdAndRemove(photoId).then(image => {
			imageStorageService.remove(image.id).catch(error => {
				console.log(error);
			});
		});

		Project.findByIdAndUpdate(projectId, { $pull: { photos: { _id: photoId } } }, { new: true }).populate('photos').then(project => {
			res.json(project);
		}).catch(error => {
			console.log(error);
		});
	});

module.exports = (app) => {
	app.use('/api/project', router);
};
