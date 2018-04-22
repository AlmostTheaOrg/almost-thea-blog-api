const authService = require('./auth.service'),
	expect = require('chai').expect,
	User = require('../models/user');

describe('auth service', () => {
	it('should add user when register is called', (done) => {
		const user = {
			username: 'test-user',
			password: 'milkAc0w'
		};

		authService.register(user)
			.then((result) => {
				User.findOne(result.user).then((registeredUser) => {
					expect(result.success).equal(true);
					expect(registeredUser.username).equal(user.username);
					done();
				});
			});
	});

	it('should not add user when register is called with invalid user', () => {
		const user = {
			userName: 'pesho',
			passw0rd: 'wrong_field_name'
		};

		expect(() => authService.register(user)).throws('Invalid user!');
	});

	it('should not add same user twice', (done) => {
		const userA = {
			username: 'test-user-a',
			password: 'milkAc0w'
		};
		const userB = {
			username: 'test-user-a',
			password: 'billAb0ll'
		};

		authService.register(userA).then((resultA) => {
			User.findOne(resultA.user).then((registerUserA) => {
				expect(resultA.success).equal(true);
				expect(registerUserA.username).equal(userA.username);

				authService.register(userB).then((resultB) => {
					expect(resultB.success).equal(false);
					expect(resultB.message).equal('User already existing!');
					done();
				});
			});
		});
	});

	it('should remove user', (done) => {
		const user = {
			username: 'should-remove-user',
			password: 'milkAc0w'
		};
		authService.register(user).then(registerResult => {
			authService.remove({ username: registerResult.user.username }).then(removeResult => {
				expect(removeResult.success).equal(true);
				done();
			});
		});
	});

	it('should return proper response removed user is not existing when remove is called', (done) => {
		const user = {
			username: 'should-not-remove-user',
		};

		authService.remove(user).then(removeResult => {
			expect(removeResult.success).equal(false);
			expect(removeResult.message).equal('User not found!');
			done();
		});
	});

	it('should login a registered user', (done) => {
		const user = {
			username: 'login-user',
			password: 'my-secret-password'
		};

		authService.register(user).then(() => {
			authService.login({ username: user.username, password: user.password }).then(loginResult => {
				expect(loginResult.success).to.be.true;
				expect(loginResult.token).to.exist;
				expect(loginResult.message).equal('You have successfully logged in');
				done();
			});
		});
	});

	it('should not login a non-existing user', (done) => {
		const user = {
			username: 'non-login-user',
			password: 'my-secret-password'
		};

		authService.login({ username: user.username, password: user.password }).then(loginResult => {
			expect(loginResult.success).to.be.false;
			expect(loginResult.message).equal('Username or password is invalid!');
			done();
		});
	});

	it('should not login a user with wrong credentials', (done) => {
		const user = {
			username: 'wrong-login-user',
			password: 'my-secret-password'
		};

		authService.register(user).then(() => {
			authService.login({ username: user.username, password: 'not-a-password' }).then(loginResult => {
				expect(loginResult.success).to.be.false;
				expect(loginResult.message).equal('Username or password is invalid!');
				done();
			});
		});
	});
});

after((done) => {
	User.remove({}).then(() => done());
});
