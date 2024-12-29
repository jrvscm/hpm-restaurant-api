const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class Organization extends Model {}

Organization.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                notNull: {
                    msg: 'Organization name is required.',
                },
                notEmpty: {
                    msg: 'Organization name cannot be empty.',
                },
                len: {
                    args: [3, 100],
                    msg: 'Organization name must be between 3 and 100 characters.',
                },
            },
        },
        address: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                len: {
                    args: [0, 255],
                    msg: 'Address must be less than 255 characters.',
                },
            },
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                is: {
                    args: /^[0-9]{10,15}$/, // Allows phone numbers with 10-15 digits
                    msg: 'Phone number must contain only digits and be 10-15 characters long.',
                },
            },
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                isEmail: {
                    msg: 'Email address must be valid.',
                },
            },
        },
        website: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                isUrl: {
                    msg: 'Website must be a valid URL.',
                },
            },
        },
        logo: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                isUrl: {
                    msg: 'Logo must be a valid URL.',
                },
            },
        },
        subscriptionPlan: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'basic',
            validate: {
                isIn: {
                    args: [['basic', 'premium', 'enterprise']],
                    msg: 'Subscription plan must be one of: basic, premium, enterprise.',
                },
            },
        },
        active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        timezone: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                len: {
                    args: [0, 50],
                    msg: 'Timezone must be less than 50 characters.',
                },
            },
        },
        createdBy: {
            type: DataTypes.UUID,
            allowNull: true,
        },
        apiKey: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: {
                    msg: 'API key cannot be empty.',
                },
            },
        },
        openTime: {
            type: DataTypes.TIME,
            defaultValue: '09:00',
        },
        closeTime: {
            type: DataTypes.TIME,
            defaultValue: '21:00',
        },
    },
    {
        sequelize, // Pass the sequelize instance here
        modelName: 'Organization',
        timestamps: true, // Adds createdAt and updatedAt
    }
);

module.exports = Organization;
