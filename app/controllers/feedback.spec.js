const Feedback = require('../models/feedback'),
	fixture = require('../controllers/feedback.fixture'),
	chai = require('chai'),
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
				.send({ token: token })
				.end((err, res) => {
					res.should.have.status(200);
					res.body.length.should.equal(fixture.feedbacks.length);
					done();
				});
		});
	});
});

