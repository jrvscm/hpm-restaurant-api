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
            type: DataTypes.UUID, // Add organizationId
            allowNull: false, // Adjust as needed
            references: {
                model: 'Organizations',
                key: 'id',
            },
        },
        amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        dueDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM('pending', 'paid', 'overdue'),
            defaultValue: 'pending',
        },
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt
        tableName: 'Payments',
    }
);

module.exports = Payment;
