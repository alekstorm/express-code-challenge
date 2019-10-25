const express = require('express')

const Institution = require('../models/Institution');
const User = require('../models/User');
const {authenticated} = require('../util');

const router = express.Router();

router.get('/', authenticated, async (req, res) => {
  const user = await User.findByPk(req.user.id, {
    include: [{
      association: User.Institution,
      include: [{
        association: Institution.Books,
      }],
    }],
  });

  res.status(200).send({status: 'success', data: user.institution.books});
});

module.exports = router;
