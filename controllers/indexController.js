const prisma = require("../db/client");

module.exports.indexGetRoute = async (req, res, next) => {
  // const allusers = await prisma.user.findMany();
  // res.send(allusers);

  // Testing out sessions
//   if (req.session.viewCount) {
//     req.session.viewCount = req.session.viewCount + 1;
//   } else {
//     req.session.viewCount = 1;
//   }
//   console.log(req.session);

  res.render("index", {
    title: "Home",
  });
};
