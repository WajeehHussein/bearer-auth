'use strict';


// Create a Sequelize model
const Users = (sequelize, DataTypes) =>

    sequelize.define('users', {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            uniqe: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        token: {
            type: DataTypes.VIRTUAL,
        }
    });

Users.authenticateBearer = async function (token) {
    const parsedToken = jwt.verify(token, SECRET);
    console.log('parsedToken >>>>>>>>>>>>>>>>>>', parsedToken);
    const user = await Users.findOne({ where: { username: parsedToken.username } });
    if (user.username) {
        return user;
    } else {
        throw new Error("Invalid Token");
    }
}

module.exports = Users;