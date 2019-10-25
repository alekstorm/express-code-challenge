const express = require('express');
const passport = require('passport');
const {Strategy: LocalStrategy} = require('passport-local');

const User = require('./models/User');

const {compareHash} = require('./util');

function createApp(config) {
  const app = express();
  app.use(express.json());
  app.use(require('body-parser').urlencoded({extended: true}));
  app.use(require('cookie-parser')());
  app.use(require('express-session')({
    secret: config.secret,
    resave: false,
    saveUninitialized: true,
  }));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(new LocalStrategy(
    {usernameField: 'email'},
    async (email, password, done) => {
      const user = await User.findOne({where: {email}});
      if (!user) {
        return done(null, false);
      }

      const matched = await compareHash(password, user.password);
      if (!matched) {
        return done(null, false);
      }

      return done(null, user);
    }
  ));

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    const user = await User.findByPk(id);
    done(null, user);
  });

  return app;
}

module.exports = createApp;
