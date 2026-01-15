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

// GET Route



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
    let folder = await queries.getFolderById(parseInt(shareData.folderId));
    let data = [...folder.subfolders, ...folder.files];

    // const user = { firstName: 'unknown', lastName: 'unknown' };
    const user = await queries.getCurrentUserById(folder.userId);

    res.render('pages/share/shareId', {
    title: 'Shared Folder',
    user: req.user,
    shareId: req.params.id,
    folderId: 1,
    data: data,
    urlWithoutQuery: 'a',
    user: user
  })
  } else {
    console.log("Link Expired");
    res.send("Link has expired");
  }
}

module.exports.shareFolderIdGetRoute = async(req, res, next) =>{
  res.send('aa.');
}