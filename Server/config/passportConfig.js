// config/passport-config.js
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const UserModel = require('../models/UserModel');

module.exports = (passport) => {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
      try {
        const user = await UserModel.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });
        if (!user) return done(null, false, { message: 'User not found' });

        let isMatch = false;
        try {
          isMatch = await bcrypt.compare(password, user.password);
        } catch (e) {
          isMatch = false;
        }

        if (!isMatch) {
          // Fallback to plain text comparison
          isMatch = (password === user.password);
        }

        if (!isMatch) return done(null, false, { message: 'Incorrect password' });

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );
};
