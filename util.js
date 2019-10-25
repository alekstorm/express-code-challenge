const util = require('util');

const bcrypt = require('bcrypt');

const HASH_ROUNDS = 16;

async function hash(data) {
  return await util.promisify(bcrypt.hash)(data, HASH_ROUNDS);
}

async function compareHash(data, hash) {
  return await util.promisify(bcrypt.compare)(data, hash);
}

function authenticated(req, res, next) {
  if (req.user) {
    next();
  } else {
    res.status(401).send();
  }
}

module.exports = {
  authenticated,
  hash,
  compareHash,
};
