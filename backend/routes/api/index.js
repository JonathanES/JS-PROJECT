const api =   require('express').Router();

const repeat = require('./repeat')(api);
const user = require('./user')(api);
const history = require('./history')(api);

module.exports = api;