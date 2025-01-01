const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Reservation = sequelize.define('Reservation', {
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
    userId: {
        type: DataTypes.UUID,
        allowNull: true, // Optional for walk-ins
        references: {
            model: 'Users',
            key: 'id',
        },
    },
    contactName: {
        type: DataTypes.STRING,
        allowNull: false, // Making it a required field, can be adjusted to allow null
        validate: {
            notNull: {
                msg: 'Contact name is required.',
            },
            len: {
                args: [1, 255],
                msg: 'Contact name must be between 1 and 255 characters.',
            },
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
    time: {
        type: DataTypes.TIME,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Time is required.',
            },
            is: {
                args: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
                msg: 'Time must be in HH:MM format.',
            },
        },
    },
    guests: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            isInt: {
                msg: 'Number of guests must be an integer.',
            },
            min: {
                args: 1,
                msg: 'Number of guests must be at least 1.',
            },
        },
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM('pending', 'confirmed', 'cancelled'),
        defaultValue: 'pending',
        allowNull: false,
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,  // Mandatory field for phone number
        validate: {
            is: {
                args: /^[0-9]{10}$/,  // Phone number must be 10 digits (you can adjust this pattern as needed)
                msg: 'Phone number must be 10 digits.',
            },
        },
    },
}, {
    timestamps: true,
});

module.exports = Reservation;
