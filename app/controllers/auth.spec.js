const chai = require('chai'),
	chaiHttp = require('chai-http'),
	User = require('../models/user'),
	app = require('../../app');

chai.use(chaiHttp);
chai.should();

after((done) => {
	User.remove({}, () => {
		done();
	});
});

describe('api/login POST', () => {
	it('should be able to login user default user', (done) => {
		const user = {
			username: process.env.DEFAULT_USERNAME,
			password: process.env.DEFAULT_PASSWORD
		};

		chai.request(app)
			.post('/api/login')
			.send(user)
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.a('object');
				res.body.should.have.property('success').equal(true);
				res.body.should.have.property('message');
				res.body.should.have.property('token');

				done();
			});
	});

	it('should not be able to login unregistered user', (done) => {
		const user = {
			username: process.env.DEFAULT_USERNAME + '@132',
			password: process.env.DEFAULT_PASSWORD
		};

		chai.request(app)
			.post('/api/login')
			.send(user)
			.end((err, res) => {
				res.should.have.status(401);
				res.body.should.have.property('success').equal(false);
				res.body.should.have.have.property('errors');
				done();
			});
	});

	it('should not be able to login with invalid user', (done) => {
		const user = {
			username: '@132',
			password: ''
		};

		chai.request(app)
			.post('/api/login')
			.send(user)
			.end((err, res) => {
				res.should.have.status(401);
				res.body.should.have.property('success').equal(false);
				res.body.should.have.have.property('errors');
				done();
			});
	});
});
