const db = require('../../src/comment');

module.exports = function (app) {
    app.get('/comment', db.getAllComment);
    app.get('/comment/:id', db.getSingleComment);
    app.get('/comment/barcode/:id', db.getSingleCommentByUrl);
    app.post('/comment', db.createComment);
    app.put('/comment/:id', db.updateComment);
    app.delete('/comment/:id', db.removeComment);
    app.get('/comment/delete/:id', db.removeComment);
    app.delete('/comment/deleteall/:id', db.removeAllComment);
};