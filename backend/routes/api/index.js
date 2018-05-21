const models =   require('express').Router();

const repeat = require('./repeat')(models);

module.exports = models;