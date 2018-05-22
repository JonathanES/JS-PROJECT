const db = require('../../src/history');

module.exports = function (app) {
    app.get('/history', db.getAllHistory);
    app.get('/history/:id', db.getSingleHistory);
    app.get('/history/user/:id', db.getAllHistoryUser);
    app.post('/history', db.createHistory);
    app.delete('/history/:id', db.removeHistory);
    app.delete('/history/user/:id', db.removeHistoryByUserId);
    app.get('/history/delete/:id', db.removeHistory);
    app.delete('/history/deleteall/:id', db.removeAllHistory);

};