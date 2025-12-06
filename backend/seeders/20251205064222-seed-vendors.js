"use strict";

const { v4: uuidv4 } = require("uuid");

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    return queryInterface.bulkInsert(
      "Vendors",
      [
        {
          id: uuidv4(),
          name: "Service 8",
          category: "Electronics",
          email: "service8Computers@example.com",
          metadata: JSON.stringify({ address: "abcd location" }),
          created_at: now,
        },
        {
          id: uuidv4(),
          name: "Service 4",
          category: "IT hardware",
          email: "service4Computers@example.com",
          metadata: JSON.stringify({ address: "abcd location" }),
          created_at: now,
        },
        {
          id: uuidv4(),
          name: "Service 5",
          category: "IT hardware",
          email: "service5Computers@example.com",
          metadata: JSON.stringify({ address: "efgh location" }),
          created_at: now,
        },
        {
          id: uuidv4(),
          name: "Service 7",
          category: "IT vendor",
          email: "service7Computers@example.com",
          metadata: JSON.stringify({ address: "abcd location" }),
          created_at: now,
        },
        {
          id: uuidv4(),
          name: "Service 8",
          category: "IT equipment",
          email: "service8Computers@example.com",
          metadata: JSON.stringify({ address: "abcd location" }),
          created_at: now,
        },
        {
          id: uuidv4(),
          name: "Service 1",
          category: "computers",
          email: "service1Computers@example.com",
          metadata: JSON.stringify({ address: "abcd location" }),
          created_at: now,
        },
        {
          id: uuidv4(),
          name: "Service 2",
          category: "computers",
          email: "service2Computers@example.com",
          metadata: JSON.stringify({ address: "efgh location" }),
          created_at: now,
        },
        {
          id: uuidv4(),
          name: "Service 3",
          category: "vehicles",
          email: "service3vehicle@mail.com",
          metadata: JSON.stringify({ address: "jklm location" }),
          created_at: now,
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Vendors", null, {});
  },
};
