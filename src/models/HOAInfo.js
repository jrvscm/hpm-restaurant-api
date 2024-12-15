const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Adjust the path to your Sequelize instance

class HOAInfo extends Model {}

HOAInfo.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users', // Table name
        key: 'id',
      },
      onDelete: 'CASCADE', // Adjust as needed
      onUpdate: 'CASCADE',
    },
    organizationId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Organizations', // Table name
        key: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'HOAInfo',
    tableName: 'HOAInfos', // Explicit table name
    timestamps: true,
  }
);

module.exports = HOAInfo;
