const models =   require('express').Router();

const repeat = require('./repeat')(models);
const user = require('./user')(models);

module.exports = models;