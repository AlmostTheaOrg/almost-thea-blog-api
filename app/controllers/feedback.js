const express = require('express'),
	router = express.Router(),
	Feedback = require('../models/feedback'),
	authenticate = require('../security/auth').authenticate,
	errorHandler =
		res =>
			reason =>
				res.status(400).json({
					success: false,
					message: reason.message,
					errors: reason.errors
				}),
	validationErrorHandler =
		res =>
			reason =>
				res.status(400).json({
					success: false,
					message: reason.message.substring(0, reason.message.indexOf(':')) + '!',
					errors: reason.errors ? Object.keys(reason.errors).map(key => { return reason.errors[key].message; }) : []
				});

router.get('/all', authenticate,
	(req, res) => {
		Feedback.find().then((feedbacks) => {
			res.json(feedbacks);
		});
	});

router.post('/add',
	(req, res) => {
		const feedback = req.body;

		Feedback.create(feedback)
			.then(feedback => {
				res.json({
					success: true,
					message: 'Your feedback was successfully saved!',
					feedback
				});
			})
			.catch(validationErrorHandler(res));
	});

router.put('/edit/:id',
	authenticate,
	(req, res) => {
		const id = req.params['id'];
		const isRead = req.body.isRead;

		if (Object.keys(req.body).length != 1 || !(isRead === true || isRead === false)) {
			errorHandler(res)({
				message: 'Feedback cannot be updated! Invalid arguments!',
				errors: []
			});
			return;
		}

		Feedback.findByIdAndUpdate(id, { $set: { isRead } })
			.then(() => {
				res.json({
					success: true,
					message: 'Your feedback was successfully updated!'
				});
			})
			.catch(validationErrorHandler(res));
	});

router.delete('/delete/:id',
	authenticate,
	(req, res) => {
		const id = req.params['id'];

		Feedback.findByIdAndRemove(id)
			.then(() => {
				res.json({ success: true, message: 'Your feedback was successfully deleted!' });
			})
			.catch(validationErrorHandler(res));
	});


module.exports = (app) => {
	app.use('/api/feedback', router);
};
