const db = require('../../src/user');

module.exports = function (app) {
    app.get('/user', db.getAllUser);
    app.get('/user/:id', db.getSingleUser);
    app.get('/user/email/:email/:pwd',db.getSingleUserByEmail);
    app.post('/user', db.createUser);
    app.put('/user/:id', db.updateUser);
    app.delete('/user/:id', db.removeUser);
    app.get('/user/delete/:id', db.removeUser);
};