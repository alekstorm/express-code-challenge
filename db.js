const Sequelize = require('sequelize');

const config = require('./config/config.json');

const storage = config[process.env.NODE_ENV || 'development'].storage;
module.exports = new Sequelize(`sqlite:${storage}`, {logging: false});
