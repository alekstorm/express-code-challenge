const express = require('express');

function appWithUser(app, user) {
  const wrapperApp = express();
  wrapperApp.all('*', (req, res, next) => {
    req.user = user;
    next();
  });
  wrapperApp.use(app);
  return wrapperApp;
}

module.exports = {
  appWithUser,
};
