"use strict";

const passport = require("passport");

const LocalStrategy = require("passport-local");

const bcrypt = require("bcrypt");

const models = require("../models");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    let user = await models.User.findOne({
      attributes: ["id", "email", "firstName", "lastName", "mobile", "isAdmin"],
      where: { id },
    });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

passport.use(
  "local-login",
  new LocalStrategy(
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
          // user chua dang nhap
          let user = await models.User.findOne({ where: { email } });
          if (!user) {
            return done(
              null,
              false,
              req.flash("loginMessage", "Email does not exits!")
            );
          }
          if (!bcrypt.compareSync(password, user.password)) {
            // mk ko dung
            return done(
              null,
              false,
              req.flash("loginMessage", "Invalid Password")
            );
          }
          return done(null, user);
        }

        //bo qua dang nhap
        done(null, req.user);
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.use(
  "local-register",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      if (email) {
        email = email.toLowerCase();
      }

      if (req.user) {
        return done(null, req.user);
      }
      try {
        console.log("hi");
        let user = await models.User.findOne({ where: { email } });
        if (user) {
          return done(
            null,
            false,
            req.flash("registerMessage", "Email is already taken!")
          );
        }

        user = await models.User.create({
          email: email,
          password: bcrypt.hashSync(password, bcrypt.genSaltSync(8)),
          firstName: req.body.firstName,
          lasName: req.body.lastName,
          mobile: req.body.mobile,
        });

        // thong bao dang ky thanh cong

        done(
          null,
          false,
          req.flash(
            "registerMessage",
            "You have registerd successfully. Please login!"
          )
        );
      } catch (error) {
        done(error);
      }
    }
  )
);

module.exports = passport;
