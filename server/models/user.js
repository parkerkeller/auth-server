const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt-nodejs");
const SALT = 10;
//define our model
const userSchema = new Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true }
});

//on save hook, encrypt passowrd
//before saving a model, run this function (pre is a brcypt method)
userSchema.pre("save", function(next) {
  //get access to the user model
  const user = this;

  //generate a salt, then run callback
  bcrypt.genSalt(SALT, (err, salt) => {
    if (err) return next(err);

    //hash (encrypt) our password using the salt
    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if (err) return next(err);
      //overwrite plain text password with encrypted password
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) return callback(err);

    callback(null, isMatch);
  });
};

//create the model class
//"user" is the collection that will be filled with documents that follow userSchema
const ModelClass = mongoose.model("user", userSchema);

//export the model
module.exports = ModelClass;
