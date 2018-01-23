var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Article = mongoose.model('Article');

module.exports = function (app) {
  app.use('/article', router);
};

router.get('/all', (req, res, next) => {
  Article.find().then((articles) => {
    res.json({ articles: articles });
  });
});

router.post('/create', (req, res, next) => {
  let article = req.body;

  // TODO: Validate article.
  Article.find().then((articles) => {
    res.json({ articles: articles });
  });
});

router.get('/details/:id/:title', (req, res, next) => {
  let queryParams = req.query;
  Article.findOne({ id: queryParams.id, title: queryParams.title }).then((article) => {
    res.json({ article: article });
  });
});

router.put('/edit/:id', (req, res, next) => {
  let updatedArticle = req.body;

  // TODO: Validate article.
  Article.findByIdAndUpdate(req.query.id, updatedArticle).then((article) => {
    res.json({ success: true });
  })
});

router.delete('/delete/:id', (req, res, next) => {
  Article.findByIdAndRemove(req.query.id).then((article) => {
    res.json({ success: true });
  })
})
