const Feedback = require('../models/feedback'),
	fixture = require('../controllers/feedback.fixture'),
	chai = require('chai'),
	assert = chai.assert,
	chaiHttp = require('chai-http'),
	readyApp = require('../../app'),
	authService = require('../services/auth.service');

let app;
chai.use(chaiHttp);
chai.should();

describe('feedback controller', () => {
	before((done) => {
		Promise.all([
			Feedback.create(fixture.feedbacks),
			readyApp.then(ready => app = ready)
		]).then(() => done());
	});

	after((done) => {
		Feedback.remove({}).then(() => done());
	});

	it('\'all\' should ask for authentication', (done) => {
		chai.request(app)
			.get('/api/feedback/all')
			.end((err, res) => {
				res.should.have.status(401);
				done();
			});
	});

	describe('when authenticated', () => {
		let token;
		before((done) => {
			authService.login({
				username: process.env.DEFAULT_USERNAME || 'username',
				password: process.env.DEFAULT_PASSWORD || 'password'
			}).then((result) => {
				token = result.token;
				done();
			});
		});

		it('on \'all\' should return all feedback', (done) => {
			chai.request(app)
				.get('/api/feedback/all')
				.set('Authorization', `JWT ${token}`)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.length.should.equal(fixture.feedbacks.length);
					done();
				});
		});

		it('should return error when adding feedback with no body', (done) => {
			chai.request(app)
				.post('/api/feedback/add')
				.set('Authorization', `JWT ${token}`)
				.end((err, res) => {
					res.should.have.status(400);
					res.body.success.should.be.false;
					res.body.message.should.equal('Feedback validation failed!');
					res.body.errors.should.deep.equal([
						'Content is required!',
						'Name is required!',
					]);
					done();
				});
		});

		it('should return error when adding feedback object with small invalid data', (done) => {
			chai.request(app)
				.post('/api/feedback/add')
				.set('Authorization', `JWT ${token}`)
				.send({ name: 'ab', content: 'small' })
				.end((err, res) => {
					res.should.have.status(400);
					res.body.success.should.be.false;
					res.body.message.should.equal('Feedback validation failed!');
					res.body.errors.should.deep.equal([
						'Name\'s length should be longer than 3!',
						'Content\'s length should be longer than 10!',
					]);
					done();
				});
		});

		it('should return error when adding feedback object with big invalid data', (done) => {
			chai.request(app)
				.post('/api/feedback/add')
				.set('Authorization', `JWT ${token}`)
				.send({
					name: 'adsadsadsadsadsadsadsadsadbsagdvsahgdvsaghdsgacdagshdcaghsdcagshdsagcdagsb',
					content: 'small'
				})
				.end((err, res) => {
					res.should.have.status(400);
					res.body.success.should.be.false;
					res.body.message.should.equal('Feedback validation failed!');
					res.body.errors.should.deep.equal([
						'Name\'s length should not be longer than 30!',
						'Content\'s length should be longer than 10!',
					]);
					done();
				});
		});

		it('should save feedback on add request', (done) => {
			const feedback = {
				name: 'Peter',
				content: 'I really like this site and it\'s pics!'
			};
			chai.request(app)
				.post('/api/feedback/add')
				.set('Authorization', `JWT ${token}`)
				.send(feedback)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.success.should.equal(true);

					Feedback.findById(res.body.feedback._id).then(feedback => {
						feedback.should.exist;
						done();
					});
				});
		});

		it('should return error when editing feedback with invalid arguments count', (done) => {
			const feedback = {
				name: 'Malon',
				content: 'I really like this site and it\'s pics!'
			};

			Feedback.create(feedback).then(createdFeedback => {
				chai.request(app)
					.put('/api/feedback/edit/' + createdFeedback.id)
					.set('Authorization', `JWT ${token}`)
					.send({ name: 'ab', isRead: true })
					.end((err, res) => {
						res.should.have.status(400);
						res.body.message.should
							.equal('Feedback cannot be updated! Invalid arguments!');
						done();
					});
			});
		});


		it('should return error when editing feedback with invalid arguments count', (done) => {
			const feedback = {
				name: 'Merry',
				content: 'I really like this site and it\'s pics!'
			};

			Feedback.create(feedback).then(createdFeedback => {
				chai.request(app)
					.put('/api/feedback/edit/' + createdFeedback.id)
					.set('Authorization', `JWT ${token}`)
					.send({ isRead: 'true' })
					.end((err, res) => {
						res.should.have.status(400);
						res.body.success.should.be.false;
						res.body.message.should
							.equal('Feedback cannot be updated! Invalid arguments!');
						done();
					});
			});
		});

		it('should return error when editing not existing feedback', (done) => {
			chai.request(app)
				.put('/api/feedback/edit/' + 'invalid-id')
				.set('Authorization', `JWT ${token}`)
				.send({ isRead: true })
				.end((err, res) => {
					res.should.have.status(400);
					res.body.success.should.be.false;
					res.body.message.should.exist;
					done();
				});
		});

		it('should update feedback when on edit request', (done) => {
			const feedback = {
				name: 'Annie',
				content: 'I really like this site and it\'s pics!'
			};

			Feedback.create(feedback).then(createdFeedback => {
				createdFeedback.isRead.should.be.false;

				chai.request(app)
					.put('/api/feedback/edit/' + createdFeedback.id)
					.set('Authorization', `JWT ${token}`)
					.send({ isRead: true })
					.end((err, res) => {
						res.should.have.status(200);
						res.body.success.should.be.true;
						res.body.message.should
							.equal('Your feedback was successfully updated!');

						Feedback.findById(createdFeedback._id).then(foundFeedback => {
							foundFeedback.isRead.should.be.true;
							done();
						});
					});
			});
		});

		it('should return error when deleting not existing feedback', (done) => {
			chai.request(app)
				.delete('/api/feedback/delete/' + 'non-existing-id')
				.set('Authorization', `JWT ${token}`)
				.send({ isRead: true })
				.end((err, res) => {
					res.should.have.status(400);
					res.body.success.should.be.false;
					res.body.message.should.exist;
					done();
				});
		});

		it('should delete feedback when on delete request', (done) => {
			const feedback = {
				name: 'Marco',
				content: 'I really like this site and it\'s pics!'
			};

			Feedback.create(feedback).then(createdFeedback => {
				chai.request(app)
					.delete('/api/feedback/delete/' + createdFeedback.id)
					.set('Authorization', `JWT ${token}`)
					.end((err, res) => {
						res.should.have.status(200);
						res.body.success.should.be.true;
						res.body.message.should
							.equal('Your feedback was successfully deleted!');

						Feedback.findById(createdFeedback._id).then(foundFeedback => {
							assert.notExists(foundFeedback);
							done();
						});
					});
			});
		});
	});
});

