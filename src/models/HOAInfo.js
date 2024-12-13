// models/HOAInfo.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const HOAInfo = sequelize.define('HOAInfo', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    createdBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

module.exports = HOAInfo;
