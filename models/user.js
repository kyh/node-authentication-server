const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const Schema = mongoose.Schema;

// Model definition
const userSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  password: String
});

// On Save Hook, encrypt password
userSchema.pre('save', function preSave(next) {
  const user = this;

  // generate a salt then run callback
  return bcrypt.genSalt(10, (saltGenError, salt) => {
    if (saltGenError) { return next(saltGenError); }

    // hash the password using the salt
    return bcrypt.hash(user.password, salt, null, (hashError, hash) => {
      if (hashError) { return next(hashError); }

      // overwrite password with encrypted password
      user.password = hash;
      return next();
    });
  });
});

function comparePassword(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) { return callback(err); }

    return callback(null, isMatch);
  });
}

userSchema.methods.comparePassword = comparePassword;

const ModelClass = mongoose.model('user', userSchema);

module.exports = ModelClass;
