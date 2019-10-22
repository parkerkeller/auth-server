const passport = require("passport");
const User = require("../models/user");
const config = require("../config");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const LocalStrategy = require("passport-local");

//create local strategy - this is what we are using to verify email/passwords

//this is going to tell our local strategy where in the request to find data, and it will default to looking for "username" unless otherwise specified
//we want to replace usernameField with a search for email
//password will automaticall be searched for and does not need to be specified
const localOptions = { usernameField: "email" };

const localLogin = new LocalStrategy(localOptions, (email, password, done) => {
  //verify this email and password, call done with the user
  //if it is the correct email and password
  //else call done with false
  User.findOne({ email }, (err, user) => {
    if (err) return done(err);
    if (!user) return done(null, false);

    //compare passwords - is `password` equal to user.password?
    user.comparePassword(password, function(err, isMatch) {
      if (err) return done(err);
      if (!isMatch) return done(null, false);

      return done(null, user);
    });
  });
});

//setup options for JWT strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader("authorization"),
  secretOrKey: config.secret
};

//create jwt strategy - this is what will verify the presence of a JWT
const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
  //see if the user id in the payload exists in our database
  //if it does, call done with that user
  //otherwise, call done without the user object
  User.findById(payload.sub, (err, user) => {
    if (err) return done(err, false);

    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  });
});

//tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);
