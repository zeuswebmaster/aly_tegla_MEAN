var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');

passport.use(new LocalStrategy({
    usernameField: 'email'
  },
  function(username, password, done) {
   //User.deleteMany({ email: username}, function (err) {console.log(err);});    
    User.findOne({ email: username}, function (err, user) {
        if (err) { return done(err); }
        // Return if user not found in database
        if (!user) {
            return done(null, false, {
            message: 'User does not exist in our database'
            });
        }
        
        if (user && !user.verified) {
            return done(null, false, user);
        }
        // Return if password is wrong
        if (!user.validPassword(password)) {
            return done(null, false, {
            message: 'Invalid password'
            });
        }
        // If credentials are correct, return the user object
        return done(null, user);
    });
  }
));
