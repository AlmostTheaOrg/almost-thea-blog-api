const Feedback = require('../models/feedback'),
	fixture = require('../controllers/feedback.fixture'),
	chai = require('chai'),
	chaiHttp = require('chai-http'),
	readyApp = require('../../app');

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
		it('on \'all\' should return all feedback', () => {
		});
	});
});

