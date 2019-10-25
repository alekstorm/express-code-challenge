const Sequelize = require('sequelize');

const db = require('../db');

const Book = db.define('books', {
  isbn: Sequelize.STRING,
  title: Sequelize.STRING,
  author: Sequelize.STRING,
}, {});

Book.associate = function(models) {
  Book.belongsToMany(models.Institution, {
    through: 'institutions_books',
    as: 'institutions',
    foreignKey: 'book_id',
    otherKey: 'institution_id',
  });
};

module.exports = Book;
