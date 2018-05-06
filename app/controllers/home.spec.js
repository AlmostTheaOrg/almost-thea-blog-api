const chai = require('chai'),
	chaiHttp = require('chai-http'),
	readyApp = require('../../app');

let app;
chai.use(chaiHttp);
chai.should();

describe('home controller', () => {
	before((done) => {
		readyApp.then(ready => app = ready)
			.then(() => done());
	});

	it('should return proper welcome message', (done) => {
		chai.request(app)
			.get('/api')
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.deep.equal({ message: 'Welcome to Almost Thea API' });
				done();
			});
	});
});
