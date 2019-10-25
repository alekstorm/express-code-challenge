const db = require('../db');

const InstitutionBook = db.define('institutions_books', {}, {underscored: true});

InstitutionBook.associate = function(models) {};

module.exports = InstitutionBook;
