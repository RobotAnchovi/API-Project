"use strict";

const { Membership } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await Membership.bulkCreate(
      [
        {
          userId: 1,
          groupId: 1,
          status: "co-host",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: 2,
          groupId: 2,
          status: "member",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: 1,
          groupId: 2,
          status: "pending",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: 1,
          groupId: 3,
          status: "member",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: 3,
          groupId: 3,
          status: "co-host",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: 2,
          groupId: 2,
          status: "co-host",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: 4,
          groupId: 4,
          status: "member",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: 5,
          groupId: 5,
          status: "pending",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: 6,
          groupId: 6,
          status: "member",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: 7,
          groupId: 7,
          status: "co-host",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Memberships";
    await queryInterface.bulkDelete(options);
  },
};
