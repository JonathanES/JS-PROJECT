const promise = require('bluebird');
const moment = require('moment');

const options = {
    // Initialization Options
    promiseLib: promise
};
// config local

const config = {
    user: 'postgres',
    database: 'youtuberepeat',
    password: 'pwd',
    host: 'localhost',
    port: 5432,
};

const pgp = require('pg-promise')(options);
const db = pgp(config);

module.exports =  db ;
