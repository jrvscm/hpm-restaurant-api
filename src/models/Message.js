const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User'); // Assuming User model is already defined

const Message = sequelize.define('Message', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, // Automatically generate UUID
        primaryKey: true,
    },
    senderId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: User, // Reference the User model
            key: 'id',
        },
    },
    recipientId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: User, // Reference the User model
            key: 'id',
        },
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
    tableName: 'Messages', // Optional: Explicit table name
});

// Set up associations
Message.belongsTo(User, { as: 'sender', foreignKey: 'senderId' });
Message.belongsTo(User, { as: 'recipient', foreignKey: 'recipientId' });

module.exports = Message;
