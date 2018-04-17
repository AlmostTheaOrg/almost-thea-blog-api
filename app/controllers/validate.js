const router = require('express').Router();

router.post('/', (req, res) => {
	console.log(res);
	res.json({ success: true });
});

module.exports = (app) => {
	app.use('/api/validate', router);
};
