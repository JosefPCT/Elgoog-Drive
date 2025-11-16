
module.exports.indexGetRoute = (req, res, next) => {
  res.render('index', {
    title: 'Home'
  });
}