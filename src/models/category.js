const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');

const category = sequelize.define('category', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true,
    },
});

module.exports = category;