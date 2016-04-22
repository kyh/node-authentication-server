const User = require('../models/user');

exports.signup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  // See if user exists
  User.findOne({ email }, (err, existingUser) => {
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
      return res.json({ success: true });
    });
  });
};
