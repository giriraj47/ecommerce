const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const userModel = require("../models/user.model");
const { sendRegistrationEmail } = require("../services/email.service");
const bcrypt = require("bcrypt");


/* Passport Middleware */
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID, // Client ID
      clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Client secret
      callbackURL: "http://localhost:3000/api/auth/google/callback",
    },
    async function (token, tokenSecret, profile, done) {
      try {
        const email = profile.emails[0].value;
        let user = await userModel.findOne({ email });

        if (user) {
          // 2. If they exist but don't have their Google ID saved yet, link it!
          if (!user.googleId) {
            user.googleId = profile.id;
            // Optional: you can also sync their profile picture if they don't have one
            if (!user.avatar) user.avatar = profile.photos[0].value;

            await user.save();
          }

          // Log them in successfully
          return done(null, user);
        }

        if (!user) {
          const hashedPassword = await bcrypt.hash(profile.id, 10);
          user = await userModel.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id,
            password: hashedPassword,
          });

          // Send registration email for new Google users
          await sendRegistrationEmail(user.email, user.name);
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    },
  ),
);

/* How to store the user information in the session */
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

/* How to retrieve the user from the session */
passport.deserializeUser(async function (id, done) {
  try {
    const user = await userModel.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

/* Exporting Passport Configuration */
module.exports = passport;
