// config/passport.js

// load all the things we need
var LocalStrategy = require("passport-local").Strategy;
// var hashers = require("node-django-hashers");
// var h = new hashers.PBKDF2PasswordHasher();
// var hash1 = h.encode("123", "dejvbjkdvjbsjkvbjdbsvjsv");
// console.log(hash1);
// console.log(h.verify("123", hash1));

// load up the user model
var User = require("../models").user;

// expose this function to our app using module.exports
module.exports = function (passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

    // used to deserialize the user
  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });

  passport.use("local-login", new LocalStrategy({
    usernameField: "user_name",
    passwordField : 'password',
    passReqToCallback: true // allows us to pass back the entire request to the callback
  },
    function (req, user_name, password, done) { // callback with user_name and password from our form
      console.log(password);
        // find a user whose user_name is the same as the forms user_name
        // we are checking to see if the user trying to login already exists
      User.findOne({ "local.user_name": user_name }, function (err, user) {
            // if there are any errors, return the error before anything else
        if (err)
                { return done(err); }

            // if no user is found, return the message
        if (!user)
                { return done(null, false, req.flash("loginMessage", "No user found.")); } // req.flash is the way to set flashdata using connect-flash

            // var hash1 = h.encode(user.password, h.salt());
            // var hash1 = h.encode(user.password, 'dejvbjkdvjbsjkvbjdbsvjsv');

            // console.log(h.verify(password, hash1));
            // // if the user is found but the password is wrong
            // if (!h.verify(password, hash1))
            //     return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

            // all is well, return successful user
        return done(null, user);
      });

    }));

};