const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Your Sequelize instance
const User = require('./User'); // User model

const SupportTicket = sequelize.define('SupportTicket', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('open', 'in_progress', 'resolved', 'closed'),
        defaultValue: 'open',
    },
    organizationId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'Organizations',
            key: 'id',
        },
    },
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt
});

SupportTicket.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = SupportTicket;
