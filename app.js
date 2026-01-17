const express = require('express');
const expressSession = require('express-session');
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const passport = require('passport');
const path = require('path');

const pclient = require('./db/client');
const indexRouter = require('./routes/index'); 
const driveRouter = require('./routes/driveRoute');
const shareRoute = require('./routes/shareRoute');

require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', './views');

// Parsers

// Allows the use of static code such as CSS and clientside JS, uses 'path' package to create the path of the 'public' folder/directory
app.use(express.static(path.join(__dirname, 'public')));

// Allows parsing of POST forms
app.use(express.urlencoded({ extended: true }));

// Allows parsing of JSON
app.use(express.json());

// Session and SessionStore Setup
app.use(
    expressSession({
        cookie: {
            maxAge: 1 * 24 * 60 * 60 * 1000 // 1 day
        },
        secret: process.env.SECRET,
        resave: true,
        saveUninitialized: true,
        store: new PrismaSessionStore(
            pclient,
            {
                checkPeriod: 2 * 60 * 10,
                dbRecordIdIsSessionId: true,
                dbRecordIdFunction: undefined,
            }
        )

    })
)

// Passport Setup
require('./config/passport');

// Has to do with serialize and deserialize of user
// Express session gives us access to the `req.session` object anything we store in the req.session object will persist into the database under the 'session' collection/table
app.use(passport.session());

// Logger Middleware
app.use((req, res, next) => {
  console.log(req.session);
  console.log(req.user);
  next();
});

// Route middlwares
app.use('/', indexRouter);
app.use('/drive', driveRouter);
app.use('/share', shareRoute);

app.listen(PORT, () => {
  console.log("Listening to Port", PORT);
})