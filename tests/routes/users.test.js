const util = require('util');

const bcrypt = require('bcrypt');
const express = require('express');
const supertest = require('supertest');

const models = require('../../models');
const users = require('../../routes/users');

beforeEach(() => (
  Promise.all(Object.values(models).map((model) => model.sync({force: true})))
));

const app = express();
app.use(express.json());
app.use('/', users);

const USER_PARAMS = {
  name: 'Noam Chomsky',
  email: 'chomsky@mit.edu',
  password: 'colorlessGreenIdeas',
  role: 'academic',
};

async function createUser(params) {
  return await supertest(app)
    .post('/create')
    .send(params);
}

describe('User routes', () => {
  it('should fail when name is missing', async () => {
    const res = await createUser({...USER_PARAMS, name: null});
    expect(res.statusCode).toEqual(422);
    expect(res.body).toEqual({status: 'fail', data: {name: 'Invalid value'}});
  });

  it('should fail when email is missing', async () => {
    const res = await createUser({...USER_PARAMS, email: null});
    expect(res.statusCode).toEqual(422);
    expect(res.body).toEqual({status: 'fail', data: {email: 'Invalid value'}});
  });

  it('should fail when email is invalid', async () => {
    const res = await createUser({...USER_PARAMS, email: 'not-an-email'});
    expect(res.statusCode).toEqual(422);
    expect(res.body).toEqual({status: 'fail', data: {email: 'Invalid value'}});
  });

  it('should fail when email is taken', async () => {
    await models.User.create({
      name: 'Impostor',
      email: 'chomsky@mit.edu',
      password: 'password',
      role: 'academic',
    });

    const res = await createUser(USER_PARAMS);
    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual({status: 'fail', data: {email: 'User with specified email address already exists'}});
  });

  it('should fail when email domain doesn\'t match an institution', async () => {
    const res = await createUser(USER_PARAMS);
    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual({status: 'fail', data: {email: 'Institution with the domain of the specified email address does not exist'}});
  });

  it('should fail when password is missing', async () => {
    const res = await createUser({...USER_PARAMS, password: null});
    expect(res.statusCode).toEqual(422);
    expect(res.body).toEqual({status: 'fail', data: {password: 'Invalid value'}});
  });

  it('should fail when password is too short', async () => {
    const res = await createUser({...USER_PARAMS, password: 'short'});
    expect(res.statusCode).toEqual(422);
    expect(res.body).toEqual({status: 'fail', data: {password: 'Invalid value'}});
  });

  it('should fail when role is missing', async () => {
    const res = await createUser({...USER_PARAMS, role: null});
    expect(res.statusCode).toEqual(422);
    expect(res.body).toEqual({status: 'fail', data: {role: 'Invalid value'}});
  });

  it('should fail when role is unrecognized', async () => {
    const res = await createUser({...USER_PARAMS, role: 'not-a-role'});
    expect(res.statusCode).toEqual(422);
    expect(res.body).toEqual({status: 'fail', data: {role: 'Invalid value'}});
  });

  it('should succeed', async () => {
    const institution = await models.Institution.create({
      name: 'MIT',
      url: 'https://web.mit.edu',
      email_domain: 'mit.edu',
    });

    const res = await createUser(USER_PARAMS);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual({status: 'success', data: null});

    const user = await models.User.findOne({
      where: {email: 'chomsky@mit.edu'},
      include: [{association: models.User.Institutions}],
    });
    expect(user).toMatchObject({
      name: 'Noam Chomsky',
      email: 'chomsky@mit.edu',
      role: 'academic',
    });

    const passwordMatched = await util.promisify(bcrypt.compare)('colorlessGreenIdeas', user.password);
    expect(passwordMatched).toBe(true);

    expect(user.institutions.length).toEqual(1);
    expect(user.institutions[0].id).toEqual(institution.id);
  }, 15000);
});
