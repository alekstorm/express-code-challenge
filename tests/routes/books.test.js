const supertest = require('supertest');

const app = require('../../app')({secret: 'secret'});
const db = require('../../db');
const {associate} = require('../../models');
const Book = require('../../models/Book');
const Institution = require('../../models/Institution');
const InstitutionBook = require('../../models/InstitutionBook');
const InstitutionUser = require('../../models/InstitutionUser');
const User = require('../../models/User');
const books = require('../../routes/books');
const {hash} = require('../../util');
const {appWithUser} = require('../util');

app.use('/', books);

describe('Book routes', () => {
  beforeAll(async () => {
    await db.sync({force: true});
    associate();
  });

  beforeEach(() => db.sync({force: true}));

  describe('GET /books', () => {
    it('should fail when unauthenticated', async () => {
      const res = await supertest(appWithUser(app, null))
        .get('/')
        .send();
      expect(res.statusCode).toEqual(401);
    }, 30000);

    it('should get all books for user', async () => {
      const user = await User.create({
        name: 'Noam Chomsky',
        email: 'chomsky@mit.edu',
        password: await hash('colorlessGreenIdeas'),
        role: 'academic',
      });

      const mit = await Institution.create({
        name: 'Massachusetts Institute of Technology',
        url: 'https://web.mit.edu',
        email_domain: 'mit.edu',
      });

      const computerScience = await Book.create({
        isbn: '978-0132166751',
        title: 'A Balanced Introduction to Computer Science',
        author: 'David Reed',
      });
      const languageSounds = await Book.create({
        isbn: '978-0631198154',
        title: 'The Sounds of the World\'s Languages',
        author: 'Peter Ladefoged',
      });

      await InstitutionBook.create({
        institution_id: mit.id,
        book_id: computerScience.id,
      });
      await InstitutionBook.create({
        institution_id: mit.id,
        book_id: languageSounds.id,
      });

      await InstitutionUser.create({
        institution_id: mit.id,
        user_id: user.id,
      });

      const res = await supertest(appWithUser(app, user))
        .get('/')
        .send();
      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toEqual(2);
      expect(res.body.filter(({id}) => id === computerScience.id)[0]).toMatchObject({
        isbn: '978-0132166751',
        title: 'A Balanced Introduction to Computer Science',
        author: 'David Reed',
      });
      expect(res.body.filter(({id}) => id === languageSounds.id)[0]).toMatchObject({
        isbn: '978-0631198154',
        title: 'The Sounds of the World\'s Languages',
        author: 'Peter Ladefoged',
      });
    }, 30000);
  });
});
