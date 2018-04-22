const Feedback = require('../models/feedback'),
	fixture = require('../controllers/feedback.fixture'),
	chai = require('chai'),
	chaiHttp = require('chai-http'),
	app = require('../../app');

chai.use(chaiHttp);
chai.should();

describe('feedback controller', () => {
	before((done) => {
		Feedback.create(fixture.feedbacks).then(() => done());
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

