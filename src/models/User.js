const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define(
    'User',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        fullName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Full name is required.',
                },
            },
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: {
                    msg: 'Must be a valid email address.',
                },
            },
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Phone number is required.',
                },
                is: {
                    args: /^[0-9\-\+\s]*$/,
                    msg: 'Phone number must contain only numbers, spaces, dashes, or plus signs.',
                },
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
            type: DataTypes.ENUM('pending', 'verified', 'invited'),
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
        organizationId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'Organizations',
                key: 'id',
            },
        },
    },
    {
        tableName: 'Users',
        timestamps: true,
    }
);

module.exports = User;
