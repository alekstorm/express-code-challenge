const Sequelize = require('sequelize');

const db = require('../db');

const Institution = db.define('institutions', {
  name: Sequelize.STRING,
  url: Sequelize.STRING,
  email_domain: Sequelize.STRING,
}, {underscored: true});

Institution.associate = function(models) {
  Institution.Books = Institution.belongsToMany(models.Book, {
    through: 'institutions_books',
    as: 'books',
    foreignKey: 'institution_id',
    otherKey: 'book_id',
  });

  Institution.Users = Institution.belongsToMany(models.User, {
    through: 'institutions_users',
    as: 'users',
    foreignKey: 'institution_id',
    otherKey: 'user_id',
  });
};

module.exports = Institution;
