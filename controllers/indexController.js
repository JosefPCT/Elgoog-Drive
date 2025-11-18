const prisma = require("../db/client");

// Post Routes

module.exports.registerPostRoute = async(req, res, next) => {
  res.send('Post route');
}

// Get Routes
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

module.exports.registerGetRoute = (req, res, next) => {
  res.render("register", {
    title: 'Register',
  })
}
