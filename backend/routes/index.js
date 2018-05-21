const routes = require('express').Router();
const api = require('./api');

routes.use('/api', api);

routes.get('/', (req, res) => {
    res.render('index');
});

module.exports = routes;