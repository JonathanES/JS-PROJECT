const db = require('../../src/favorite');

module.exports = function (app) {
    app.get('/favorite', db.getAllFavorite);
    app.get('/favorite/:id/:id_user', db.getSingleFavorite);
    app.post('/favorite', db.createFavorite);
    app.delete('/favorite/:id/:id_user', db.removeFavorite);
};