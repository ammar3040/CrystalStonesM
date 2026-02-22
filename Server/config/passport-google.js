// config/passport-google.js
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const UserModel = require('../models/UserModel');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
module.exports = (passport) => {
  passport.use('google', new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.BACKEND_LINK}/api/google/callback`,
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const existingUser = await UserModel.findOne({ email: profile.emails[0].value });

      if (existingUser) {
        if (existingUser.is_deleted) {
          return done(null, false, { message: 'Account is deleted' });
        }
        return done(null, existingUser);
      }

      const newUser = new UserModel({
        Uname: profile.displayName,
        email: profile.emails[0].value,
        googleId: profile.id,
        password: null,
        mobile: null
      });

      const savedUser = await newUser.save();
      return done(null, savedUser);
    } catch (err) {
      return done(err, null);
    }
  }));
};
