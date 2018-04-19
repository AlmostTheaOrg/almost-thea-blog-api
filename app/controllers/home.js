
const router = require('express').Router();

router.get('/', (req, res) => {
	res.json({ message: 'Welcome to Almost Thea API' });
});

module.exports = function (app) {
	app.use('/api', router);
};
