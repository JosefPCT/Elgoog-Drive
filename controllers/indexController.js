const passport = require('passport');
const { body, validationResult, matchedData } = require("express-validator");

const prisma = require("../db/client");
const { validatePassword, genPassword } = require("./utils/passwordUtils");
const { isAuth } = require('./utils/authMiddleware');

// Validation
const emptyErr = `must not be empty`;
const notSamePassErr = `Password field and Confirm Password field must be the same`;
const emailAlreadyExistsErr = `Email already exists.`;

const isSamePass = (value, { req }) => {
  if (value !== req.body.password) {
    throw new Error(notSamePassErr);
  }
  return true;
};

const emailExists = async (value) => {
  const data = await prisma.user.findFirst({
    where: {
      email: value,
    },
  });
  if (data) {
    throw new Error(emailAlreadyExistsErr);
  }
  return true;
};

const validateUser = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage(`Email field ${emptyErr}`)
    .normalizeEmail()
    .isEmail()
    .withMessage(`Email must be a valid email`)
    .custom(emailExists),
  body("password").trim().notEmpty().withMessage(`Password field ${emptyErr}`),
  body("confirm_password")
    .trim()
    .notEmpty()
    .withMessage(`Confirm Password field ${emptyErr}`)
    .custom(isSamePass),
  body("first_name")
    .trim()
    .notEmpty()
    .withMessage(`First name field ${emptyErr}`),
  body("last_name")
    .trim()
    .notEmpty()
    .withMessage(`Last name field ${emptyErr}`),
];

// Post Routes

module.exports.registerPostRoute = [
  validateUser,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("register", {
        title: "Register",
        errors: errors.array(),
      });
    }

    const { email, password, first_name, last_name } = matchedData(req);

    const hashedPass = await genPassword(password);
    const hash = hashedPass.hash;

    await prisma.user.create({
      data: {
        email: email,
        hash: hash,
        firstName: first_name,
        lastName: last_name,
      },
    });

    res.send("Post route");
  },
];

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

  // const user = await prisma.user.findFirst({
  //     where: {
  //       email: "test@gmail.com",
  //     },
  //   });

  //   console.log(user.hash);

  res.render("index", {
    title: "Home",
  });
};

module.exports.registerGetRoute = (req, res, next) => {
  res.render("register", {
    title: "Register",
  });
};

module.exports.loginGetRoute = (req, res, next) => {
  res.render('login', {
    title: 'Login'
  })
}
