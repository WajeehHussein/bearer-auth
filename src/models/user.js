'use strict';


// Create a Sequelize model
const Users = (sequelize, DataTypes) =>

    sequelize.define('User', {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            uniqe: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    });

module.exports = Users;