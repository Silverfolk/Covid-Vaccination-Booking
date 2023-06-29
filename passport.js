const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('./models/user');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  }).catch((err) => {
    done(err);
  });
});

const localStrategy = new LocalStrategy({
  usernameField: 'email'
}, (username, password, done) => {
  User.findOne({email: username}).then((user) => {
    if (!user) {
      return done(null, false, {
        message: 'Incorrect username or password'
      });
    }

    if (!user.validPassword(password)) {
      return done(null, false, {
        message: 'Incorrect username or password'
      });
    }

    return done(null, user);
  }).catch((err) => {
    return done(err);
  });
});

passport.use(localStrategy);
