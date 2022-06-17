"use strict";
require('dotenv').config()
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const Users = (sequelize, DataTypes) => {
    const model = sequelize.define("users", {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        token: {
            type: DataTypes.VIRTUAL,
        },
    });

    model.beforeCreate = async function (password) {
        let hashedPass = await bcrypt.hash(password, 10);

        return hashedPass;
    };

    model.authenticateBasic = async function (username, password) {
        const user = await this.findOne({ where: { username: username }, });

        const valid = await bcrypt.compare(password, user.password);

        if (valid) {

            let newToken = jwt.sign({ username: user.username }, process.env.API_SECRET, {
                expiresIn: "15m"
            });
            // console.log('********', newToken);
            user.token = newToken;
            return user;
        }
        throw new Error("Invalid User");
    };

    model.authenticateBearer = async function (token) {
        try {
            const parsedToken = jwt.verify(token, process.env.API_SECRET || "secret word");
            const user = this.findOne({ where: { username: parsedToken.username } });
            if (user) {
                return user;
            }
            throw new Error("User Not Found");
        } catch (e) {
            throw new Error(e.message);
        }
    };

    return model;
};

module.exports = Users;
// 'use strict';


// // Create a Sequelize model
// const Users = (sequelize, DataTypes) =>

//     sequelize.define('users', {
//         username: {
//             type: DataTypes.STRING,
//             allowNull: false,
//             uniqe: true
//         },
//         password: {
//             type: DataTypes.STRING,
//             allowNull: false,
//         },
//         token: {
//             type: DataTypes.VIRTUAL,
//         }
//     });


// Users.authenticateBearer = async function (token) {
//     const parsedToken = jwt.verify(token, SECRET);
//     console.log('/////////////////////////////////////', parsedToken);
//     const user = await Users.findOne({ where: { username: parsedToken.username } });
//     if (user.username) {
//         return user;
//     } else {
//         throw new Error("Invalid Token");
//     }
// }


// module.exports = Users;

// 'use strict';
// require("dotenv").config();

// const { sequelize, DataTypes } = require("./index");

// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const SECRET = process.env.API_SECRET || "any word";

// const Users = sequelize.define("users", {
//     username: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         unique: true,
//     },
//     password: {
//         type: DataTypes.STRING,
//         allowNull: false,
//     },
//     token: {
//         type: DataTypes.VIRTUAL,
//     }
// });

// Users.authenticateBasic = async function (username, password) {
//     const user = await users.findOne({ where: { username: username } })
//     const valid = await bcrypt.compare(password, user.password)
//     if (valid) {
//         let newToken = jwt.sign({ username: user.username }, SECRET);
//         // console.log('************************', newToken);
//         user.token = newToken;
//         return user;
//     }
//     else {
//         throw new Error("Invalid user");
//     }
// }
// Users.authenticateBearer = async function (token) {
//     const parsedToken = jwt.verify(token, SECRET);
//     console.log('parsedToken >>>>>>>>>>>>>>>>>>', parsedToken);
//     const user = await Users.findOne({ where: { username: parsedToken.username } });
//     if (user.username) {
//         return user;
//     } else {
//         throw new Error("Invalid Token");
//     }
// }
// module.exports = Users;