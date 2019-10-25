const Sequelize = require('sequelize');

const db = require('../db');

const InstitutionUser = db.define('institutions_users', {
  institution_id: Sequelize.INTEGER,
  user_id: Sequelize.INTEGER,
}, {underscored: true});

InstitutionUser.associate = function(models) {};

module.exports = InstitutionUser;
