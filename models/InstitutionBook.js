const Sequelize = require('sequelize');

const db = require('../db');

const InstitutionBook = db.define('institutions_books', {
  institution_id: Sequelize.INTEGER,
  book_id: Sequelize.INTEGER,
}, {underscored: true});

InstitutionBook.associate = function(models) {};

module.exports = InstitutionBook;
