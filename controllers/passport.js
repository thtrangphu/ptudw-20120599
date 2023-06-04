"use strict";

const passport = require("passport");

const localStrategy = require("passport-local");
const bcrypt = require("bcrypt");
const models = require("../models");
const { password } = require("pg/lib/defaults");
// ham dc goi khi xac thuc thanh cong va luu thong tin user vao session
passport.serializeUser((user, done) => {
  done(null, user.id);
});
// ham dc goi khi xac thuc boi password.session lay thong tin user tu csdl
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
// ham xac thuc khi nguoi dung dang nhap
passport.use(
  "local-login",
  new localStrategy(
    {
      usernameField: "email",
      passportField: "password",
      passReqToCallback: true,
    },
    async (req, email, passport, done) => {
      if (email) {
        email = email.toLowerCase();
      }
      try {
        if (!req.user) {
          // neu chua dang nhap
          let user = await models.User.findOne({ where: { email } });
          if (!user) {
            // chua ton tai email
            return done(
              null,
              false,
              req.flash(
                "loginMessage",
                false,
                req.flash("Email does not exist")
              )
            );
          }
          if (!bcrypt.compareSync(password, user.password)) {
            // sai mk
            return done(
              null,
              flase,
              req.flash("loginMessage", "Invalid Password")
            );
          }
          return done(null, user);
        }
        // bo qua dang nhap
        done(null, req.user);
      } catch (error) {
        //
        done(error, null);
      }
    }
  )
);

module.exports = passport;
