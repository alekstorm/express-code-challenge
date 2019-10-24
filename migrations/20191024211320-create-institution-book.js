module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('institutions_books', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      institution_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'institutions',
          key: 'id',
        },
      },
      book_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'books',
          key: 'id',
        },
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }, {
      uniqueKeys: {
        actions_unique: {
          fields: ['institution_id', 'book_id'],
        },
      },
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('institutions_books');
  },
};
