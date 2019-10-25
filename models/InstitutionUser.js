const db = require('../db');

const InstitutionUser = db.define('institutions_users', {}, {underscored: true});

InstitutionUser.associate = function(models) {};

module.exports = InstitutionUser;
