const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const UserPoints = sequelize.define('UserPoints', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID, // Match UUID type with Users.id
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    organizationId: {
      type: DataTypes.UUID, // Match UUID type with Organizations.id
      allowNull: false,
      references: {
        model: 'Organizations',
        key: 'id',
      },
    },
    totalPoints: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  }, {
    timestamps: true,
    tableName: 'user_points',
  });
  
  module.exports = UserPoints;
  
