const express = require('express')
const {body, validationResult} = require('express-validator');
const passport = require('passport');

const Institution = require('../models/Institution');
const User = require('../models/User');
const db = require('../db');
const {hash} = require('../util');

const router = express.Router();

router.post('/signin', passport.authenticate('local', {successRedirect: '/'}));

router.post('/create', [
    body('name').isLength({min: 1}),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({min: 6}),
    body('role').isIn(['academic', 'administrator', 'student']),
  ], async (req, res) => {
  await db.transaction(async (transaction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({status: 'fail', data: Object.fromEntries(errors.array().map(({msg, param}) => [param, msg]))});
    }

    const existingUser = await User.findOne({
      where: {email: req.body.email},
    }, {transaction});
    if (existingUser) {
      return res.status(400).send({
        status: 'fail',
        data: {
          email: 'User with specified email address already exists',
        },
      });
    }

    const [, emailDomain] = req.body.email.split('@');
    const institution = await Institution.findOne({
      where: {email_domain: emailDomain},
    }, {transaction});
    if (!institution) {
      return res.status(400).send({
        status: 'fail',
        data: {
          email: 'Institution with the domain of the specified email address does not exist',
        },
      });
    }

    await User.create({
      name: req.body.name,
      email: req.body.email,
      role: req.body.role, // TODO authorize?
      password: await hash(req.body.password),
      institution_id: institution.id,
    }, {transaction});

    res.status(201).send({status: 'success', data: null});
  });
});

module.exports = router;
