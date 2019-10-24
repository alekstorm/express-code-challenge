module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('institutions', [{
        id: 1,
        name: 'Massachusetts Institute of Technology',
        url: 'https://web.mit.edu',
        email_domain: 'mit.edu',
        created_at: new Date(),
        updated_at: new Date(),
      }, {
        id: 2,
        name: 'Stanford University',
        url: 'https://stanford.edu',
        email_domain: 'stanford.edu',
        created_at: new Date(),
        updated_at: new Date(),
      }], {});

    await queryInterface.bulkInsert('books', [{
        id: 1,
        isbn: '978-0132166751',
        title: 'A Balanced Introduction to Computer Science',
        author: 'David Reed',
        created_at: new Date(),
        updated_at: new Date(),
      }, {
        id: 2,
        isbn: '978-0631198154',
        title: 'The Sounds of the World\'s Languages',
        author: 'Peter Ladefoged',
        created_at: new Date(),
        updated_at: new Date(),
      }], {});

    await queryInterface.bulkInsert('institutions_books', [{
        id: 1,
        institution_id: 1,
        book_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      }, {
        id: 2,
        institution_id: 1,
        book_id: 2,
        created_at: new Date(),
        updated_at: new Date(),
      }, {
        id: 3,
        institution_id: 2,
        book_id: 2,
        created_at: new Date(),
        updated_at: new Date(),
      }], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('institutions_books', null, {});
    await queryInterface.bulkDelete('institutions', null, {});
    await queryInterface.bulkDelete('books', null, {});
  },
};
