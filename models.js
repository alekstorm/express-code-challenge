const Book = require('./models/Book.js');
const Institution = require('./models/Institution.js');
const InstitutionBook = require('./models/InstitutionBook.js');
const InstitutionUser = require('./models/InstitutionUser.js');
const User = require('./models/User.js');

const models = {Book, Institution, InstitutionBook, InstitutionUser, User};
Object.values(models).forEach((model) => {
  model.associate(models);
});

module.exports = models;
