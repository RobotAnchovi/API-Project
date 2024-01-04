"use strict";

const { GroupImage } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await GroupImage.bulkCreate(
      [
        {
          groupId: 1,
          url: "image url",
          preview: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          groupId: 2,
          url: "image url",
          preview: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          groupId: 3,
          url: "image url",
          preview: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          groupId: 4,
          url: "image url",
          preview: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          groupId: 5,
          url: "image url",
          preview: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "GroupImages";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        // Adjust the condition to match the records you want to delete
        id: { [Op.in]: [1, 2, 3, 4, 5] },
      },
      {}
    );
  },
};
