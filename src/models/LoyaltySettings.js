const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const LoyaltySettings = sequelize.define('LoyaltySettings', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  organizationId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Organizations',
      key: 'id',
    },
  },
  pointsPerDollar: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 1,
  },
}, {
  timestamps: true,
  tableName: 'loyalty_settings',
});

module.exports = LoyaltySettings;
