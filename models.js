const Book = require('./models/Book.js');
const Institution = require('./models/Institution.js');
const InstitutionBook = require('./models/InstitutionBook.js');
const InstitutionUser = require('./models/InstitutionUser.js');
const User = require('./models/User.js');

const MODELS = {
  Book,
  Institution,
  InstitutionBook,
  InstitutionUser,
  User,
};

function associate() {
  Object.values(MODELS).forEach((model) => {
    model.associate(MODELS);
  });
}

module.exports = {
  associate,
};
