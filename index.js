'use strict';

require('dotenv').config();
let PORT = process.env.PORT

const server = require('./src/server')
const { sequelize } = require('./src/models/index')


sequelize.sync().then(() => {
    server.start();
}).catch(e => {
    console.error('Could not start server', e.message);
});