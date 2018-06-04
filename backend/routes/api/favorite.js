const db = require('../../src/favorite');

module.exports = function (app) {
    app.get('/favorite', db.getAllFavorite);
    app.get('/favorite/:id', db.getSingleFavorite);
    app.post('/favorite', db.createFavorite);
    app.delete('/favorite/:id', db.removeFavorite);
};