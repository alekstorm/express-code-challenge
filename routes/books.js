const express = require('express')

const Institution = require('../models/Institution');
const User = require('../models/User');
const {authenticated} = require('../util');

const router = express.Router();

router.get('/', authenticated, async (req, res) => {
  const user = await User.findByPk(req.user.id, {
    include: [{
      association: User.Institutions,
      include: [{
        association: Institution.Books,
      }],
    }],
  });

  const books = user.institutions.flatMap((institution) => institution.books);
  res.status(200).send(books);
});

module.exports = router;
