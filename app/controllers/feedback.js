const express = require('express'),
	router = express.Router(),
	Feedback = require('../models/feedback'),
	authenticate = require('../security/auth').authenticate;

router.get('/all', authenticate,
	(req, res) => {
		Feedback.find().then((feedbacks) => {
			res.json(feedbacks);
		});
	});

router.post('/add',
	(req, res) => {
		const feedback = req.body;

		// TODO: Validate
		Feedback.create(feedback).then((feedback) => {
			res.json({ success: true, message: 'Your feedback was successfully saved!', feedback });
		});
	});

router.put('/edit/:id',
	authenticate,
	(req, res) => {
		const id = req.params['id'];
		const isRead = req.body;

		// TODO: Validate
		Feedback.findByIdAndUpdate(id, { $set: { isRead } }).then(() => {
			res.json({ success: true, message: 'Your feedback was successfully updated!' });
		});
	});

router.delete('/delete/:id',
	authenticate,
	(req, res) => {
		const id = req.params['id'];

		// TODO: Validate
		Feedback.findByIdAndRemove(id).then(() => {
			res.json({ success: true, message: 'Your feedback was successfully deleted!' });
		});
	});

module.exports = (app) => {
	app.use('/api/feedback', router);
};
