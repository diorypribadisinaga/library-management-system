'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const members = require('../data/members.js')

    return queryInterface.bulkInsert('Members', [
        ...members,
    ]);

  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Members', null, {});
  }
};
