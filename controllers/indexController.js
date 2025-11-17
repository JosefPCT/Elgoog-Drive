const { PrismaClient } = require('../generated/prisma')

const prisma = new PrismaClient();


module.exports.indexGetRoute = async(req, res, next) => {
    // const allusers = await prisma.user.findMany();
    // res.send(allusers);

    res.render('index', {
    title: 'Home'
  });
}