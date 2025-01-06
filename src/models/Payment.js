const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Payment = sequelize.define(
    'Payment',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id',
            },
        },
        organizationId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'Organizations',
                key: 'id',
            },
        },
        amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        paymentIntentId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        pointsEarned: {
            type: DataTypes.INTEGER,
            allowNull: true, // Optional, depending on logic
        },
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt
        tableName: 'Payments',
    }
);

module.exports = Payment;
