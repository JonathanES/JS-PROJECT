const api =   require('express').Router();

const repeat = require('./repeat')(api);
const user = require('./user')(api);
const history = require('./history')(api);
const comment = require('./comment')(api);
const videos = require('./videos')(api);

module.exports = api;