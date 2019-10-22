const User = require("../models/user");
const config = require("../config");
const jwt = require("jwt-simple");

function tokenForUser(user) {
  //what is sub? it is a convention for JWTs that means subject, which in our case is the user
  //iat is another convention that means "issued at time"
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

exports.signin = function(req, res, next) {
  //user has already had their email and password auth'd
  // we just need to give them a token
  res.send({ token: tokenForUser(req.user) });
};

exports.signup = function(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res
      .status(422)
      .send({ error: "You must provide an email and password" });
  }

  //see if a user with a given email exists
  User.findOne({ email }, (err, existing) => {
    if (err) return next(err);

    //if a user with email does exist, return an error
    if (existing) {
      //422 means 'unprocessable entity'
      return res.status(422).send({ error: "Email is in use" });
    }

    //if a user with email does not exist, create and saave user record
    const user = new User({
      email,
      password
    });

    user.save(err => {
      if (err) return next(err);
    });

    //respond to request indicating the user was created
    res.json({ token: tokenForUser(user) });
  });
};
