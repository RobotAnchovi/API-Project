"use strict";

const { Group } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await Group.bulkCreate(
      [
        {
          organizerId: 1,
          name: "Outdoor Adventurers",
          about: "A group for outdoor enthusiasts",
          type: "In person",
          private: false,
          city: "San Francisco",
          state: "CA",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          organizerId: 1,
          name: "Techno Talks",
          about: "Discussing the latest in technology",
          type: "Online",
          private: false,
          city: "New York",
          state: "NY",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          organizerId: 1,
          name: "Readers Club",
          about: "Monthly fiction and non-fiction book discussions",
          type: "In person",
          private: true,
          city: "Chicago",
          state: "IL",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          organizerId: 3,
          name: "Movie Knights",
          about: "Weekly gatherings to watch and discuss movies",
          type: "In person",
          private: false,
          city: "Los Angeles",
          state: "CA",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          organizerId: 2,
          name: "Culinary Club",
          about: "Share recipes and cooking techniques",
          type: "Online",
          private: false,
          city: "Seattle",
          state: "WA",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          organizerId: 2,
          name: "Fitness Fanatics",
          about: "Group focused on fitness and wellness activities",
          type: "In person",
          private: false,
          city: "Miami",
          state: "FL",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          organizerId: 3,
          name: "Game On",
          about: "Board game nights and discussion",
          type: "Online",
          private: true,
          city: "Austin",
          state: "TX",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          organizerId: 1,
          name: "Music Makers",
          about: "A community for aspiring musicians",
          type: "In person",
          private: false,
          city: "Nashville",
          state: "TN",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          organizerId: 2,
          name: "Artists' Haven",
          about: "A space for artists to collaborate and share their work",
          type: "Online",
          private: true,
          city: "Portland",
          state: "OR",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          organizerId: 3,
          name: "Green Thumbs",
          about: "Gardening and plant care discussions",
          type: "In person",
          private: false,
          city: "Denver",
          state: "CO",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Groups";
    await queryInterface.bulkDelete(options);
  },
};
