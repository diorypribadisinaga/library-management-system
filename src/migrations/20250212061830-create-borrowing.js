'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Borrowings', {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()')
      },
      book_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Books',
          key: 'id',
        }
      },
      member_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Members',
          key: 'id',
        }
      },
      borrow_date: {
        allowNull: false,
        type: Sequelize.DATEONLY
      },
      return_date: {
        allowNull: true,
        type: Sequelize.DATEONLY
      },
      status:{
        type: Sequelize.ENUM('BORROWED','RETURNED'),
        allowNull: false,
        defaultValue: 'BORROWED'
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Borrowings');
  }
};
