const Sequelize = require('sequelize');

const db = require('../db');

const User = db.define('users', {
  name: Sequelize.STRING,
  email: Sequelize.STRING,
  password: Sequelize.STRING,
  role: Sequelize.ENUM('academic', 'administrator', 'student'),
}, {underscored: true});

User.associate = function(models) {
  User.Institutions = User.belongsToMany(models.Institution, {
    through: 'institutions_users',
    as: 'institutions',
    foreignKey: 'user_id',
    otherKey: 'institution_id',
  });
};

module.exports = User;
