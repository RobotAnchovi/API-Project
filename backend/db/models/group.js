//*====> backend/db/models/group.js <====
"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    static associate(models) {
      //^ Associations
      Group.hasMany(models.GroupImage, {
        foreignKey: "groupId",
        as: "groupImages",
        onDelete: "CASCADE",
      });

      Group.belongsTo(models.User, {
        foreignKey: "organizerId",
        as: "organizer",
      });
      Group.hasMany(models.Membership, {
        foreignKey: "groupId",
        as: "memberships",
        onDelete: "CASCADE",
      });
      Group.hasMany(models.Venue, {
        foreignKey: "groupId",
        as: "venues",
        onDelete: "CASCADE",
      });
      Group.hasMany(models.Event, {
        foreignKey: "groupId",
        as: "events",
        onDelete: "CASCADE",
      });
    }
  }

  Group.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      organizerId: {
        type: DataTypes.INTEGER,
        references: { model: "Users", key: "id" },
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      about: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: [["Online", "In person"]],
        },
      },
      private: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      city: DataTypes.STRING,
      state: DataTypes.STRING,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Group",
      tableName: "Groups",
      timestamps: true,
    }
  );

  return Group;
};
