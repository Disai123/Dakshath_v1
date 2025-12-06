const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { User } = require('../models');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user exists
        let user = await User.findOne({
          where: { google_id: profile.id }
        });

        if (user) {
          // Update last login
          await user.update({ last_login: new Date() });
          return done(null, user);
        }

        // Check if user exists by email
        user = await User.findOne({
          where: { email: profile.emails[0].value }
        });

        if (user) {
          // Update with Google ID
          await user.update({
            google_id: profile.id,
            avatar: profile.photos[0]?.value,
            last_login: new Date()
          });
          return done(null, user);
        }

        // For Google OAuth, only allow existing users (students)
        // Don't create new users via Google OAuth - they should already exist in LMS
        // If user doesn't exist, redirect to registration or show error
        return done(new Error('User not found. Please use email/password login or contact administrator.'), null);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;

