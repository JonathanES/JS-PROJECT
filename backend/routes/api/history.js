const db = require('../../src/history');

module.exports = function (app) {
    app.get('/history', db.getAllHistory);
    app.get('/history/:id', db.getSingleHistory);
    app.get('/history/views/:url', db.getAllVideoViews);
    app.get('/history/user/:id', db.getAllHistoryUser);
    app.get('/history/:iduser/:url', db.getViewsByUser);

    app.post('/history', db.createHistory);

    app.delete('/history/:id', db.removeHistory);
    app.delete('/history/user/:id', db.removeHistoryByUserId);
    app.delete('/history/deleteall/:id', db.removeAllHistory);

};