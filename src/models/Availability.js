// Availability Model using class syntax
const { Model, DataTypes } = require('sequelize');
const Organization = require('./Organization');
const sequelize = require('../config/db');

class Availability extends Model {}

Availability.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    organizationId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Organizations',
        key: 'id',
      },
    },
    availabilityData: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Availability',
    tableName: 'availability',
    timestamps: true,
  }
);

Availability.belongsTo(Organization, { foreignKey: 'organizationId' });

module.exports = Availability;
