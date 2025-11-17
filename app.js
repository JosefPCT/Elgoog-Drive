const express = require('express');
const expressSession = require('express-session');
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const pclient = require('./db/client');

const indexRouter = require('./routes/index'); 

require('dotenv').config();
const app = express();
const PORT = process.env.PORT | 3000;

app.set('view engine', 'ejs');
app.set('views', './views');

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

app.use('/', indexRouter);

app.listen(PORT, () => {
  console.log("Listening to Port", PORT);
})