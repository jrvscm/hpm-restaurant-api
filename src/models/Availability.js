const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Availability = sequelize.define('Availability', {
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
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Date is required.',
            },
            isDate: {
                msg: 'Must be a valid date.',
            },
        },
    },
    startTime: {
        type: DataTypes.TIME,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Start time is required.',
            },
            is: {
                args: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
                msg: 'Start time must be in HH:MM format.',
            },
        },
    },
    endTime: {
        type: DataTypes.TIME,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'End time is required.',
            },
            is: {
                args: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
                msg: 'End time must be in HH:MM format.',
            },
        },
    },
    maxGuests: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            isInt: {
                msg: 'Max guests must be an integer.',
            },
            min: {
                args: 1,
                msg: 'Max guests must be at least 1.',
            },
        },
    },
    blocked: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
}, {
    timestamps: true,
});

module.exports = Availability;
