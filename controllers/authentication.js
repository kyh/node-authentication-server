const jwt = require('jwt-simple');
const User = require('../models/user');
const config = require('../config');

/**
 * Tokenize user object
 *
 * @param {user} user - user model
 * @return {jwt} authentication token
 */
function tokenizeUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({
    sub: user.id,
    iat: timestamp
  }, config.secret);
}

exports.signup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(422).send({
      error: 'Email and password must be provided'
    });
  }

  // See if user exists
  return User.findOne({ email }, (err, existingUser) => {
    if (err) { return next(err); }

    // If user exists, return error
    if (existingUser) {
      return res.status(422).send({
        error: 'Email already exists'
      });
    }

    // If user does NOT exist, create and save user record
    const user = new User({
      email, password
    });

    return user.save((saveError) => {
      if (saveError) { return next(saveError); }
      return res.json({
        token: tokenizeUser(user)
      });
    });
  });
};
