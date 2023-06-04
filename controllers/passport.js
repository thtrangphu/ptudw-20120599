"use strict";

const passport = require("passport");

const localStrategy = require("passport-local");
const bcrypt = require("bcrypt");
const models = require("../models");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    let user = await models.User.findOne({
      attributes: [
        "id",
        "username",
        "firstName",
        "lastName",
        "mobile",
        "isAdmin",
      ],
      where: { id },
    });
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

passport.use(
  "local-login",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      if (email) {
        email = email.toLowerCase();
      }
      try {
        if (!req.user) {
          let user = await models.User.findOne({ where: { email } });
          if (!user) {
            return done(
              null,
              false,
              req.flash("loginMessage", "Email does not exist")
            );
          }
          if (!bcrypt.compareSync(password, user.password)) {
            return done(
              null,
              false,
              req.flash("loginMessage", "Invalid Password")
            );
          }
          return done(null, user);
        }
        done(null, req.user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

module.exports = passport;
