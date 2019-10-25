const supertest = require('supertest');

const app = require('../../app')({secret: 'secret'});
const db = require('../../db');
const Institution = require('../../models/Institution');
const User = require('../../models/User');
const {associate} = require('../../models');
const users = require('../../routes/users');
const {compareHash, hash} = require('../../util');

app.use('/', users);

const SIGNIN_PARAMS = {
  email: 'chomsky@mit.edu',
  password: 'colorlessGreenIdeas',
};

const USER_PARAMS = {
  name: 'Noam Chomsky',
  email: 'chomsky@mit.edu',
  password: 'colorlessGreenIdeas',
  role: 'academic',
};

describe('User routes', () => {
  beforeAll(async () => {
    await db.sync({force: true});
    associate();
  });

  beforeEach(() => db.sync({force: true}));

  describe('POST /users/signin', () => {
    beforeEach(async () => (
      User.create({
        name: 'Noam Chomsky',
        email: 'chomsky@mit.edu',
        password: await hash('colorlessGreenIdeas'),
        role: 'academic',
      })
    ), 30000);

    it('should fail when email is missing', async () => {
      const res = await supertest(app)
        .post('/signin')
        .send({...SIGNIN_PARAMS, email: null});
      expect(res.statusCode).toEqual(400);
    }, 30000);

    it('should fail when email is nonexistent', async () => {
      const res = await supertest(app)
        .post('/signin')
        .send({...SIGNIN_PARAMS, email: 'jakobson@mit.edu'});
      expect(res.statusCode).toEqual(401);
    }, 30000);

    it('should fail when password is missing', async () => {
      const res = await supertest(app)
        .post('/signin')
        .send({...SIGNIN_PARAMS, password: null});
      expect(res.statusCode).toEqual(400);
    }, 30000);

    it('should fail when password is incorrect', async () => {
      const res = await supertest(app)
        .post('/signin')
        .send({...SIGNIN_PARAMS, password: 'incorrect'});
      expect(res.statusCode).toEqual(401);
    }, 30000);

    it('should sign in', async () => {
      const res = await supertest(app)
        .post('/signin')
        .send(SIGNIN_PARAMS);
      expect(res.statusCode).toEqual(302);
      expect(res.headers).toHaveProperty('set-cookie');
    }, 30000);
  });

  describe('POST /users/create', () => {
    async function createUser(params) {
      return await supertest(app)
        .post('/create')
        .send(params);
    }

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
      await User.create({
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
      const institution = await Institution.create({
        name: 'MIT',
        url: 'https://web.mit.edu',
        email_domain: 'mit.edu',
      });

      const res = await createUser(USER_PARAMS);
      expect(res.statusCode).toEqual(201);
      expect(res.body).toEqual({status: 'success', data: null});

      const user = await User.findOne({
        where: {email: 'chomsky@mit.edu'},
      });
      expect(user).toMatchObject({
        name: 'Noam Chomsky',
        email: 'chomsky@mit.edu',
        role: 'academic',
        institution_id: institution.id,
      });

      const passwordMatched = await compareHash('colorlessGreenIdeas', user.password);
      expect(passwordMatched).toBe(true);
    }, 30000);
  });
});
