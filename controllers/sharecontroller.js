const queries = require('../db/queries');
const { v4: uuidv4 } = require('uuid');


module.exports.newSharePostRoute = async (req, res, next) => {
  console.log(req.body);
  res.send('aa');
}

module.exports.shareIdGetRoute = async (req, res, next ) => {
  console.log(req.params.id);
  const testId = uuidv4();
  console.log(testId);
  res.send('Share Id');
}