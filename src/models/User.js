const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Ensure this points to your Sequelize instance

const User = sequelize.define(
    'User',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: DataTypes.ENUM('admin', 'pending_admin', 'user'),
            defaultValue: 'user',
        },
        status: {
            type: DataTypes.ENUM('pending', 'verified'),
            defaultValue: 'pending',
        },
        verificationToken: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        resetToken: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        resetTokenExpiry: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        tableName: 'Users', // The table name in your database
        timestamps: true, // Automatically adds createdAt and updatedAt fields
    }
);

module.exports = User;
