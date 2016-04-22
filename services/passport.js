const passport = require('passport');
const User = require('../models/user');
const config = require('../config');

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

// Setup options for Local Strategy
const localOptions = {
  usernameField: 'email'
};

const localLogin = new LocalStrategy(localOptions, (email, password, done) => {
  // verify email and password
  User.findOne({ email }, (err, user) => {
    if (err) { return done(err); }
    if (!user) { return done(null, false); }

    // compare passwords - is `password` === user.password
    return user.comparePassword(password, (comparisonError, isMatch) => {
      if (comparisonError) { return done(err); }
      if (!isMatch) { return done(null, false); }

      return done(null, user);
    });
  });
});

// Setup options for JWT Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret
};

// Create JWT strategy
const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
  // Check if user ID in the payload exists in the database
  User.findById(payload.sub, (err, user) => {
    if (err) { return done(err, false); }
    if (user) {
      return done(null, user);
    }

    return done(null, false);
  });
});

passport.use(jwtLogin);
passport.use(localLogin);

module.exports = passport;
