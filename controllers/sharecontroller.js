const queries = require('../db/queries');


module.exports.newSharePostRoute = async (req, res, next) => {
  console.log(req.body);
  let data = await queries.createAndReturnShareData(parseInt(req.body.expiryDay), parseInt(req.body.parentFolderId));
  console.log('Show data:', data);

  const link = `${req.baseUrl}/${data.id}`;
  console.log(link);

  const previousUrl = req.body.previousUrl;
  console.log(previousUrl);
  

  res.redirect(`${previousUrl}?sharing=${data.id}`);
}

module.exports.shareIdGetRoute = async (req, res, next ) => {
  console.log(req.params.id);

  let shareData = await queries.findShareDataById(req.params.id);
  console.log(shareData);

  let createdAt = shareData.createdAt;

  const differenceInMilliSeconds = Date.now() - createdAt;

  const oneSecond = 1000;
  const oneMinute = oneSecond * 60;
  const oneHour = oneMinute * 60;
  const oneDay = oneHour * 24;

  const differenceInSeconds = differenceInMilliSeconds / oneSecond;
  const diffInMins = differenceInMilliSeconds / oneMinute;
  const diffInHours = differenceInMilliSeconds / oneHour;
  const diffInDays = differenceInMilliSeconds / oneDay;

  console.log("Difference in days", diffInDays);

  console.log(diffInDays);
  if(shareData.expiry > diffInDays){
    console.log("Link not expired");
    let data = await queries.getFolderById(shareData.folderId);
    console.log(data);
  } else {
    console.log("Link Expired");
  }

  res.send('Share Id');
}