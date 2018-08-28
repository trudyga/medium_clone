'use strict';

const express = require('express');
const graphql = require('express-graphql');
const mongoose = require('mongoose');

const config = require('./config');
const schema = require('./schema');
const app = express();

/**
 * Main Endpoint
 */
app.get('/', function (req, res) {
    res.send('App Works');
});

/**
 * Authentication Middleware
 */
const passport = require('passport');
const AuthStrategy = require('./services/AuthStrategy.service');
passport.use(AuthStrategy.getPassportJWTStrategy());
app.use(passport.initialize());

app.all('*', function(req, res, next) {
    passport.authenticate('bearer', function(err, user) {
        if (err)
            return next(err);

        req.user = user;
        return next();
    })(req, res, next);
});

/**
 * Graph QL Endpoint
 */
app.use('/graphql', graphql({
    schema,
    graphiql: true
}));

/**
 * Establish DB Connection
 */
mongoose.connect(config.storage.connection);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
   console.log('Storage connection established successfully');

   app.listen(config.instance.port,
       () => console.log(`Application is listening on port ${4000}`));
});