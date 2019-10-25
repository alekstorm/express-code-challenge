const Sequelize = require('sequelize');

const db = require('../db');

const User = db.define('users', {
  name: Sequelize.STRING,
  email: Sequelize.STRING,
  password: Sequelize.STRING,
  role: Sequelize.ENUM('academic', 'administrator', 'student'),
  institution_id: Sequelize.INTEGER,
}, {underscored: true});

User.associate = function(models) {
  User.Institution = User.belongsTo(models.Institution);
};

module.exports = User;
