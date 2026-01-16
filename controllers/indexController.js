const passport = require('passport');
const { body, validationResult, matchedData } = require("express-validator");

const queries = require("../db/queries");
const { validatePassword, genPassword } = require("./utils/passwordUtils");
const { isAuth } = require('./utils/authMiddleware');
const upload = require("../config/multer");

// Validation Messages 
const emptyErr = `must not be empty`;
const notSamePassErr = `Password field and Confirm Password field must be the same`;
const emailAlreadyExistsErr = `Email already exists.`;

// Custom Validators

// Custom validator to check if both password and confirm password field is the same value
const isSamePass = (value, { req }) => {
  if (value !== req.body.password) {
    throw new Error(notSamePassErr);
  }
  return true;
};

// Custom validator to check if email already exists in the DB
const emailExists = async (value) => {
  const data = await queries.findUserByEmail(value);
  if (data) {
    throw new Error(emailAlreadyExistsErr);
  }
  return true;
};

// Validation
// Uses custom methods from express-validator package
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

// POST route handler for route '/register'
// Checks for validation errors with express-validator package
// If no error, generates a hashed password and inserts the data to the DB
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

    const user = await queries.createUserAndMainFolderThenReturn(email,hash, first_name,last_name);
    // console.log('Created user id', user.id);
    // await queries.createMainDriveOfUserById(user.id);

    // Might need to redirect instead
    res.send("Post route");
  },
];

// POST route handler for route '/login'
// Uses passport package to authenticate users, which in turns uses express-session
module.exports.loginPostRoute = [
  passport.authenticate('local', {
    failureRedirect: '/login-failure',
    successRedirect: '/login-success'
  })
]



// Get Routes

// GET route handler for route '/'
// Only job is to redirect to a route depending if user is authenticated or not
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

  console.log(`Home User:`, req.user);

  if(req.user){
    res.redirect('/drive/my-drive');
  } else {
    res.redirect('/login');
  }
  // res.render("index", {
  //   title: "Home",
  // });
};

// GET route handler for route '/register'
// Renders a register view with a form
module.exports.registerGetRoute = (req, res, next) => {
  res.render("register", {
    title: "Register",
  });
};

// GET route handler for route '/login'
// Renders a login view with a form
module.exports.loginGetRoute = (req, res, next) => {
  res.render('login', {
    title: 'Login'
  })
}

// GET route handler for route '/login-success'
// Used in conjuction with the POST route handler for login
module.exports.loginSuccessGetRoute = (req, res, next) => {
  console.log('Login Success, showing user');
  console.log(req.user);
  // res.send("Login successs");
  // res.redirect('/protected-route');
  res.redirect('/drive/my-drive');
}

// GET route handler for route '/login-failure'
// Used in conjuction with the POST route handler for login
module.exports.loginFailureGetRoute = (req, res, next) => {
  res.send('You entered the wrong password.');
}

// Get route handler for route '/logout'
// Uses the method `req.logout` from the 'passport' package to logout the user in session and redirects to the index page if no error
module.exports.logoutGetRoute = (req, res, next) => {
  // `req.logout()` is now asynchronous now needs a callback
  req.logout((err) => {
    if(err) { return next(err); }
    // res.redirect('/protected-route');
    res.redirect('/');
  });
}

// Test route, not used in production
// To test isAuth middleware if working correctly
module.exports.protectedGetRoute = [
  isAuth,
  async(req, res, next) => {
    res.send("Protected Route");
  }
]

